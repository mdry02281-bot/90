import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Import cron jobs
import './cron';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import tasksRoutes from './routes/tasks';
import referralsRoutes from './routes/referrals';
import withdrawalsRoutes from './routes/withdrawals';
import adminRoutes from './routes/admin';
import webhooksRoutes from './routes/webhooks';

const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "https://api.*", "wss:"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);
app.use('/api/referrals', authMiddleware, referralsRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalsRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/webhooks', webhooksRoutes);

// Serve static files if they exist
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../dist');
  if (require('fs').existsSync(staticPath)) {
    app.use(express.static(staticPath));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      const indexPath = path.join(staticPath, 'index.html');
      if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: 'Frontend not found' });
      }
    });
  } else {
    // If dist folder doesn't exist, return 404 for non-API routes
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });
  }
} else {
  // In development, just return 404 for non-API routes
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
}

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 PromoHive server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

export default app;