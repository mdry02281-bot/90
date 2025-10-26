import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, adminMiddleware, superAdminMiddleware } from '../middleware/auth';
import { sendApprovalEmail } from '../services/email';

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get dashboard stats
router.get('/dashboard', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const [
    totalUsers,
    pendingUsers,
    totalTasks,
    activeTasks,
    totalWithdrawals,
    pendingWithdrawals,
    totalRevenue,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isApproved: false } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'ACTIVE' } }),
    prisma.withdrawal.count(),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.transaction.aggregate({
      where: { type: 'TASK_REWARD' },
      _sum: { amount: true },
    }),
    prisma.adminAction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        admin: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    }),
  ]);

  res.json({
    success: true,
    stats: {
      users: {
        total: totalUsers,
        pending: pendingUsers,
        approved: totalUsers - pendingUsers,
      },
      tasks: {
        total: totalTasks,
        active: activeTasks,
      },
      withdrawals: {
        total: totalWithdrawals,
        pending: pendingWithdrawals,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
      },
      recentActivity,
    },
  });
}));

// Get all users with pagination and filters
router.get('/users', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const role = req.query.role as string;
  const search = req.query.search as string;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status === 'pending') where.isApproved = false;
  if (status === 'approved') where.isApproved = true;
  if (status === 'suspended') where.isSuspended = true;

  if (role && ['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        wallet: true,
        _count: {
          select: {
            transactions: true,
            tasks: true,
            referrals: true,
            withdrawals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Approve user
router.post('/users/:id/approve', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.params.id;
  const adminId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isApproved) {
    return res.status(400).json({ error: 'User is already approved' });
  }

  // Get welcome bonus amount
  const welcomeBonusSetting = await prisma.setting.findUnique({
    where: { key: 'WELCOME_BONUS' },
  });

  const welcomeBonus = parseFloat(welcomeBonusSetting?.value || '5.00');

  // Update user status
  await prisma.user.update({
    where: { id: userId },
    data: { isApproved: true },
  });

  // Add welcome bonus to wallet
  await prisma.wallet.update({
    where: { userId },
    data: {
      balance: { increment: welcomeBonus },
      totalEarned: { increment: welcomeBonus },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: 'SIGNUP_BONUS',
      amount: welcomeBonus,
      description: `Welcome bonus: $${welcomeBonus}`,
      metadata: {
        bonusType: 'welcome',
        approvedBy: adminId,
      },
    },
  });

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: 'USER_APPROVED',
      targetType: 'USER',
      targetId: userId,
      description: `Approved user ${user.email} and credited $${welcomeBonus} welcome bonus`,
      metadata: {
        welcomeBonus,
        userEmail: user.email,
      },
    },
  });

  // Send approval email
  try {
    await sendApprovalEmail(user.email, user.fullName);
  } catch (error) {
    logger.error('Failed to send approval email:', error);
  }

  logger.info(`User approved: ${user.email} by admin ${adminId}`);

  res.json({
    success: true,
    message: 'User approved successfully',
    welcomeBonus,
  });
}));

// Suspend/unsuspend user
router.post('/users/:id/suspend', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.params.id;
  const adminId = req.user!.id;
  const { suspended, reason } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isSuspended: suspended },
  });

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: suspended ? 'USER_SUSPENDED' : 'USER_UNSUSPENDED',
      targetType: 'USER',
      targetId: userId,
      description: `${suspended ? 'Suspended' : 'Unsuspended'} user ${user.email}${reason ? `: ${reason}` : ''}`,
      metadata: {
        suspended,
        reason,
        userEmail: user.email,
      },
    },
  });

  logger.info(`User ${suspended ? 'suspended' : 'unsuspended'}: ${user.email} by admin ${adminId}`);

  res.json({
    success: true,
    message: `User ${suspended ? 'suspended' : 'unsuspended'} successfully`,
  });
}));

// Credit/debit user wallet
const walletAdjustmentSchema = z.object({
  amount: z.number(),
  type: z.enum(['credit', 'debit']),
  reason: z.string().min(1),
});

