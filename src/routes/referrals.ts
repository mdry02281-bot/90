import express from 'express';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get referral link and stats
router.get('/link', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate referral link using user ID
  const referralLink = `${process.env.PLATFORM_URL || 'http://localhost:3000'}/register?ref=${user.id}`;

  res.json({
    success: true,
    referralCode: user.id,
    referralLink,
  });
}));

// Get referral statistics
router.get('/stats', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalReferrals,
    referralBonus,
    referralStats,
    recentReferrals,
  ] = await Promise.all([
    prisma.referral.count({
      where: { referrerId: userId },
    }),
    prisma.referral.aggregate({
      where: { referrerId: userId },
      _sum: { bonus: true },
    }),
    prisma.referral.groupBy({
      by: ['level'],
      where: { referrerId: userId },
      _count: true,
      _sum: { bonus: true },
    }),
    prisma.referral.findMany({
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
      take: 10,
    }),
  ]);

  res.json({
    success: true,
    stats: {
      totalReferrals,
      totalBonus: referralBonus._sum.bonus || 0,
      levelStats: referralStats,
      recentReferrals,
    },
  });
}));

// Get all referrals with pagination
router.get('/list', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [referrals, total] = await Promise.all([
    prisma.referral.findMany({
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
            lastLoginAt: true,
            wallet: {
              select: {
                balance: true,
                totalEarned: true,
                totalWithdrawn: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.referral.count({
      where: { referrerId: userId },
    }),
  ]);

  res.json({
    success: true,
    referrals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}));

// Get referral earnings
router.get('/earnings', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;

  const [
    totalEarnings,
    paidEarnings,
    pendingEarnings,
    earningsByLevel,
  ] = await Promise.all([
    prisma.referral.aggregate({
      where: { referrerId: userId },
      _sum: { bonus: true },
    }),
    prisma.referral.aggregate({
      where: {
        referrerId: userId,
        isPaid: true,
      },
      _sum: { bonus: true },
    }),
    prisma.referral.aggregate({
      where: {
        referrerId: userId,
        isPaid: false,
      },
      _sum: { bonus: true },
    }),
    prisma.referral.groupBy({
      by: ['level'],
      where: { referrerId: userId },
      _sum: { bonus: true },
      _count: true,
    }),
  ]);

  res.json({
    success: true,
    earnings: {
      total: totalEarnings._sum.bonus || 0,
      paid: paidEarnings._sum.bonus || 0,
      pending: pendingEarnings._sum.bonus || 0,
      byLevel: earningsByLevel,
    },
  });
}));

// Get referral tree (multi-level)
router.get('/tree', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const maxLevel = parseInt(req.query.maxLevel as string) || 3;

  const buildReferralTree = async (referrerId: string, level: number = 1): Promise<any> => {
    if (level > maxLevel) return null;

    const referrals = await prisma.referral.findMany({
      where: { referrerId },
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
    });

    const tree = await Promise.all(
      referrals.map(async (referral) => {
        const children = await buildReferralTree(referral.referredId, level + 1);
        return {
          ...referral,
          children,
        };
      })
    );

    return tree;
  };

  const referralTree = await buildReferralTree(userId);

  res.json({
    success: true,
    tree: referralTree,
  });
}));

// Get referral performance metrics
router.get('/performance', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const days = parseInt(req.query.days as string) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    recentReferrals,
    activeReferrals,
    totalEarnings,
    conversionRate,
  ] = await Promise.all([
    prisma.referral.count({
      where: {
        referrerId: userId,
        createdAt: {
          gte: startDate,
        },
      },
    }),
    prisma.referral.count({
      where: {
        referrerId: userId,
        referred: {
          wallet: {
            balance: {
              gt: 0,
            },
          },
        },
      },
    }),
    prisma.referral.aggregate({
      where: {
        referrerId: userId,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: { bonus: true },
    }),
    prisma.referral.count({
      where: {
        referrerId: userId,
        referred: {
          wallet: {
            totalEarned: {
              gt: 0,
            },
          },
        },
      },
    }),
  ]);

  const totalReferrals = await prisma.referral.count({
    where: { referrerId: userId },
  });

  res.json({
    success: true,
    performance: {
      totalReferrals,
      recentReferrals,
      activeReferrals,
      totalEarnings: totalEarnings._sum.bonus || 0,
      conversionRate: totalReferrals > 0 ? (activeReferrals / totalReferrals) * 100 : 0,
      period: `${days} days`,
    },
  });
}));

// Get referral leaderboard
router.get('/leaderboard', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const leaderboard = await prisma.referral.groupBy({
    by: ['referrerId'],
    _count: true,
    _sum: { bonus: true },
    orderBy: {
      _count: {
        referrerId: 'desc',
      },
    },
    take: limit,
  });

  const leaderboardWithUsers = await Promise.all(
    leaderboard.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: { id: item.referrerId },
        select: {
          id: true,
          username: true,
          fullName: true,
          level: true,
        },
      });

      return {
        user,
        referralCount: item._count,
        totalBonus: item._sum.bonus || 0,
      };
    })
  );

  res.json({
    success: true,
    leaderboard: leaderboardWithUsers,
  });
}));

export default router;