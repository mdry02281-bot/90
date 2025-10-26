import { describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from '../utils/jwt';
import { testHelpers, prisma } from './setup';

describe('JWT Utils', () => {
  it('should generate access token', () => {
    const payload = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'USER',
    };
    
    const token = generateAccessToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
  
  it('should generate refresh token', () => {
    const payload = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'USER',
    };
    
    const token = generateRefreshToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
  
  it('should verify access token', () => {
    const payload = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'USER',
    };
    
    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);
    
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });
  
  it('should throw error for invalid token', () => {
    expect(() => {
      verifyAccessToken('invalid-token');
    }).toThrow();
  });
});

describe('Password Hashing', () => {
  it('should hash password correctly', async () => {
    const password = 'testpassword123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });
  
  it('should verify password correctly', async () => {
    const password = 'testpassword123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const isValid = await bcrypt.compare(password, hashedPassword);
    expect(isValid).toBe(true);
    
    const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
    expect(isInvalid).toBe(false);
  });
});

describe('Database Operations', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com',
        },
      },
    });
  });
  
  it('should create user successfully', async () => {
    const user = await testHelpers.createTestUser();
    
    expect(user).toBeDefined();
    expect(user.email).toContain('@test.com');
    expect(user.username).toBeDefined();
    expect(user.fullName).toBe('Test User');
    expect(user.role).toBe('USER');
    expect(user.isApproved).toBe(true);
  });
  
  it('should create wallet for user', async () => {
    const user = await testHelpers.createTestUser();
    
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });
    
    expect(wallet).toBeDefined();
    expect(wallet?.userId).toBe(user.id);
    expect(wallet?.balance).toBe(0);
    expect(wallet?.totalEarned).toBe(0);
  });
  
  it('should create task successfully', async () => {
    const task = await testHelpers.createTestTask();
    
    expect(task).toBeDefined();
    expect(task.title).toContain('Test Task');
    expect(task.description).toBe('A test task for unit testing');
    expect(task.type).toBe('MANUAL');
    expect(task.reward).toBe(1.00);
    expect(task.status).toBe('ACTIVE');
  });
  
  it('should create offer successfully', async () => {
    const offer = await testHelpers.createTestOffer();
    
    expect(offer).toBeDefined();
    expect(offer.title).toContain('Test Offer');
    expect(offer.source).toBe('TestSource');
    expect(offer.reward).toBe(2.00);
    expect(offer.isActive).toBe(true);
  });
  
  it('should create admin user', async () => {
    const admin = await testHelpers.createTestAdmin();
    
    expect(admin).toBeDefined();
    expect(admin.email).toBe('admin@test.com');
    expect(admin.role).toBe('ADMIN');
    expect(admin.isApproved).toBe(true);
  });
  
  it('should create super admin user', async () => {
    const superAdmin = await testHelpers.createTestSuperAdmin();
    
    expect(superAdmin).toBeDefined();
    expect(superAdmin.email).toBe('superadmin@test.com');
    expect(superAdmin.role).toBe('SUPER_ADMIN');
    expect(superAdmin.isApproved).toBe(true);
  });
});

describe('User Task Operations', () => {
  let user: any;
  let task: any;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser();
    task = await testHelpers.createTestTask();
  });
  
  it('should create user task', async () => {
    const userTask = await prisma.userTask.create({
      data: {
        userId: user.id,
        taskId: task.id,
        status: 'PENDING',
        reward: task.reward,
      },
    });
    
    expect(userTask).toBeDefined();
    expect(userTask.userId).toBe(user.id);
    expect(userTask.taskId).toBe(task.id);
    expect(userTask.status).toBe('PENDING');
    expect(userTask.reward).toBe(task.reward);
  });
  
  it('should update user task status', async () => {
    const userTask = await prisma.userTask.create({
      data: {
        userId: user.id,
        taskId: task.id,
        status: 'PENDING',
        reward: task.reward,
      },
    });
    
    const updatedTask = await prisma.userTask.update({
      where: { id: userTask.id },
      data: { status: 'APPROVED' },
    });
    
    expect(updatedTask.status).toBe('APPROVED');
  });
});

