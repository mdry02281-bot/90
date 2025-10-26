-- ============================================
-- PromoHive Complete Database Schema for Supabase
-- ============================================
-- Execute this script in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab/editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "TaskStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TaskType" AS ENUM ('MANUAL', 'ADGEM', 'ADSTERRA', 'CPALEAD');
CREATE TYPE "ProofStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');
CREATE TYPE "TransactionType" AS ENUM ('SIGNUP_BONUS', 'TASK_REWARD', 'REFERRAL_BONUS', 'LEVEL_UPGRADE', 'WITHDRAWAL', 'ADMIN_CREDIT', 'ADMIN_DEBIT');
CREATE TYPE "LevelRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- ============================================
-- TABLES
-- ============================================

-- Users Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT,
    "birthdate" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "level" INTEGER NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3)
);

-- Wallet Table
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "balance" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "pendingBalance" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "totalEarned" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "totalWithdrawn" DECIMAL(10, 2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Transaction Table
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Task Table
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "reward" DECIMAL(10, 2) NOT NULL,
    "instructions" TEXT,
    "url" TEXT,
    "proofRequired" BOOLEAN NOT NULL DEFAULT true,
    "status" "TaskStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "externalId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- UserTask Table
CREATE TABLE "UserTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "ProofStatus" NOT NULL DEFAULT 'PENDING',
    "reward" DECIMAL(10, 2) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    UNIQUE("userId", "taskId"),
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE
);

-- Proof Table
CREATE TABLE "Proof" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userTaskId" TEXT NOT NULL,
    "proofUrl" TEXT,
    "proofText" TEXT,
    "status" "ProofStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    FOREIGN KEY ("userTaskId") REFERENCES "UserTask"("id") ON DELETE CASCADE
);

-- Offer Table
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL UNIQUE,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" DECIMAL(10, 2) NOT NULL,
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Referral Table
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL UNIQUE,
    "level" INTEGER NOT NULL,
    "bonus" DECIMAL(10, 2) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("referredId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Withdrawal Table
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "usdtAmount" DECIMAL(10, 2) NOT NULL,
    "conversionRate" DECIMAL(10, 4) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "txHash" TEXT,
    "rejectionReason" TEXT,
    "processedBy" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- LevelRequest Table
CREATE TABLE "LevelRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "requestedLevel" INTEGER NOT NULL,
    "proofUrl" TEXT,
    "status" "LevelRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- AdminAction Table
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- AdRevenue Table
CREATE TABLE "AdRevenue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(10, 2) NOT NULL,
    "impressions" INTEGER,
    "clicks" INTEGER,
    "conversions" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("source", "date")
);

-- Setting Table
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- MagicLinkToken Table
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================

-- User indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "User_role_idx" ON "User"("role");

-- Wallet indexes
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- Transaction indexes
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- Task indexes
CREATE INDEX "Task_type_idx" ON "Task"("type");
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- UserTask indexes
CREATE INDEX "UserTask_userId_idx" ON "UserTask"("userId");
CREATE INDEX "UserTask_taskId_idx" ON "UserTask"("taskId");
CREATE INDEX "UserTask_status_idx" ON "UserTask"("status");

-- Proof indexes
CREATE INDEX "Proof_userId_idx" ON "Proof"("userId");
CREATE INDEX "Proof_taskId_idx" ON "Proof"("taskId");
CREATE INDEX "Proof_status_idx" ON "Proof"("status");

-- Offer indexes
CREATE INDEX "Offer_source_idx" ON "Offer"("source");
CREATE INDEX "Offer_isActive_idx" ON "Offer"("isActive");

-- Referral indexes
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX "Referral_referredId_idx" ON "Referral"("referredId");

-- Withdrawal indexes
CREATE INDEX "Withdrawal_userId_idx" ON "Withdrawal"("userId");
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");

-- LevelRequest indexes
CREATE INDEX "LevelRequest_userId_idx" ON "LevelRequest"("userId");
CREATE INDEX "LevelRequest_status_idx" ON "LevelRequest"("status");

