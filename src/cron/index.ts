import cron from 'node-cron';
import axios from 'axios';
import { prisma } from '../lib/prisma';
import { logger } from '../utils/logger';

// Adsterra daily revenue sync cron job
cron.schedule('0 2 * * *', async () => {
  logger.info('Starting Adsterra daily revenue sync...');
  
  try {
    const apiKey = process.env.ADSTERRA_API_KEY;
    if (!apiKey) {
      logger.error('Adsterra API key not configured');
      return;
    }

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    // Fetch revenue data from Adsterra API
    const response = await axios.get(`https://api.adsterra.com/revenue`, {
      params: {
        api_key: apiKey,
        date: dateStr,
      },
      timeout: 30000,
    });

    const revenueData = response.data;

    if (revenueData && revenueData.revenue) {
      // Store revenue data
      await prisma.adRevenue.upsert({
        where: {
          source_date: {
            source: 'Adsterra',
            date: yesterday,
          },
        },
        update: {
          revenue: parseFloat(revenueData.revenue),
          impressions: revenueData.impressions || 0,
          clicks: revenueData.clicks || 0,
          conversions: revenueData.conversions || 0,
        },
        create: {
          source: 'Adsterra',
          date: yesterday,
          revenue: parseFloat(revenueData.revenue),
          impressions: revenueData.impressions || 0,
          clicks: revenueData.clicks || 0,
          conversions: revenueData.conversions || 0,
        },
      });

      logger.info(`Adsterra revenue synced for ${dateStr}: $${revenueData.revenue}`);
    } else {
      logger.warn(`No revenue data found for Adsterra on ${dateStr}`);
    }
  } catch (error) {
    logger.error('Adsterra revenue sync failed:', error);
  }
}, {
  timezone: 'UTC',
});

// Cleanup expired magic link tokens every hour
cron.schedule('0 * * * *', async () => {
  try {
    const deleted = await prisma.magicLinkToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true },
        ],
      },
    });

    if (deleted.count > 0) {
      logger.info(`Cleaned up ${deleted.count} expired magic link tokens`);
    }
  } catch (error) {
    logger.error('Failed to cleanup magic link tokens:', error);
  }
});

// Daily referral bonus calculation
cron.schedule('0 1 * * *', async () => {
  logger.info('Starting daily referral bonus calculation...');
  
  try {
    // Get all pending referrals
    const pendingReferrals = await prisma.referral.findMany({
      where: {
        isPaid: false,
        referred: {
          wallet: {
            totalEarned: {
              gt: 0,
            },
          },
        },
      },
      include: {
        referrer: {
          include: { wallet: true },
        },
        referred: {
          include: { wallet: true },
        },
      },
    });

    for (const referral of pendingReferrals) {
      const referredEarnings = Number(referral.referred.wallet?.totalEarned || 0);
      
      // Calculate bonus based on referral level and referred user's earnings
      let bonusAmount = 0;
      
      if (referral.level === 1) {
        bonusAmount = referredEarnings * 0.10; // 10% of referred user's earnings
      } else if (referral.level === 2) {
        bonusAmount = referredEarnings * 0.20; // 20% of referred user's earnings
      } else if (referral.level === 3) {
        bonusAmount = referredEarnings * 0.30; // 30% of referred user's earnings
      }

      if (bonusAmount > 0) {
        // Update referral bonus
        await prisma.referral.update({
          where: { id: referral.id },
          data: {
            bonus: bonusAmount,
            isPaid: true,
          },
        });

        // Credit referrer's wallet
        await prisma.wallet.update({
          where: { userId: referral.referrerId },
          data: {
            balance: { increment: bonusAmount },
            totalEarned: { increment: bonusAmount },
          },
        });

        // Create transaction record
        await prisma.transaction.create({
          data: {
            userId: referral.referrerId,
            type: 'REFERRAL_BONUS',
            amount: bonusAmount,
            description: `Referral bonus L${referral.level}: $${bonusAmount}`,
            metadata: {
              referralId: referral.id,
              referredUserId: referral.referredId,
              level: referral.level,
              referredEarnings,
            },
          },
        });

        logger.info(`Referral bonus credited: $${bonusAmount} to user ${referral.referrer.email} for L${referral.level} referral`);
      }
    }

    logger.info(`Processed ${pendingReferrals.length} referral bonuses`);
  } catch (error) {
    logger.error('Referral bonus calculation failed:', error);
  }
});

// Weekly analytics summary
cron.schedule('0 0 * * 1', async () => {
  logger.info('Generating weekly analytics summary...');
  
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      newUsers,
      completedTasks,
      totalRevenue,
      totalWithdrawals,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          createdAt: { gte: weekAgo },
        },
      }),
      prisma.userTask.count({
        where: {
          status: 'APPROVED',
          completedAt: { gte: weekAgo },
        },
      }),
      prisma.transaction.aggregate({
        where: {
          type: 'TASK_REWARD',
          createdAt: { gte: weekAgo },
        },
        _sum: { amount: true },
      }),
      prisma.withdrawal.aggregate({
        where: {
          status: 'COMPLETED',
          processedAt: { gte: weekAgo },
        },
        _sum: { amount: true },
      }),
    ]);

    logger.info('Weekly Analytics Summary:', {
      newUsers,
      completedTasks,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalWithdrawals: totalWithdrawals._sum.amount || 0,
      period: '7 days',
    });
  } catch (error) {
    logger.error('Weekly analytics summary failed:', error);
  }
});

logger.info('Cron jobs initialized successfully');

export default cron;