describe('Transaction Operations', () => {
  let user: any;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser();
  });
  
  it('should create transaction', async () => {
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'TASK_REWARD',
        amount: 5.00,
        description: 'Test transaction',
      },
    });
    
    expect(transaction).toBeDefined();
    expect(transaction.userId).toBe(user.id);
    expect(transaction.type).toBe('TASK_REWARD');
    expect(transaction.amount).toBe(5.00);
    expect(transaction.description).toBe('Test transaction');
  });
  
  it('should update wallet balance', async () => {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
    });
    
    const updatedWallet = await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: { increment: 10.00 },
        totalEarned: { increment: 10.00 },
      },
    });
    
    expect(updatedWallet.balance).toBe(10.00);
    expect(updatedWallet.totalEarned).toBe(10.00);
  });
});

describe('Referral Operations', () => {
  let referrer: any;
  let referred: any;
  
  beforeEach(async () => {
    referrer = await testHelpers.createTestUser({
      email: 'referrer@test.com',
    });
    referred = await testHelpers.createTestUser({
      email: 'referred@test.com',
    });
  });
  
  it('should create referral relationship', async () => {
    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referred.id,
        level: 1,
        bonus: 0,
      },
    });
    
    expect(referral).toBeDefined();
    expect(referral.referrerId).toBe(referrer.id);
    expect(referral.referredId).toBe(referred.id);
    expect(referral.level).toBe(1);
  });
  
  it('should calculate referral bonus', async () => {
    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referredId: referred.id,
        level: 1,
        bonus: 5.00,
      },
    });
    
    const updatedReferral = await prisma.referral.update({
      where: { id: referral.id },
      data: { bonus: 10.00 },
    });
    
    expect(updatedReferral.bonus).toBe(10.00);
  });
});

describe('Withdrawal Operations', () => {
  let user: any;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser();
    
    // Add balance to user's wallet
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: 50.00,
      },
    });
  });
  
  it('should create withdrawal request', async () => {
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        amount: 20.00,
        usdtAmount: 20.00,
        conversionRate: 1.00,
        walletAddress: 'test-wallet-address',
        network: 'TRC20',
        status: 'PENDING',
      },
    });
    
    expect(withdrawal).toBeDefined();
    expect(withdrawal.userId).toBe(user.id);
    expect(withdrawal.amount).toBe(20.00);
    expect(withdrawal.status).toBe('PENDING');
  });
  
  it('should update withdrawal status', async () => {
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        amount: 20.00,
        usdtAmount: 20.00,
        conversionRate: 1.00,
        walletAddress: 'test-wallet-address',
        network: 'TRC20',
        status: 'PENDING',
      },
    });
    
    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: withdrawal.id },
      data: {
        status: 'COMPLETED',
        txHash: 'test-transaction-hash',
        processedAt: new Date(),
      },
    });
    
    expect(updatedWithdrawal.status).toBe('COMPLETED');
    expect(updatedWithdrawal.txHash).toBe('test-transaction-hash');
    expect(updatedWithdrawal.processedAt).toBeDefined();
  });
});

describe('Settings Operations', () => {
  it('should create and retrieve settings', async () => {
    const setting = await prisma.setting.create({
      data: {
        key: 'TEST_SETTING',
        value: 'test-value',
      },
    });
    
    expect(setting).toBeDefined();
    expect(setting.key).toBe('TEST_SETTING');
    expect(setting.value).toBe('test-value');
    
    const retrievedSetting = await prisma.setting.findUnique({
      where: { key: 'TEST_SETTING' },
    });
    
    expect(retrievedSetting).toBeDefined();
    expect(retrievedSetting?.value).toBe('test-value');
  });
  
  it('should update setting value', async () => {
    await prisma.setting.create({
      data: {
        key: 'TEST_SETTING_UPDATE',
        value: 'original-value',
      },
    });
    
    const updatedSetting = await prisma.setting.update({
      where: { key: 'TEST_SETTING_UPDATE' },
      data: { value: 'updated-value' },
    });
    
    expect(updatedSetting.value).toBe('updated-value');
  });
});