-- AdminAction indexes
CREATE INDEX "AdminAction_adminId_idx" ON "AdminAction"("adminId");
CREATE INDEX "AdminAction_targetType_idx" ON "AdminAction"("targetType");
CREATE INDEX "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

-- AdRevenue indexes
CREATE INDEX "AdRevenue_source_idx" ON "AdRevenue"("source");
CREATE INDEX "AdRevenue_date_idx" ON "AdRevenue"("date");

-- Setting indexes
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- MagicLinkToken indexes
CREATE INDEX "MagicLinkToken_token_idx" ON "MagicLinkToken"("token");
CREATE INDEX "MagicLinkToken_userId_idx" ON "MagicLinkToken"("userId");

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Super Admin User
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO "User" ("id", "username", "email", "password", "fullName", "role", "level", "isApproved", "createdAt", "updatedAt") 
VALUES (
    'clx00000000000000000000001',
    'superadmin',
    'admin@promohive.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyLYx.rZCYjW', -- bcrypt hash for "Admin123!"
    'Super Admin',
    'SUPER_ADMIN',
    4,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Super Admin Wallet
INSERT INTO "Wallet" ("id", "userId", "balance", "createdAt", "updatedAt")
VALUES (
    'clx00000000000000000000002',
    'clx00000000000000000000001',
    1000.00,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Sample Tasks
INSERT INTO "Task" ("id", "title", "description", "type", "reward", "status", "createdAt", "updatedAt") VALUES
('clx00000000000000000000003', 'Follow Instagram Account', 'Follow our Instagram account and like 5 recent posts', 'MANUAL', 2.50, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx00000000000000000000004', 'Join Telegram Group', 'Join our Telegram group and stay active for 7 days', 'MANUAL', 5.00, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx00000000000000000000005', 'Download Mobile App', 'Download and install our mobile app', 'MANUAL', 3.00, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx00000000000000000000006', 'Subscribe YouTube Channel', 'Subscribe to our YouTube channel and watch 3 videos', 'MANUAL', 1.50, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx00000000000000000000007', 'Follow Twitter Account', 'Follow our Twitter account and retweet 2 posts', 'MANUAL', 2.00, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('clx00000000000000000000008', 'Join Discord Server', 'Join our Discord server and stay active for 5 days', 'MANUAL', 4.00, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Default Settings
INSERT INTO "Setting" ("id", "key", "value", "updatedAt") VALUES
('clx00000000000000000000009', 'WELCOME_BONUS', '5.00', CURRENT_TIMESTAMP),
('clx00000000000000000000010', 'MIN_WITHDRAWAL', '10.00', CURRENT_TIMESTAMP),
('clx00000000000000000000011', 'MAX_DAILY_SPINS', '3', CURRENT_TIMESTAMP),
('clx00000000000000000000012', 'MAX_SPIN_PRIZE', '0.30', CURRENT_TIMESTAMP),
('clx00000000000000000000013', 'FREE_USER_LIMIT', '9.90', CURRENT_TIMESTAMP),
('clx00000000000000000000014', 'SUPPORT_WHATSAPP', '+17253348692', CURRENT_TIMESTAMP),
('clx00000000000000000000015', 'SUPPORT_EMAIL', 'promohive@globalpromonetwork.store', CURRENT_TIMESTAMP),
('clx00000000000000000000016', 'HOME_BANNER_TITLE', '🎁 Seize the Opportunity!', CURRENT_TIMESTAMP),
('clx00000000000000000000017', 'HOME_BANNER_SUBTITLE', 'Sign up for a new account and earn $5 instantly!', CURRENT_TIMESTAMP),
('clx00000000000000000000018', 'HOME_BANNER_BUTTON_TEXT', 'Get Your $5 Bonus 🚀', CURRENT_TIMESTAMP),
('clx00000000000000000000019', 'HOME_BANNER_BONUS_AMOUNT', '$5', CURRENT_TIMESTAMP);

-- ============================================
-- COMPLETE!
-- ============================================
-- All tables, indexes, and seed data have been created.
-- You can now use the application with full database support.