router.post('/users/:id/wallet-adjust', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.params.id;
  const adminId = req.user!.id;
  const data = walletAdjustmentSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.wallet) {
    return res.status(404).json({ error: 'User wallet not found' });
  }

  const amount = data.type === 'credit' ? data.amount : -data.amount;

  if (data.type === 'debit' && Number(user.wallet.balance) < data.amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  // Update wallet
  await prisma.wallet.update({
    where: { userId },
    data: {
      balance: { increment: amount },
      totalEarned: data.type === 'credit' ? { increment: data.amount } : undefined,
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: data.type === 'credit' ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
      amount,
      description: `Admin ${data.type}: $${Math.abs(data.amount)} - ${data.reason}`,
      metadata: {
        adminId,
        reason: data.reason,
        type: data.type,
      },
    },
  });

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: data.type === 'credit' ? 'WALLET_CREDIT' : 'WALLET_DEBIT',
      targetType: 'USER',
      targetId: userId,
      description: `${data.type === 'credit' ? 'Credited' : 'Debited'} $${data.amount} to user ${user.email}: ${data.reason}`,
      metadata: {
        amount: data.amount,
        type: data.type,
        reason: data.reason,
        userEmail: user.email,
      },
    },
  });

  logger.info(`Wallet ${data.type}: $${data.amount} for user ${user.email} by admin ${adminId}`);

  res.json({
    success: true,
    message: `Wallet ${data.type} successful`,
  });
}));

// Get all tasks
router.get('/tasks', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const type = req.query.type as string;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status && ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
    where.status = status;
  }

  if (type && ['MANUAL', 'ADGEM', 'ADSTERRA', 'CPALEAD'].includes(type)) {
    where.type = type;
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        _count: {
          select: {
            userTasks: true,
            proofs: true,
          },
        },
      },
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

// Create new task
const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['MANUAL', 'ADGEM', 'ADSTERRA', 'CPALEAD']),
  reward: z.number().min(0.01),
  instructions: z.string().optional(),
  url: z.string().url().optional(),
  proofRequired: z.boolean().default(true),
  maxParticipants: z.number().optional(),
});

router.post('/tasks', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const adminId = req.user!.id;
  const data = createTaskSchema.parse(req.body);

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      reward: data.reward,
      instructions: data.instructions,
      url: data.url,
      proofRequired: data.proofRequired,
      maxParticipants: data.maxParticipants,
      status: 'ACTIVE',
      currentParticipants: 0,
    },
  });

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: 'TASK_CREATED',
      targetType: 'TASK',
      targetId: task.id,
      description: `Created task: ${task.title}`,
      metadata: {
        taskTitle: task.title,
        taskType: task.type,
        reward: task.reward,
      },
    },
  });

  logger.info(`Task created: ${task.title} by admin ${adminId}`);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task,
  });
}));

// Update task
router.put('/tasks/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id;
  const adminId = req.user!.id;
  const data = createTaskSchema.partial().parse(req.body);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  });

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: 'TASK_UPDATED',
      targetType: 'TASK',
      targetId: taskId,
      description: `Updated task: ${task.title}`,
      metadata: {
        taskTitle: task.title,
        changes: data,
      },
    },
  });

  logger.info(`Task updated: ${task.title} by admin ${adminId}`);

  res.json({
    success: true,
    message: 'Task updated successfully',
    task: updatedTask,
  });
}));

