import express from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// AdGem webhook handler
router.post('/adgem', asyncHandler(async (req, res) => {
  const { signature, ...payload } = req.body;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.ADGEM_JWT_SECRET || '')
    .update(JSON.stringify(payload))
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.error('AdGem webhook signature verification failed');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { user_id, offer_id, amount, status } = payload;

  if (status !== 'completed') {
    logger.info(`AdGem offer ${offer_id} not completed for user ${user_id}`);
    return res.json({ success: true });
  }

  // Find user by external ID or create mapping
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user_id },
        { username: user_id },
      ],
    },
    include: { wallet: true },
  });

  if (!user) {
    logger.error(`AdGem webhook: User not found for ID ${user_id}`);
    return res.status(404).json({ error: 'User not found' });
  }

  // Find or create task for this offer
  let task = await prisma.task.findFirst({
    where: {
      externalId: offer_id,
      type: 'ADGEM',
    },
  });

  if (!task) {
    // Create task from offer data
    task = await prisma.task.create({
      data: {
        title: `AdGem Offer ${offer_id}`,
        description: `Complete AdGem offer ${offer_id}`,
        type: 'ADGEM',
        reward: parseFloat(amount),
        externalId: offer_id,
        status: 'ACTIVE',
        proofRequired: false,
      },
    });
  }

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId: user.id,
      taskId: task.id,
      status: 'APPROVED',
      reward: parseFloat(amount),
      completedAt: new Date(),
    },
  });

  // Credit user wallet
  await prisma.wallet.update({
    where: { userId: user.id },
    data: {
      balance: { increment: parseFloat(amount) },
      totalEarned: { increment: parseFloat(amount) },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'TASK_REWARD',
      amount: parseFloat(amount),
      description: `AdGem offer completed: $${amount}`,
      metadata: {
        source: 'AdGem',
        offerId: offer_id,
        userTaskId: userTask.id,
        externalUserId: user_id,
      },
    },
  });

  // Record ad revenue
  await prisma.adRevenue.upsert({
    where: {
      source_date: {
        source: 'AdGem',
        date: new Date().toISOString().split('T')[0],
      },
    },
    update: {
      revenue: { increment: parseFloat(amount) },
      conversions: { increment: 1 },
    },
    create: {
      source: 'AdGem',
      date: new Date(),
      revenue: parseFloat(amount),
      conversions: 1,
    },
  });

  logger.info(`AdGem webhook processed: User ${user.email}, Offer ${offer_id}, Amount $${amount}`);

  res.json({ success: true });
}));

// Adsterra webhook handler
router.post('/adsterra', asyncHandler(async (req, res) => {
  const { api_key, user_id, offer_id, amount, status } = req.body;

  // Verify API key
  if (api_key !== process.env.ADSTERRA_API_KEY) {
    logger.error('Adsterra webhook API key verification failed');
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (status !== 'completed') {
    logger.info(`Adsterra offer ${offer_id} not completed for user ${user_id}`);
    return res.json({ success: true });
  }

  // Find user
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user_id },
        { username: user_id },
      ],
    },
    include: { wallet: true },
  });

  if (!user) {
    logger.error(`Adsterra webhook: User not found for ID ${user_id}`);
    return res.status(404).json({ error: 'User not found' });
  }

  // Find or create task for this offer
  let task = await prisma.task.findFirst({
    where: {
      externalId: offer_id,
      type: 'ADSTERRA',
    },
  });

  if (!task) {
    task = await prisma.task.create({
      data: {
        title: `Adsterra Offer ${offer_id}`,
        description: `Complete Adsterra offer ${offer_id}`,
        type: 'ADSTERRA',
        reward: parseFloat(amount),
        externalId: offer_id,
        status: 'ACTIVE',
        proofRequired: false,
      },
    });
  }

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId: user.id,
      taskId: task.id,
      status: 'APPROVED',
      reward: parseFloat(amount),
      completedAt: new Date(),
    },
  });

  // Credit user wallet
  await prisma.wallet.update({
    where: { userId: user.id },
    data: {
      balance: { increment: parseFloat(amount) },
      totalEarned: { increment: parseFloat(amount) },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'TASK_REWARD',
      amount: parseFloat(amount),
      description: `Adsterra offer completed: $${amount}`,
      metadata: {
        source: 'Adsterra',
        offerId: offer_id,
        userTaskId: userTask.id,
        externalUserId: user_id,
      },
    },
  });

  // Record ad revenue
  await prisma.adRevenue.upsert({
    where: {
      source_date: {
        source: 'Adsterra',
        date: new Date().toISOString().split('T')[0],
      },
    },
    update: {
      revenue: { increment: parseFloat(amount) },
      conversions: { increment: 1 },
    },
    create: {
      source: 'Adsterra',
      date: new Date(),
      revenue: parseFloat(amount),
      conversions: 1,
    },
  });

  logger.info(`Adsterra webhook processed: User ${user.email}, Offer ${offer_id}, Amount $${amount}`);

  res.json({ success: true });
}));

