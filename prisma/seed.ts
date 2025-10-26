import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting database seed...');

  // Create SUPER_ADMIN user
  const superAdminPassword = await bcrypt.hash('admin123!', SALT_ROUNDS);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@promohive.com' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'admin@promohive.com',
      password: superAdminPassword,
      fullName: 'Super Administrator',
      role: 'SUPER_ADMIN',
      level: 3,
      isApproved: true,
    },
  });

  // Create wallet for super admin
  await prisma.wallet.upsert({
    where: { userId: superAdmin.id },
    update: {},
    create: {
      userId: superAdmin.id,
      balance: 1000,
      pendingBalance: 0,
      totalEarned: 1000,
      totalWithdrawn: 0,
    },
  });

  console.log('✅ Super admin created:', superAdmin.email);

  // Create sample tasks
  const sampleTasks = [
    {
      title: 'Follow Instagram Account',
      description: 'Follow our Instagram account @promohive and like 3 recent posts',
      type: 'MANUAL',
      reward: 0.50,
      instructions: '1. Go to @promohive on Instagram\n2. Follow the account\n3. Like the 3 most recent posts\n4. Take a screenshot of your follow',
      url: 'https://instagram.com/promohive',
      proofRequired: true,
      maxParticipants: 1000,
    },
    {
      title: 'Join Telegram Channel',
      description: 'Join our official Telegram channel and stay active',
      type: 'MANUAL',
      reward: 0.75,
      instructions: '1. Join our Telegram channel\n2. Send a message introducing yourself\n3. Stay active for at least 24 hours\n4. Take a screenshot of your membership',
      url: 'https://t.me/promohive',
      proofRequired: true,
      maxParticipants: 500,
    },
    {
      title: 'Download Mobile App',
      description: 'Download and install our mobile app from the app store',
      type: 'MANUAL',
      reward: 1.00,
      instructions: '1. Go to your app store\n2. Search for "PromoHive"\n3. Download and install the app\n4. Open the app and take a screenshot',
      url: 'https://play.google.com/store/apps/details?id=com.promohive',
      proofRequired: true,
      maxParticipants: 200,
    },
    {
      title: 'Share on Social Media',
      description: 'Share our platform on your social media accounts',
      type: 'MANUAL',
      reward: 0.25,
      instructions: '1. Create a post about PromoHive\n2. Include our hashtag #PromoHive\n3. Tag us in your post\n4. Take a screenshot of your post',
      url: 'https://promohive.com',
      proofRequired: true,
      maxParticipants: 2000,
    },
    {
      title: 'Complete Survey',
      description: 'Complete a quick survey about your preferences',
      type: 'MANUAL',
      reward: 0.30,
      instructions: '1. Click the survey link\n2. Answer all questions honestly\n3. Submit the survey\n4. Take a screenshot of the completion page',
      url: 'https://forms.gle/survey',
      proofRequired: true,
      maxParticipants: 1000,
    },
  ];

  for (const taskData of sampleTasks) {
    await prisma.task.upsert({
      where: { id: `task-${taskData.title.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `task-${taskData.title.toLowerCase().replace(/\s+/g, '-')}`,
        ...taskData,
      },
    });
  }

  console.log('✅ Sample tasks created');

  // Create sample offers
  const sampleOffers = [
    {
      externalId: 'adgem-offer-1',
      source: 'AdGem',
      title: 'Download Game App',
      description: 'Download and play this exciting mobile game for 30 minutes',
      reward: 2.50,
      url: 'https://adgem.com/offer/1',
      isActive: true,
    },
    {
      externalId: 'adgem-offer-2',
      source: 'AdGem',
      title: 'Sign Up for Service',
      description: 'Create an account with our partner service',
      reward: 1.75,
      url: 'https://adgem.com/offer/2',
      isActive: true,
    },
    {
      externalId: 'adsterra-offer-1',
      source: 'Adsterra',
      title: 'Complete Quiz',
      description: 'Answer questions about various topics',
      reward: 0.80,
      url: 'https://adsterra.com/quiz/1',
      isActive: true,
    },
    {
      externalId: 'cpalead-offer-1',
      source: 'CPAlead',
      title: 'Watch Video',
      description: 'Watch a 2-minute video advertisement',
      reward: 0.15,
      url: 'https://cpalead.com/video/1',
      isActive: true,
    },
  ];

  for (const offerData of sampleOffers) {
    await prisma.offer.upsert({
      where: { externalId: offerData.externalId },
      update: {},
      create: offerData,
    });
  }

  console.log('✅ Sample offers created');

  // Create default settings
  const defaultSettings = [
    {
      key: 'PLATFORM_NAME',
      value: 'PromoHive',
    },
    {
      key: 'PLATFORM_DESCRIPTION',
      value: 'Global Promo Network - Earn money by completing tasks',
    },
    {
      key: 'WELCOME_BONUS',
      value: '5.00',
    },
    {
      key: 'MIN_WITHDRAWAL',
      value: '10.00',
    },
    {
      key: 'EXCHANGE_RATE',
      value: '1.00',
    },
    {
      key: 'PAYOUT_WALLET',
      value: '0x0000000000000000000000000000000000000000',
    },
    {
      key: 'ADGEM_APP_ID',
      value: '31283',
    },
    {
      key: 'ADSTERRA_API_KEY',
      value: 'your-adsterra-api-key',
    },
    {
      key: 'CPALEAD_API_KEY',
      value: 'your-cpalead-api-key',
    },
    {
      key: 'REFERRAL_BONUS_L1',
      value: '70.00',
    },
    {
      key: 'REFERRAL_BONUS_L2',
      value: '130.00',
    },
    {
      key: 'REFERRAL_BONUS_L3',
      value: '180.00',
    },
    {
      key: 'INVITEE_BONUS',
      value: '10.00',
    },
    {
      key: 'LEVEL_UPGRADE_L1',
      value: '50.00',
    },
    {
      key: 'LEVEL_UPGRADE_L2',
      value: '100.00',
    },
    {
      key: 'LEVEL_UPGRADE_L3',
      value: '150.00',
    },
    {
      key: 'LEVEL_MULTIPLIER_L1',
      value: '1.35',
    },
    {
      key: 'LEVEL_MULTIPLIER_L2',
      value: '1.55',
    },
    {
      key: 'LEVEL_MULTIPLIER_L3',
      value: '1.75',
    },
    {
      key: 'LEVEL_CAP_L0',
      value: '9.90',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Default settings created');

  // Create sample admin action
  await prisma.adminAction.create({
    data: {
      adminId: superAdmin.id,
      action: 'SYSTEM_INITIALIZED',
      targetType: 'SYSTEM',
      targetId: 'system',
      description: 'PromoHive system initialized with default data',
      metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    },
  });

  console.log('✅ Sample admin action created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Email: admin@promohive.com');
  console.log('Password: admin123!');
  console.log('Role: SUPER_ADMIN');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });