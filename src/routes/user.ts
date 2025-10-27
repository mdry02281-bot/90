import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      referrals: {
        include: {
          referred: {
            select: {
              id: true,
              username: true,
              email: true,
              createdAt: true,
            },
          },
        },
      },
      referredBy: {
        include: {
          referrer: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
      _count: {
        select: {
          transactions: true,
          tasks: true,
          withdrawals: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      birthdate: user.birthdate,
      role: user.role,
      level: user.level,
      referralCode: user.id, // Use user ID as referral code
      isApproved: user.isApproved,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      wallet: user.wallet,
      referrals: user.referrals,
      referredBy: user.referredBy,
      stats: {
        totalTransactions: user._count.transactions,
        totalTasks: user._count.tasks,
        totalWithdrawals: user._count.withdrawals,
      },
    },
  });
}));

// Update user profile  
const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthdate: z.string().optional(),
});

router.put('/profile', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;
  const data = updateProfileSchema.parse(req.body);

  const updateData: any = {};
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.gender) updateData.gender = data.gender;
  if (data.birthdate) updateData.birthdate = new Date(data.birthdate);

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      gender: true,
      birthdate: true,
      role: true,
      level: true,
    },
  });

  logger.info(`User profile updated: ${user.email}`);

  res.json({
    success: true,
    user,
  });
}));

// Get user wallet
router.get('/wallet', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;

  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }

  res.json({
    success: true,
    wallet,
  });
}));

// Get user transactions
router.get('/transactions', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({
      where: { userId },
    }),
  ]);

  res.json({
    success: true,
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Get user tasks
router.get('/tasks', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [userTasks, total] = await Promise.all([
    prisma.userTask.findMany({
      where: { userId },
      include: {
        task: true,
        proofs: true,
      },
      orderBy: { startedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.userTask.count({
      where: { userId },
    }),
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

// Get user referrals
router.get('/referrals', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;

  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId },
    include: {
      referred: {
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          level: true,
          createdAt: true,
          wallet: {
            select: {
              balance: true,
              totalEarned: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate referral stats
  const totalReferrals = referrals.length;
  const totalBonus = referrals.reduce((sum, ref) => sum + Number(ref.bonus), 0);
  const activeReferrals = referrals.filter(ref => Number(ref.referred.wallet?.balance || 0) > 0).length;

  res.json({
    success: true,
    referrals,
    stats: {
      totalReferrals,
      totalBonus,
      activeReferrals,
    },
  });
}));

// Get user withdrawals
router.get('/withdrawals', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({
      where: { userId },
    }),
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

// Get user level requests
router.get('/level-requests', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;

  const levelRequests = await prisma.levelRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    levelRequests,
  });
}));

// Request level upgrade
const levelUpgradeSchema = z.object({
  requestedLevel: z.number().min(1).max(3),
  proofUrl: z.string().url().optional(),
});

router.post('/level-upgrade', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;
  const data = levelUpgradeSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (data.requestedLevel <= user.level) {
    return res.status(400).json({ error: 'Cannot downgrade level' });
  }

  // Check if there's already a pending request
  const existingRequest = await prisma.levelRequest.findFirst({
    where: {
      userId,
      status: 'PENDING',
    },
  });

  if (existingRequest) {
    return res.status(400).json({ error: 'You already have a pending level upgrade request' });
  }

  // Get level requirements
  const settings = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          `LEVEL_UPGRADE_L${data.requestedLevel}`,
          `LEVEL_MULTIPLIER_L${data.requestedLevel}`,
        ],
      },
    },
  });

  const upgradeCost = settings.find(s => s.key === `LEVEL_UPGRADE_L${data.requestedLevel}`)?.value || '0';
  const requiredBalance = parseFloat(upgradeCost);

  if (Number(user.wallet!.balance) < requiredBalance) {
    return res.status(400).json({ 
      error: `Insufficient balance. Required: $${requiredBalance}` 
    });
  }

  const levelRequest = await prisma.levelRequest.create({
    data: {
      userId,
      requestedLevel: data.requestedLevel,
      proofUrl: data.proofUrl,
      status: 'PENDING',
    },
  });

  logger.info(`Level upgrade request created for user ${user.email}: Level ${data.requestedLevel}`);

  res.status(201).json({
    success: true,
    message: 'Level upgrade request submitted for admin review',
    levelRequest,
  });
}));

// Get dashboard stats
router.get('/dashboard', asyncHandler(async (req: AuthenticatedRequest, res: express.Response) => {
  const userId = req.user!.id;

  const [
    user,
    wallet,
    recentTransactions,
    recentTasks,
    referralStats,
    withdrawalStats,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
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
    }),
    prisma.wallet.findUnique({
      where: { userId },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.userTask.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { startedAt: 'desc' },
      take: 5,
    }),
    prisma.referral.aggregate({
      where: { referrerId: userId },
      _sum: { bonus: true },
      _count: true,
    }),
    prisma.withdrawal.aggregate({
      where: { userId },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  if (!user || !wallet) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        level: user.level,
        referralCode: user.id,
        createdAt: user.createdAt,
      },
      wallet: {
        balance: wallet.balance.toNumber(),
        pendingBalance: wallet.pendingBalance.toNumber(),
        totalEarned: wallet.totalEarned.toNumber(),
        totalWithdrawn: wallet.totalWithdrawn.toNumber(),
      },
      stats: {
        totalTransactions: user._count.transactions,
        totalTasks: user._count.tasks,
        totalReferrals: user._count.referrals,
        totalWithdrawals: user._count.withdrawals,
        totalReferralBonus: referralStats._sum.bonus?.toNumber() || 0,
        totalWithdrawn: withdrawalStats._sum.amount?.toNumber() || 0,
      },
      recentTransactions,
      recentTasks,
    },
  });
}));

export default router;