// CPAlead webhook handler
router.post('/cpalead', asyncHandler(async (req, res) => {
  const { api_key, user_id, offer_id, amount, status } = req.body;

  // Verify API key
  if (api_key !== process.env.CPALEAD_API_KEY) {
    logger.error('CPAlead webhook API key verification failed');
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (status !== 'completed') {
    logger.info(`CPAlead offer ${offer_id} not completed for user ${user_id}`);
    return res.json({ success: true });
  }

  // Find user
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user_id },
        { username: user_id },
      ],
    },
    include: { wallet: true },
  });

  if (!user) {
    logger.error(`CPAlead webhook: User not found for ID ${user_id}`);
    return res.status(404).json({ error: 'User not found' });
  }

  // Find or create task for this offer
  let task = await prisma.task.findFirst({
    where: {
      externalId: offer_id,
      type: 'CPALEAD',
    },
  });

  if (!task) {
    task = await prisma.task.create({
      data: {
        title: `CPAlead Offer ${offer_id}`,
        description: `Complete CPAlead offer ${offer_id}`,
        type: 'CPALEAD',
        reward: parseFloat(amount),
        externalId: offer_id,
        status: 'ACTIVE',
        proofRequired: false,
      },
    });
  }

  // Create user task
  const userTask = await prisma.userTask.create({
    data: {
      userId: user.id,
      taskId: task.id,
      status: 'APPROVED',
      reward: parseFloat(amount),
      completedAt: new Date(),
    },
  });

  // Credit user wallet
  await prisma.wallet.update({
    where: { userId: user.id },
    data: {
      balance: { increment: parseFloat(amount) },
      totalEarned: { increment: parseFloat(amount) },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'TASK_REWARD',
      amount: parseFloat(amount),
      description: `CPAlead offer completed: $${amount}`,
      metadata: {
        source: 'CPAlead',
        offerId: offer_id,
        userTaskId: userTask.id,
        externalUserId: user_id,
      },
    },
  });

  // Record ad revenue
  await prisma.adRevenue.upsert({
    where: {
      source_date: {
        source: 'CPAlead',
        date: new Date().toISOString().split('T')[0],
      },
    },
    update: {
      revenue: { increment: parseFloat(amount) },
      conversions: { increment: 1 },
    },
    create: {
      source: 'CPAlead',
      date: new Date(),
      revenue: parseFloat(amount),
      conversions: 1,
    },
  });

  logger.info(`CPAlead webhook processed: User ${user.email}, Offer ${offer_id}, Amount $${amount}`);

  res.json({ success: true });
}));

// Generic webhook handler for testing
router.post('/test', asyncHandler(async (req, res) => {
  logger.info('Test webhook received:', req.body);
  res.json({ success: true, message: 'Test webhook received' });
}));

export default router;