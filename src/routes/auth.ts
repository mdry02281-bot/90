import express from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';
import { sendWelcomeEmail, sendApprovalEmail, sendMagicLinkEmail } from '../services/email';
import { logger } from '../utils/logger';
import { asyncHandler } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = express.Router();

const SALT_ROUNDS = 12;

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
  password: z.string().min(8),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthdate: z.string().optional(),
  referredBy: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const magicLinkSchema = z.object({
  email: z.string().email(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

// Generate unique referral code
const generateReferralCode = (): string => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });

  if (existingUser) {
    return res.status(400).json({
      error: existingUser.email === data.email ? 'Email already registered' : 'Username already taken',
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Generate unique referral code
  let referralCode = generateReferralCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await prisma.user.findUnique({
      where: { referralCode },
    });
    if (!existing) break;
    referralCode = generateReferralCode();
    attempts++;
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: passwordHash,
      fullName: data.fullName,
      gender: data.gender,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
      referralCode,
      isApproved: false,
      role: 'USER',
      level: 0,
    },
  });

  // Create wallet
  await prisma.wallet.create({
    data: {
      userId: user.id,
      balance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
    },
  });

  // Handle referral if exists
  if (data.referredBy) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: data.referredBy },
    });

    if (referrer) {
      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: user.id,
          level: 1,
          bonus: 0,
        },
      });
    }
  }

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.fullName);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }

  logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Your account is under review.',
  });
}));

// Login with password
router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { wallet: true },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!user.isApproved) {
    return res.status(403).json({ error: 'Your account is not approved yet' });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended' });
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      level: user.level,
      balance: user.wallet?.balance || 0,
    },
  });
}));

// Request magic link
router.post('/magic-link', asyncHandler(async (req, res) => {
  const data = magicLinkSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    // Don't reveal if email exists
    return res.json({ 
      success: true, 
      message: 'If the email exists, a magic link has been sent.' 
    });
  }

  if (!user.isApproved) {
    return res.status(403).json({ error: 'Your account is not approved yet' });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.magicLinkToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
      used: false,
    },
  });

  const magicLink = `${process.env.PLATFORM_URL || 'http://localhost:3000'}/auth/magic-link?token=${token}`;
  
  try {
    await sendMagicLinkEmail(user.email, user.fullName, magicLink);
  } catch (error) {
    logger.error('Failed to send magic link email:', error);
    return res.status(500).json({ error: 'Failed to send magic link' });
  }

  res.json({ success: true, message: 'Magic link sent to your email' });
}));

// Verify magic link
router.post('/verify-magic-link', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  const tokenRecord = await prisma.magicLinkToken.findUnique({
    where: { token },
    include: { user: { include: { wallet: true } } },
  });

  if (!tokenRecord) {
    return res.status(400).json({ error: 'Invalid magic link' });
  }

  if (tokenRecord.used) {
    return res.status(400).json({ error: 'Magic link already used' });
  }

  if (new Date() > tokenRecord.expiresAt) {
    return res.status(400).json({ error: 'Magic link expired' });
  }

  const user = tokenRecord.user;

  if (!user.isApproved) {
    return res.status(403).json({ error: 'Your account is not approved yet' });
  }

  if (user.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended' });
  }

  // Mark token as used
  await prisma.magicLinkToken.update({
    where: { id: tokenRecord.id },
    data: { used: true },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const { accessToken, refreshToken } = generateTokenPair(tokenPayload);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  logger.info(`User logged in via magic link: ${user.email}`);

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      level: user.level,
      balance: user.wallet?.balance || 0,
    },
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { wallet: true },
    });

    if (!user || !user.isApproved || user.isSuspended) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken } = generateTokenPair(tokenPayload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true });
}));

// Change password
router.post('/change-password', asyncHandler(async (req, res) => {
  const data = changePasswordSchema.parse(req.body);
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const validPassword = await bcrypt.compare(data.currentPassword, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  const newPasswordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newPasswordHash },
  });

  logger.info(`Password changed for user: ${user.email}`);

  res.json({ success: true, message: 'Password changed successfully' });
}));

export default router;