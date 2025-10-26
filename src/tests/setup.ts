import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// Test database setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/promohive_test',
    },
  },
});

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
  
  // Clean up any existing test data
  await cleanupTestData();
});

afterAll(async () => {
  // Clean up test data
  await cleanupTestData();
  
  // Disconnect from database
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up test data before each test
  await cleanupTestData();
});

async function cleanupTestData() {
  // Delete test data in reverse order of dependencies
  await prisma.transaction.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.withdrawal.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.levelRequest.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.referral.deleteMany({
    where: {
      OR: [
        {
          referrer: {
            email: {
              contains: '@test.com',
            },
          },
        },
        {
          referred: {
            email: {
              contains: '@test.com',
            },
          },
        },
      ],
    },
  });
  
  await prisma.proof.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.userTask.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.wallet.deleteMany({
    where: {
      user: {
        email: {
          contains: '@test.com',
        },
      },
    },
  });
  
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@test.com',
      },
    },
  });
  
  await prisma.task.deleteMany({
    where: {
      title: {
        contains: 'Test Task',
      },
    },
  });
  
  await prisma.offer.deleteMany({
    where: {
      title: {
        contains: 'Test Offer',
      },
    },
  });
}

// Helper functions for tests
export const testHelpers = {
  async createTestUser(overrides = {}) {
    const defaultUser = {
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@test.com`,
      password: await bcrypt.hash('testpassword123', 12),
      fullName: 'Test User',
      role: 'USER',
      level: 0,
      isApproved: true,
      referralCode: `TEST${Date.now()}`,
    };
    
    const user = await prisma.user.create({
      data: { ...defaultUser, ...overrides },
    });
    
    // Create wallet for user
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        pendingBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
      },
    });
    
    return user;
  },
  
  async createTestTask(overrides = {}) {
    const defaultTask = {
      title: `Test Task ${Date.now()}`,
      description: 'A test task for unit testing',
      type: 'MANUAL',
      reward: 1.00,
      proofRequired: true,
      status: 'ACTIVE',
      currentParticipants: 0,
    };
    
    return await prisma.task.create({
      data: { ...defaultTask, ...overrides },
    });
  },
  
  async createTestOffer(overrides = {}) {
    const defaultOffer = {
      externalId: `test-offer-${Date.now()}`,
      source: 'TestSource',
      title: `Test Offer ${Date.now()}`,
      description: 'A test offer for unit testing',
      reward: 2.00,
      url: 'https://test.com',
      isActive: true,
    };
    
    return await prisma.offer.create({
      data: { ...defaultOffer, ...overrides },
    });
  },
  
  async createTestAdmin() {
    return await this.createTestUser({
      email: 'admin@test.com',
      role: 'ADMIN',
      isApproved: true,
    });
  },
  
  async createTestSuperAdmin() {
    return await this.createTestUser({
      email: 'superadmin@test.com',
      role: 'SUPER_ADMIN',
      isApproved: true,
    });
  },
};

export { prisma };
