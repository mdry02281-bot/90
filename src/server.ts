import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Trust first proxy (nginx)
app.set('trust proxy', 1);

// Server bootstrap logging
console.log('[BOOT] Server starting...');
console.log('[BOOT] Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
});

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in environment variables');
}

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables');
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// CRITICAL: Health check endpoint - MUST be before any other routes
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    });
  } catch (error) {
    console.error('[HEALTH] Database check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      environment: process.env.NODE_ENV
    });
  }
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PromoHive API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});


// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    console.log('[ADMIN] Dashboard request received');
    
    // Get user statistics
    const totalUsers = await prisma.user.count();
    const pendingUsers = await prisma.user.count({
      where: { isApproved: false }
    });
    const approvedUsers = await prisma.user.count({
      where: { isApproved: true }
    });

    // Get task statistics
    const totalTasks = await prisma.task.count();
    const activeTasks = await prisma.task.count({
      where: { status: 'ACTIVE' }
    });

    // Get withdrawal statistics
    const totalWithdrawals = await prisma.withdrawal.count();
    const pendingWithdrawals = await prisma.withdrawal.count({
      where: { status: 'PENDING' }
    });

    // Get revenue statistics
    const revenueResult = await prisma.withdrawal.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });

    // Get recent activity
    const recentActivity = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        fullName: true,
        createdAt: true,
        isApproved: true
      }
    });

    const stats = {
      users: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers
      },
      tasks: {
        total: totalTasks,
        active: activeTasks
      },
      withdrawals: {
        total: totalWithdrawals,
        pending: pendingWithdrawals
      },
      revenue: {
        total: revenueResult._sum.amount || 0
      },
      recentActivity: recentActivity.map(user => ({
        description: `${user.isApproved ? 'Approved' : 'New'} user: ${user.fullName}`,
        type: user.isApproved ? 'user_approved' : 'user_registered',
        createdAt: user.createdAt
      }))
    };

    console.log('[ADMIN] Dashboard stats calculated:', stats);

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[ADMIN] Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Admin users endpoint
app.get('/api/admin/users', async (req, res) => {
  try {
    const { status } = req.query;
    
    let whereClause = {};
    if (status === 'pending') {
      whereClause = { isApproved: false };
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isApproved: true,
        isSuspended: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('[ADMIN] Users error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Approve user endpoint
app.post('/api/admin/users/:userId/approve', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isApproved: true },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true
      }
    });

    console.log('[ADMIN] User approved:', user);

    res.json({
      success: true,
      message: 'User approved successfully',
      user
    });
  } catch (error) {
    console.error('[ADMIN] Approve user error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Admin tasks endpoint
app.get('/api/admin/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        _count: {
          select: {
            userTasks: true,
            proofs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('[ADMIN] Tasks error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Admin withdrawals endpoint
app.get('/api/admin/withdrawals/pending', async (req, res) => {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      withdrawals
    });
  } catch (error) {
    console.error('[ADMIN] Withdrawals error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Process withdrawal endpoint
app.post('/api/admin/withdrawals/:withdrawalId/process', async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, txHash } = req.body;

    const withdrawal = await prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: status.toUpperCase(),
        txHash: txHash || null,
        processedAt: new Date()
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            fullName: true
          }
        }
      }
    });

    console.log('[ADMIN] Withdrawal processed:', withdrawal);

    res.json({
      success: true,
      message: `Withdrawal ${status.toLowerCase()} successfully`,
      withdrawal
    });
  } catch (error) {
    console.error('[ADMIN] Process withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Here you should verify the password with your hashing mechanism
    if (user.password !== password) { // In production, use proper password comparison
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token (you should implement this)
    const token = 'your-jwt-token-here';

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, fullName, gender, birthdate } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password, // In production, hash this password
        username,
        fullName,
        gender,
        birthdate: new Date(birthdate),
        isApproved: false,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        isApproved: true,
        createdAt: true
      }
    });

    console.log('[AUTH] User registered:', user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

// Health check endpoint (must be before catch-all)
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    });
  } catch (error) {
    console.error('[HEALTH] Database check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      environment: process.env.NODE_ENV
    });
  }
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'PromoHive API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Debug log for static file directory
const staticDir = path.resolve(process.cwd(), 'dist');
console.log('[SERVER] Serving static files from:', staticDir);

// Serve static files from the dist directory
app.use(express.static(staticDir));

// Catch-all handler for SPA (must be last)
app.get('*', (req, res, next) => {
  const indexPath = path.join(staticDir, 'index.html');
  console.log('[SERVER] Attempting to serve:', indexPath);
  
  // Check if the file exists before sending
  if (!require('fs').existsSync(indexPath)) {
    console.error('[SERVER] index.html not found at:', indexPath);
    return next(new Error('index.html not found'));
  }
  
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR] Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SHUTDOWN] SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SHUTDOWN] SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`[SERVER] PromoHive server running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV}`);
  console.log(`[SERVER] Health check: http://localhost:${PORT}/api/health`);
});

export default app;
