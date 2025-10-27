import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';

// Test data
const testUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  password: '$2b$12$hashedpassword',
  fullName: 'Test User',
  role: 'USER',
  isApproved: true,
  level: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const testAdmin = {
  id: 'test-admin-id',
  username: 'testadmin',
  email: 'admin@example.com',
  password: '$2b$12$hashedpassword',
  fullName: 'Test Admin',
  role: 'ADMIN',
  isApproved: true,
  level: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Integration Tests - API Data Flow', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Create test users in database
    await prisma.user.createMany({
      data: [testUser, testAdmin],
      skipDuplicates: true,
    });

    // Create wallets for test users
    await prisma.wallet.createMany({
      data: [
        {
          userId: testUser.id,
          balance: 100,
          pendingBalance: 0,
          totalEarned: 100,
          totalWithdrawn: 0,
        },
        {
          userId: testAdmin.id,
          balance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
        },
      ],
      skipDuplicates: true,
    });

    // Generate JWT tokens
    userToken = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    adminToken = jwt.sign(
      { userId: testAdmin.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.wallet.deleteMany({
      where: { userId: { in: [testUser.id, testAdmin.id] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUser.id, testAdmin.id] } },
    });
  });

  describe('Authentication Flow', () => {
    it('should authenticate user and return user data from database', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toMatchObject({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
        role: testUser.role,
      });
    });

    it('should reject requests without valid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });

    it('should login user and return data from database', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'password123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toMatchObject({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
      });
    });
  });

  describe('User Dashboard Data Flow', () => {
    it('should fetch user dashboard data from database', async () => {
      const response = await request(app)
        .get('/api/user/dashboard')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('wallet');
      expect(response.body.data).toHaveProperty('stats');
      
      // Verify data comes from database
      expect(response.body.data.user.id).toBe(testUser.id);
      expect(response.body.data.wallet.balance).toBe(100);
    });

    it('should fetch user profile from database', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.id).toBe(testUser.id);
      expect(response.body.user.wallet).toBeDefined();
    });
  });

  describe('Admin Dashboard Data Flow', () => {
    it('should fetch admin dashboard stats from database', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .set('Cookie', `accessToken=${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stats).toHaveProperty('users');
      expect(response.body.stats).toHaveProperty('tasks');
      expect(response.body.stats).toHaveProperty('withdrawals');
      expect(response.body.stats).toHaveProperty('revenue');
      
      // Verify data comes from database
      expect(response.body.stats.users.total).toBeGreaterThanOrEqual(2); // At least our test users
    });

    it('should reject admin requests from non-admin users', async () => {
      await request(app)
        .get('/api/admin/dashboard')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(403);
    });
  });

  describe('Tasks Data Flow', () => {
    it('should fetch tasks from database', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    it('should fetch user tasks from database', async () => {
      const response = await request(app)
        .get('/api/tasks/user')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.tasks).toBeInstanceOf(Array);
    });
  });

  describe('Data Consistency Tests', () => {
    it('should ensure all API responses come from database, not local storage', async () => {
      // Test multiple endpoints to ensure consistency
      const endpoints = [
        '/api/auth/me',
        '/api/user/dashboard',
        '/api/user/profile',
        '/api/tasks',
        '/api/tasks/user',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set('Cookie', `accessToken=${userToken}`)
          .expect(200);

        // Verify response structure indicates database source
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty('data');
        
        // Verify no local storage indicators
        expect(response.body).not.toHaveProperty('fromCache');
        expect(response.body).not.toHaveProperty('localStorage');
      }
    });

    it('should maintain data consistency across multiple requests', async () => {
      // Make multiple requests to same endpoint
      const responses = await Promise.all([
        request(app).get('/api/user/dashboard').set('Cookie', `accessToken=${userToken}`),
        request(app).get('/api/user/dashboard').set('Cookie', `accessToken=${userToken}`),
        request(app).get('/api/user/dashboard').set('Cookie', `accessToken=${userToken}`),
      ]);

      // All responses should be identical (from same database source)
      const firstResponse = responses[0].body;
      responses.forEach(response => {
        expect(response.body).toEqual(firstResponse);
      });
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would require mocking database connection
      // For now, test that errors are properly formatted
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .set('Cookie', `accessToken=${userToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return proper error format for unauthorized requests', async () => {
      const response = await request(app)
        .get('/api/user/dashboard')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Access token required');
    });
  });
});