// Get pending proofs
router.get('/proofs/pending', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [proofs, total] = await Promise.all([
    prisma.proof.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            reward: true,
          },
        },
        userTask: true,
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    }),
    prisma.proof.count({ where: { status: 'PENDING' } }),
  ]);

  res.json({
    success: true,
    proofs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Approve/reject proof
router.post('/proofs/:id/review', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const proofId = req.params.id;
  const adminId = req.user!.id;
  const { status, rejectionReason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const proof = await prisma.proof.findUnique({
    where: { id: proofId },
    include: {
      user: true,
      task: true,
      userTask: true,
    },
  });

  if (!proof) {
    return res.status(404).json({ error: 'Proof not found' });
  }

  if (proof.status !== 'PENDING') {
    return res.status(400).json({ error: 'Proof already reviewed' });
  }

  // Update proof status
  await prisma.proof.update({
    where: { id: proofId },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  if (status === 'APPROVED') {
    // Update user task status
    await prisma.userTask.update({
      where: { id: proof.userTaskId },
      data: {
        status: 'APPROVED',
        completedAt: new Date(),
      },
    });

    // Credit user wallet
    await prisma.wallet.update({
      where: { userId: proof.userId },
      data: {
        balance: { increment: proof.userTask.reward },
        totalEarned: { increment: proof.userTask.reward },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: proof.userId,
        type: 'TASK_REWARD',
        amount: proof.userTask.reward,
        description: `Task completed: ${proof.task.title}`,
        metadata: {
          taskId: proof.taskId,
          proofId: proof.id,
          approvedBy: adminId,
        },
      },
    });
  } else {
    // Update user task status
    await prisma.userTask.update({
      where: { id: proof.userTaskId },
      data: {
        status: 'REJECTED',
      },
    });
  }

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: status === 'APPROVED' ? 'PROOF_APPROVED' : 'PROOF_REJECTED',
      targetType: 'PROOF',
      targetId: proofId,
      description: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} proof for task: ${proof.task.title}`,
      metadata: {
        proofId,
        taskTitle: proof.task.title,
        userEmail: proof.user.email,
        reward: status === 'APPROVED' ? proof.userTask.reward : 0,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    },
  });

  logger.info(`Proof ${status.toLowerCase()}: ${proofId} by admin ${adminId}`);

  res.json({
    success: true,
    message: `Proof ${status.toLowerCase()} successfully`,
  });
}));

// Get pending withdrawals
router.get('/withdrawals/pending', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
  ]);

  res.json({
    success: true,
    withdrawals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Process withdrawal
router.post('/withdrawals/:id/process', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const withdrawalId = req.params.id;
  const adminId = req.user!.id;
  const { status, txHash, rejectionReason } = req.body;

  if (!['PROCESSING', 'COMPLETED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
    include: { user: true },
  });

  if (!withdrawal) {
    return res.status(404).json({ error: 'Withdrawal not found' });
  }

  if (withdrawal.status !== 'PENDING') {
    return res.status(400).json({ error: 'Withdrawal already processed' });
  }

  // Update withdrawal status
  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status,
      txHash: status === 'COMPLETED' ? txHash : null,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      processedBy: adminId,
      processedAt: new Date(),
    },
  });

  if (status === 'REJECTED') {
    // Refund amount to user wallet
    await prisma.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        balance: { increment: withdrawal.amount },
        pendingBalance: { decrement: withdrawal.amount },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: withdrawal.userId,
        type: 'WITHDRAWAL',
        amount: withdrawal.amount,
        description: `Withdrawal rejected: $${withdrawal.amount} refunded`,
        metadata: {
          withdrawalId,
          reason: rejectionReason,
          processedBy: adminId,
        },
      },
    });
  } else if (status === 'COMPLETED') {
    // Update wallet totals
    await prisma.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        pendingBalance: { decrement: withdrawal.amount },
        totalWithdrawn: { increment: withdrawal.amount },
      },
    });
  }

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: `WITHDRAWAL_${status}`,
      targetType: 'WITHDRAWAL',
      targetId: withdrawalId,
      description: `${status} withdrawal: $${withdrawal.amount} USDT to ${withdrawal.walletAddress}`,
      metadata: {
        withdrawalId,
        amount: withdrawal.amount,
        usdtAmount: withdrawal.usdtAmount,
        walletAddress: withdrawal.walletAddress,
        network: withdrawal.network,
        txHash: status === 'COMPLETED' ? txHash : null,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        userEmail: withdrawal.user.email,
      },
    },
  });

  logger.info(`Withdrawal ${status.toLowerCase()}: ${withdrawalId} by admin ${adminId}`);

  res.json({
    success: true,
    message: `Withdrawal ${status.toLowerCase()} successfully`,
  });
}));

// Get level upgrade requests
router.get('/level-requests', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    where.status = status;
  }

  const [levelRequests, total] = await Promise.all([
    prisma.levelRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            level: true,
            wallet: {
              select: {
                balance: true,
                totalEarned: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    }),
    prisma.levelRequest.count({ where }),
  ]);

  res.json({
    success: true,
    levelRequests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Process level upgrade request
router.post('/level-requests/:id/process', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const requestId = req.params.id;
  const adminId = req.user!.id;
  const { status, rejectionReason } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const levelRequest = await prisma.levelRequest.findUnique({
    where: { id: requestId },
    include: { user: { include: { wallet: true } } },
  });

  if (!levelRequest) {
    return res.status(404).json({ error: 'Level request not found' });
  }

  if (levelRequest.status !== 'PENDING') {
    return res.status(400).json({ error: 'Level request already processed' });
  }

  // Update request status
  await prisma.levelRequest.update({
    where: { id: requestId },
    data: {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  if (status === 'APPROVED') {
    // Get level upgrade cost
    const upgradeCostSetting = await prisma.setting.findUnique({
      where: { key: `LEVEL_UPGRADE_L${levelRequest.requestedLevel}` },
    });

    const upgradeCost = parseFloat(upgradeCostSetting?.value || '0');

    // Update user level
    await prisma.user.update({
      where: { id: levelRequest.userId },
      data: { level: levelRequest.requestedLevel },
    });

    // Deduct upgrade cost from wallet
    await prisma.wallet.update({
      where: { userId: levelRequest.userId },
      data: {
        balance: { decrement: upgradeCost },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: levelRequest.userId,
        type: 'LEVEL_UPGRADE',
        amount: -upgradeCost,
        description: `Level upgrade to L${levelRequest.requestedLevel}: $${upgradeCost}`,
        metadata: {
          levelRequestId: requestId,
          newLevel: levelRequest.requestedLevel,
          upgradeCost,
          approvedBy: adminId,
        },
      },
    });
  }

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: status === 'APPROVED' ? 'LEVEL_UPGRADE_APPROVED' : 'LEVEL_UPGRADE_REJECTED',
      targetType: 'LEVEL_REQUEST',
      targetId: requestId,
      description: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} level upgrade request to L${levelRequest.requestedLevel}`,
      metadata: {
        levelRequestId: requestId,
        requestedLevel: levelRequest.requestedLevel,
        userEmail: levelRequest.user.email,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    },
  });

  logger.info(`Level upgrade request ${status.toLowerCase()}: ${requestId} by admin ${adminId}`);

  res.json({
    success: true,
    message: `Level upgrade request ${status.toLowerCase()} successfully`,
  });
}));

