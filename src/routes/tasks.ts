import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get all available tasks
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const type = req.query.type as string;
  const skip = (page - 1) * limit;

  const where: any = {
    status: 'ACTIVE',
  };

  if (type && ['MANUAL', 'ADGEM', 'ADSTERRA', 'CPALEAD'].includes(type)) {
    where.type = type;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    success: true,
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Get task by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({
    success: true,
    task,
  });
}));

// Start a task
router.post('/:id/start', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id;
  const userId = req.user!.id;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task.status !== 'ACTIVE') {
    return res.status(400).json({ error: 'Task is not active' });
  }

  // Check if user already started this task
  const existingUserTask = await prisma.userTask.findUnique({
    where: {
      userId_taskId: {
        userId,
        taskId,
      },
    },
  });

  if (existingUserTask) {
    return res.status(400).json({ error: 'You have already started this task' });
  }

  // Check max participants
  if (task.maxParticipants && task.currentParticipants >= task.maxParticipants) {
    return res.status(400).json({ error: 'Task is full' });
  }

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId,
      taskId,
      status: 'PENDING',
      reward: task.reward,
    },
  });

  // Update task participants count
  await prisma.task.update({
    where: { id: taskId },
    data: {
      currentParticipants: {
        increment: 1,
      },
    },
  });

  logger.info(`User ${userId} started task ${taskId}`);

  res.status(201).json({
    success: true,
    message: 'Task started successfully',
    userTask,
  });
}));

// Submit proof for a task
const submitProofSchema = z.object({
  proofUrl: z.string().url().optional(),
  proofText: z.string().optional(),
});

router.post('/:id/submit-proof', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id;
  const userId = req.user!.id;
  const data = submitProofSchema.parse(req.body);

  if (!data.proofUrl && !data.proofText) {
    return res.status(400).json({ error: 'Proof URL or text is required' });
  }

  const userTask = await prisma.userTask.findUnique({
    where: {
      userId_taskId: {
        userId,
        taskId,
      },
    },
    include: { task: true },
  });

  if (!userTask) {
    return res.status(404).json({ error: 'Task not found or not started' });
  }

  if (userTask.status !== 'PENDING') {
    return res.status(400).json({ error: 'Proof already submitted for this task' });
  }

  // Create proof
  const proof = await prisma.proof.create({
    data: {
      userId,
      taskId,
      userTaskId: userTask.id,
      proofUrl: data.proofUrl,
      proofText: data.proofText,
      status: 'PENDING',
    },
  });

  logger.info(`Proof submitted for task ${taskId} by user ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Proof submitted successfully. Waiting for admin review.',
    proof,
  });
}));

// Get user's tasks
router.get('/user/my-tasks', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    where.status = status;
  }

  const [userTasks, total] = await Promise.all([
    prisma.userTask.findMany({
      where,
      include: {
        task: true,
        proofs: true,
      },
      orderBy: { startedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.userTask.count({ where }),
  ]);

  res.json({
    success: true,
    tasks: userTasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Get available offers
router.get('/offers/available', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const source = req.query.source as string;
  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
  };

  if (source && ['AdGem', 'Adsterra', 'CPAlead'].includes(source)) {
    where.source = source;
  }

  const [offers, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.offer.count({ where }),
  ]);

  res.json({
    success: true,
    offers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Complete an offer (external integration)
router.post('/offers/:id/complete', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const offerId = req.params.id;
  const userId = req.user!.id;

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
  });

  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  if (!offer.isActive) {
    return res.status(400).json({ error: 'Offer is not active' });
  }

  // Create a task for this offer completion
  const task = await prisma.task.create({
    data: {
      title: `Complete ${offer.title}`,
      description: offer.description,
      type: offer.source.toUpperCase() as any,
      reward: offer.reward,
      url: offer.url,
      externalId: offer.externalId,
      proofRequired: true,
      status: 'ACTIVE',
    },
  });

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId,
      taskId: task.id,
      status: 'PENDING',
      reward: offer.reward,
    },
  });

  logger.info(`User ${userId} completed offer ${offerId}`);

  res.status(201).json({
    success: true,
    message: 'Offer completed successfully',
    task,
    userTask,
  });
}));

// Get task statistics
router.get('/stats/overview', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    totalEarnings,
    taskTypes,
  ] = await Promise.all([
    prisma.userTask.count({
      where: { userId },
    }),
    prisma.userTask.count({
      where: {
        userId,
        status: 'APPROVED',
      },
    }),
    prisma.userTask.count({
      where: {
        userId,
        status: 'PENDING',
      },
    }),
    prisma.userTask.aggregate({
      where: {
        userId,
        status: 'APPROVED',
      },
      _sum: { reward: true },
    }),
    prisma.userTask.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
  ]);

  res.json({
    success: true,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalEarnings: totalEarnings._sum.reward || 0,
      taskTypes,
    },
  });
}));

export default router;