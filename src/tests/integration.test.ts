import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { testHelpers, prisma } from './setup';

describe('Authentication API', () => {
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
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser123',
        email: 'testuser@test.com',
        password: 'testpassword123',
        fullName: 'Test User',
        gender: 'male',
        birthdate: '1990-01-01',
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('under review');
      
      // Check if user was created in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      
      expect(user).toBeDefined();
      expect(user?.username).toBe(userData.username);
      expect(user?.fullName).toBe(userData.fullName);
      expect(user?.isApproved).toBe(false);
    });
    
    it('should reject registration with existing email', async () => {
      const userData = {
        username: 'testuser123',
        email: 'testuser@test.com',
        password: 'testpassword123',
        fullName: 'Test User',
      };
      
      // Create first user
      await testHelpers.createTestUser({
        email: userData.email,
        username: userData.username,
      });
      
      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toContain('already registered');
    });
    
    it('should reject registration with existing username', async () => {
      const userData = {
        username: 'testuser123',
        email: 'testuser@test.com',
        password: 'testpassword123',
        fullName: 'Test User',
      };
      
      // Create first user
      await testHelpers.createTestUser({
        email: 'existing@test.com',
        username: userData.username,
      });
      
      // Try to register with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toContain('already taken');
    });
  });
  
  describe('POST /api/auth/login', () => {
    let user: any;
    
    beforeEach(async () => {
      user = await testHelpers.createTestUser({
        email: 'loginuser@test.com',
        username: 'loginuser',
        isApproved: true,
      });
    });
    
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'loginuser@test.com',
        password: 'testpassword123',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.username).toBe('loginuser');
    });
    
    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'loginuser@test.com',
        password: 'wrongpassword',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
      
      expect(response.body.error).toContain('Invalid credentials');
    });
    
    it('should reject login for unapproved user', async () => {
      const unapprovedUser = await testHelpers.createTestUser({
        email: 'unapproved@test.com',
        username: 'unapproved',
        isApproved: false,
      });
      
      const loginData = {
        email: 'unapproved@test.com',
        password: 'testpassword123',
      };
      
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(403);
      
      expect(response.body.error).toContain('not approved');
    });
  });
  
  describe('POST /api/auth/magic-link', () => {
    let user: any;
    
    beforeEach(async () => {
      user = await testHelpers.createTestUser({
        email: 'magicuser@test.com',
        username: 'magicuser',
        isApproved: true,
      });
    });
    
    it('should send magic link for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/magic-link')
        .send({ email: 'magicuser@test.com' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sent');
    });
    
    it('should not reveal if email does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/magic-link')
        .send({ email: 'nonexistent@test.com' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sent');
    });
  });
});

describe('User API', () => {
  let user: any;
  let authToken: string;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser({
      email: 'apiuser@test.com',
      username: 'apiuser',
      isApproved: true,
    });
    
    // Mock authentication by setting user in request
    authToken = 'mock-token';
  });
  
  describe('GET /api/user/profile', () => {
    it('should return user profile', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
    });
  });
  
  describe('GET /api/user/wallet', () => {
    it('should return user wallet', async () => {
      const response = await request(app)
        .get('/api/user/wallet')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.wallet).toBeDefined();
    });
  });
  
  describe('GET /api/user/transactions', () => {
    it('should return user transactions', async () => {
      const response = await request(app)
        .get('/api/user/transactions')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.transactions).toBeDefined();
      expect(Array.isArray(response.body.transactions)).toBe(true);
    });
  });
});

describe('Tasks API', () => {
  let user: any;
  let task: any;
  let authToken: string;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser({
      email: 'taskuser@test.com',
      username: 'taskuser',
      isApproved: true,
    });
    
    task = await testHelpers.createTestTask();
    authToken = 'mock-token';
  });
  
  describe('GET /api/tasks', () => {
    it('should return available tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toBeDefined();
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });
  });
  
  describe('POST /api/tasks/:id/start', () => {
    it('should start a task', async () => {
      const response = await request(app)
        .post(`/api/tasks/${task.id}/start`)
        .set('Cookie', `accessToken=${authToken}`)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('started');
    });
  });
});

describe('Referrals API', () => {
  let user: any;
  let authToken: string;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser({
      email: 'referraluser@test.com',
      username: 'referraluser',
      isApproved: true,
    });
    
    authToken = 'mock-token';
  });
  
  describe('GET /api/referrals/link', () => {
    it('should return referral link', async () => {
      const response = await request(app)
        .get('/api/referrals/link')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.referralCode).toBeDefined();
      expect(response.body.referralLink).toBeDefined();
    });
  });
  
  describe('GET /api/referrals/stats', () => {
    it('should return referral statistics', async () => {
      const response = await request(app)
        .get('/api/referrals/stats')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.totalReferrals).toBeDefined();
    });
  });
});

describe('Withdrawals API', () => {
  let user: any;
  let authToken: string;
  
  beforeEach(async () => {
    user = await testHelpers.createTestUser({
      email: 'withdrawaluser@test.com',
      username: 'withdrawaluser',
      isApproved: true,
    });
    
    // Add balance to wallet
    await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: 50.00,
      },
    });
    
    authToken = 'mock-token';
  });
  
  describe('GET /api/withdrawals/settings', () => {
    it('should return withdrawal settings', async () => {
      const response = await request(app)
        .get('/api/withdrawals/settings')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.settings).toBeDefined();
      expect(response.body.settings.minWithdrawal).toBeDefined();
    });
  });
  
  describe('POST /api/withdrawals/request', () => {
    it('should create withdrawal request', async () => {
      const withdrawalData = {
        amount: 20.00,
        walletAddress: 'test-wallet-address',
        network: 'TRC20',
      };
      
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Cookie', `accessToken=${authToken}`)
        .send(withdrawalData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('submitted');
    });
    
    it('should reject withdrawal below minimum', async () => {
      const withdrawalData = {
        amount: 5.00,
        walletAddress: 'test-wallet-address',
        network: 'TRC20',
      };
      
      const response = await request(app)
        .post('/api/withdrawals/request')
        .set('Cookie', `accessToken=${authToken}`)
        .send(withdrawalData)
        .expect(400);
      
      expect(response.body.error).toContain('Minimum');
    });
  });
});

describe('Admin API', () => {
  let admin: any;
  let user: any;
  let authToken: string;
  
  beforeEach(async () => {
    admin = await testHelpers.createTestAdmin();
    user = await testHelpers.createTestUser({
      email: 'adminuser@test.com',
      username: 'adminuser',
      isApproved: false,
    });
    
    authToken = 'mock-token';
  });
  
  describe('GET /api/admin/dashboard', () => {
    it('should return admin dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.users).toBeDefined();
    });
  });
  
  describe('GET /api/admin/users', () => {
    it('should return users list', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });
  
  describe('POST /api/admin/users/:id/approve', () => {
    it('should approve user', async () => {
      const response = await request(app)
        .post(`/api/admin/users/${user.id}/approve`)
        .set('Cookie', `accessToken=${authToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('approved');
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});