// Get settings
router.get('/settings', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const settings = await prisma.setting.findMany({
    orderBy: { key: 'asc' },
  });

  res.json({
    success: true,
    settings,
  });
}));

// Update settings
router.put('/settings', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const adminId = req.user!.id;
  const { settings } = req.body;

  if (!Array.isArray(settings)) {
    return res.status(400).json({ error: 'Settings must be an array' });
  }

  const updatedSettings = [];

  for (const setting of settings) {
    if (!setting.key || !setting.value) {
      return res.status(400).json({ error: 'Each setting must have key and value' });
    }

    const updatedSetting = await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });

    updatedSettings.push(updatedSetting);
  }

  // Create admin action record
  await prisma.adminAction.create({
    data: {
      adminId,
      action: 'SETTINGS_UPDATED',
      targetType: 'SETTINGS',
      targetId: 'global',
      description: `Updated ${updatedSettings.length} settings`,
      metadata: {
        updatedSettings: updatedSettings.map(s => ({ key: s.key, value: s.value })),
      },
    },
  });

  logger.info(`Settings updated by admin ${adminId}`);

  res.json({
    success: true,
    message: 'Settings updated successfully',
    settings: updatedSettings,
  });
}));

// Get analytics data
router.get('/analytics', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const days = parseInt(req.query.days as string) || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    userRegistrations,
    taskCompletions,
    withdrawals,
    revenue,
  ] = await Promise.all([
    prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: true,
    }),
    prisma.userTask.groupBy({
      by: ['completedAt'],
      where: {
        status: 'APPROVED',
        completedAt: { gte: startDate },
      },
      _count: true,
      _sum: { reward: true },
    }),
    prisma.withdrawal.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        type: 'TASK_REWARD',
        createdAt: { gte: startDate },
      },
      _sum: { amount: true },
    }),
  ]);

  res.json({
    success: true,
    analytics: {
      period: `${days} days`,
      userRegistrations,
      taskCompletions,
      withdrawals,
      revenue,
    },
  });
}));

export default router;