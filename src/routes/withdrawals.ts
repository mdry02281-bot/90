import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get withdrawal settings
router.get('/settings', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['MIN_WITHDRAWAL', 'EXCHANGE_RATE', 'PAYOUT_WALLET'],
      },
    },
  });

  const minWithdrawal = settings.find(s => s.key === 'MIN_WITHDRAWAL')?.value || '10.00';
  const exchangeRate = settings.find(s => s.key === 'EXCHANGE_RATE')?.value || '1.00';
  const payoutWallet = settings.find(s => s.key === 'PAYOUT_WALLET')?.value || '';

  res.json({
    success: true,
    settings: {
      minWithdrawal: parseFloat(minWithdrawal),
      exchangeRate: parseFloat(exchangeRate),
      payoutWallet,
      currency: 'USDT',
    },
  });
}));

// Create withdrawal request
const createWithdrawalSchema = z.object({
  amount: z.number().min(0.01),
  walletAddress: z.string().min(10),
  network: z.string().min(1),
});

router.post('/request', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const data = createWithdrawalSchema.parse(req.body);

  // Get user wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  // Get withdrawal settings
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: ['MIN_WITHDRAWAL', 'EXCHANGE_RATE'],
      },
    },
  });

  const minWithdrawal = parseFloat(settings.find(s => s.key === 'MIN_WITHDRAWAL')?.value || '10.00');
  const exchangeRate = parseFloat(settings.find(s => s.key === 'EXCHANGE_RATE')?.value || '1.00');

  // Validate withdrawal amount
  if (data.amount < minWithdrawal) {
    return res.status(400).json({ 
      error: `Minimum withdrawal amount is $${minWithdrawal}` 
    });
  }

  if (data.amount > Number(wallet.balance)) {
    return res.status(400).json({ 
      error: 'Insufficient balance' 
    });
  }

  // Check for pending withdrawals
  const pendingWithdrawal = await prisma.withdrawal.findFirst({
    where: {
      userId,
      status: 'PENDING',
    },
  });

  if (pendingWithdrawal) {
    return res.status(400).json({ 
      error: 'You already have a pending withdrawal request' 
    });
  }

  // Calculate USDT amount
  const usdtAmount = data.amount * exchangeRate;

  // Create withdrawal request
  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId,
      amount: data.amount,
      usdtAmount,
      conversionRate: exchangeRate,
      walletAddress: data.walletAddress,
      network: data.network,
      status: 'PENDING',
    },
  });

  // Deduct amount from wallet balance
  await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        decrement: data.amount,
      },
      pendingBalance: {
        increment: data.amount,
      },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: 'WITHDRAWAL',
      amount: -data.amount,
      description: `Withdrawal request: $${data.amount} USDT to ${data.walletAddress}`,
      metadata: {
        withdrawalId: withdrawal.id,
        walletAddress: data.walletAddress,
        network: data.network,
        usdtAmount,
        conversionRate: exchangeRate,
      },
    },
  });

  logger.info(`Withdrawal request created: ${withdrawal.id} for user ${userId}`);

  res.status(201).json({
    success: true,
    message: 'Withdrawal request submitted successfully',
    withdrawal,
  });
}));

// Get user withdrawals
router.get('/my-withdrawals', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (status && ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].includes(status)) {
    where.status = status;
  }

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({ where }),
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

// Get withdrawal by ID
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const withdrawalId = req.params.id;
  const userId = req.user!.id;

  const withdrawal = await prisma.withdrawal.findFirst({
    where: {
      id: withdrawalId,
      userId,
    },
  });

  if (!withdrawal) {
    return res.status(404).json({ error: 'Withdrawal not found' });
  }

  res.json({
    success: true,
    withdrawal,
  });
}));

// Cancel withdrawal request (only if pending)
router.post('/:id/cancel', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const withdrawalId = req.params.id;
  const userId = req.user!.id;

  const withdrawal = await prisma.withdrawal.findFirst({
    where: {
      id: withdrawalId,
      userId,
      status: 'PENDING',
    },
  });

  if (!withdrawal) {
    return res.status(404).json({ error: 'Withdrawal not found or cannot be cancelled' });
  }

  // Update withdrawal status
  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      status: 'REJECTED',
      rejectionReason: 'Cancelled by user',
    },
  });

  // Refund amount to wallet
  await prisma.wallet.update({
    where: { userId },
    data: {
      balance: {
        increment: withdrawal.amount,
      },
      pendingBalance: {
        decrement: withdrawal.amount,
      },
    },
  });

  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      type: 'WITHDRAWAL',
      amount: withdrawal.amount,
      description: `Withdrawal cancelled: $${withdrawal.amount} refunded`,
      metadata: {
        withdrawalId: withdrawal.id,
        originalAmount: withdrawal.amount,
        reason: 'Cancelled by user',
      },
    },
  });

  logger.info(`Withdrawal cancelled: ${withdrawalId} by user ${userId}`);

  res.json({
    success: true,
    message: 'Withdrawal request cancelled successfully',
  });
}));

// Get withdrawal statistics
router.get('/stats/summary', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalWithdrawals,
    totalAmount,
    pendingAmount,
    completedAmount,
    rejectedAmount,
    withdrawalStats,
  ] = await Promise.all([
    prisma.withdrawal.count({
      where: { userId },
    }),
    prisma.withdrawal.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'PENDING',
      },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    }),
    prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'REJECTED',
      },
      _sum: { amount: true },
    }),
    prisma.withdrawal.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
      _sum: { amount: true },
    }),
  ]);

  res.json({
    success: true,
    stats: {
      totalWithdrawals,
      totalAmount: totalAmount._sum.amount || 0,
      pendingAmount: pendingAmount._sum.amount || 0,
      completedAmount: completedAmount._sum.amount || 0,
      rejectedAmount: rejectedAmount._sum.amount || 0,
      byStatus: withdrawalStats,
    },
  });
}));

// Get withdrawal history with filters
router.get('/history/filtered', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const skip = (page - 1) * limit;

  const where: any = { userId };

  if (status && ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'].includes(status)) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({ where }),
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
    filters: {
      status,
      startDate,
      endDate,
    },
  });
}));

export default router;