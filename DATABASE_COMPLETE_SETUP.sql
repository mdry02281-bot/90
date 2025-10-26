-- ============================================================================
-- PromoHive Complete Database Setup
-- ============================================================================
-- This script creates all tables, indexes, constraints, and security rules
-- Execute this on your Neon PostgreSQL database
-- ============================================================================

-- Connect to your database first
-- Use your connection string from Neon dashboard

-- ============================================================================
-- 1. ENUMS
-- ============================================================================

-- UserRole
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM('USER', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TaskStatus
DO $$ BEGIN
    CREATE TYPE "TaskStatus" AS ENUM('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TaskType
DO $$ BEGIN
    CREATE TYPE "TaskType" AS ENUM('MANUAL', 'ADGEM', 'ADSTERRA', 'CPALEAD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ProofStatus
DO $$ BEGIN
    CREATE TYPE "ProofStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- WithdrawalStatus
DO $$ BEGIN
    CREATE TYPE "WithdrawalStatus" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TransactionType
DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM('SIGNUP_BONUS', 'TASK_REWARD', 'REFERRAL_BONUS', 'LEVEL_UPGRADE', 'WITHDRAWAL', 'ADMIN_CREDIT', 'ADMIN_DEBIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- LevelRequestStatus
DO $$ BEGIN
    CREATE TYPE "LevelRequestStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- SpinPrizeType
DO $$ BEGIN
    CREATE TYPE "SpinPrizeType" AS ENUM('BONUS', 'DIRECT_REWARD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- User Table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    gender TEXT,
    birthdate TIMESTAMP,
    role "UserRole" DEFAULT 'USER',
    level INTEGER DEFAULT 0,
    "isApproved" BOOLEAN DEFAULT false,
    "isSuspended" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "lastLoginAt" TIMESTAMP
);

-- Wallet Table
CREATE TABLE IF NOT EXISTS "Wallet" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    balance DECIMAL(10, 2) DEFAULT 0,
    "pendingBalance" DECIMAL(10, 2) DEFAULT 0,
    "totalEarned" DECIMAL(10, 2) DEFAULT 0,
    "totalWithdrawn" DECIMAL(10, 2) DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Transaction Table
CREATE TABLE IF NOT EXISTS "Transaction" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type "TransactionType" NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Task Table
CREATE TABLE IF NOT EXISTS "Task" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type "TaskType" NOT NULL,
    reward DECIMAL(10, 2) NOT NULL,
    instructions TEXT,
    url TEXT,
    "proofRequired" BOOLEAN DEFAULT true,
    status "TaskStatus" DEFAULT 'ACTIVE',
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER DEFAULT 0,
    "externalId" TEXT,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- UserTask Table
CREATE TABLE IF NOT EXISTS "UserTask" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "taskId" TEXT NOT NULL REFERENCES "Task"(id) ON DELETE CASCADE,
    status "ProofStatus" DEFAULT 'PENDING',
    reward DECIMAL(10, 2) NOT NULL,
    "startedAt" TIMESTAMP DEFAULT NOW(),
    "completedAt" TIMESTAMP,
    UNIQUE("userId", "taskId")
);

-- Proof Table
CREATE TABLE IF NOT EXISTS "Proof" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "taskId" TEXT NOT NULL REFERENCES "Task"(id) ON DELETE CASCADE,
    "userTaskId" TEXT NOT NULL REFERENCES "UserTask"(id) ON DELETE CASCADE,
    "proofUrl" TEXT,
    "proofText" TEXT,
    status "ProofStatus" DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Offer Table
CREATE TABLE IF NOT EXISTS "Offer" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "externalId" TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward DECIMAL(10, 2) NOT NULL,
    url TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Referral Table
CREATE TABLE IF NOT EXISTS "Referral" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "referrerId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "referredId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    bonus DECIMAL(10, 2) NOT NULL,
    "isPaid" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Withdrawal Table
CREATE TABLE IF NOT EXISTS "Withdrawal" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    "usdtAmount" DECIMAL(10, 2) NOT NULL,
    "conversionRate" DECIMAL(10, 4) NOT NULL,
    "walletAddress" TEXT NOT NULL,
    network TEXT NOT NULL,
    status "WithdrawalStatus" DEFAULT 'PENDING',
    "txHash" TEXT,
    "rejectionReason" TEXT,
    "processedBy" TEXT,
    "processedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- LevelRequest Table
CREATE TABLE IF NOT EXISTS "LevelRequest" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "requestedLevel" INTEGER NOT NULL,
    "proofUrl" TEXT,
    status "LevelRequestStatus" DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- AdminAction Table
CREATE TABLE IF NOT EXISTS "AdminAction" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "adminId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- AdRevenue Table
CREATE TABLE IF NOT EXISTS "AdRevenue" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    source TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    revenue DECIMAL(10, 2) NOT NULL,
    impressions INTEGER,
    clicks INTEGER,
    conversions INTEGER,
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    UNIQUE(source, date)
);

-- Setting Table
CREATE TABLE IF NOT EXISTS "Setting" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- MagicLinkToken Table
CREATE TABLE IF NOT EXISTS "MagicLinkToken" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- SpinPrize Table
CREATE TABLE IF NOT EXISTS "SpinPrize" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    type "SpinPrizeType" NOT NULL,
    amount DECIMAL(10, 2),
    probability INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Spin Table
CREATE TABLE IF NOT EXISTS "Spin" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "prizeId" TEXT REFERENCES "SpinPrize"(id) ON DELETE SET NULL,
    result TEXT NOT NULL,
    won BOOLEAN DEFAULT false,
    "bonusAmount" DECIMAL(10, 2),
    metadata JSONB,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- DailySpinLimit Table
CREATE TABLE IF NOT EXISTS "DailySpinLimit" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "spinsUsed" INTEGER DEFAULT 0,
    "maxSpins" INTEGER DEFAULT 3,
    "resetDate" TIMESTAMP DEFAULT NOW(),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

-- User indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "User_username_idx" ON "User"(username);
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"(role);

-- Wallet indexes
CREATE INDEX IF NOT EXISTS "Wallet_userId_idx" ON "Wallet"("userId");

-- Transaction indexes
CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"(type);
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- Task indexes
CREATE INDEX IF NOT EXISTS "Task_type_idx" ON "Task"(type);
CREATE INDEX IF NOT EXISTS "Task_status_idx" ON "Task"(status);

-- UserTask indexes
CREATE INDEX IF NOT EXISTS "UserTask_userId_idx" ON "UserTask"("userId");
CREATE INDEX IF NOT EXISTS "UserTask_taskId_idx" ON "UserTask"("taskId");
CREATE INDEX IF NOT EXISTS "UserTask_status_idx" ON "UserTask"(status);

-- Proof indexes
CREATE INDEX IF NOT EXISTS "Proof_userId_idx" ON "Proof"("userId");
CREATE INDEX IF NOT EXISTS "Proof_taskId_idx" ON "Proof"("taskId");
CREATE INDEX IF NOT EXISTS "Proof_status_idx" ON "Proof"(status);

-- Offer indexes
CREATE INDEX IF NOT EXISTS "Offer_source_idx" ON "Offer"(source);
CREATE INDEX IF NOT EXISTS "Offer_isActive_idx" ON "Offer"("isActive");

-- Referral indexes
CREATE INDEX IF NOT EXISTS "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX IF NOT EXISTS "Referral_referredId_idx" ON "Referral"("referredId");

-- Withdrawal indexes
CREATE INDEX IF NOT EXISTS "Withdrawal_userId_idx" ON "Withdrawal"("userId");
CREATE INDEX IF NOT EXISTS "Withdrawal_status_idx" ON "Withdrawal"(status);

-- LevelRequest indexes
CREATE INDEX IF NOT EXISTS "LevelRequest_userId_idx" ON "LevelRequest"("userId");
CREATE INDEX IF NOT EXISTS "LevelRequest_status_idx" ON "LevelRequest"(status);

-- AdminAction indexes
CREATE INDEX IF NOT EXISTS "AdminAction_adminId_idx" ON "AdminAction"("adminId");
CREATE INDEX IF NOT EXISTS "AdminAction_targetType_idx" ON "AdminAction"("targetType");
CREATE INDEX IF NOT EXISTS "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

-- AdRevenue indexes
CREATE INDEX IF NOT EXISTS "AdRevenue_source_idx" ON "AdRevenue"(source);
CREATE INDEX IF NOT EXISTS "AdRevenue_date_idx" ON "AdRevenue"(date);

-- Setting indexes
CREATE INDEX IF NOT EXISTS "Setting_key_idx" ON "Setting"(key);

-- MagicLinkToken indexes
CREATE INDEX IF NOT EXISTS "MagicLinkToken_token_idx" ON "MagicLinkToken"(token);
CREATE INDEX IF NOT EXISTS "MagicLinkToken_userId_idx" ON "MagicLinkToken"("userId");

-- SpinPrize indexes
CREATE INDEX IF NOT EXISTS "SpinPrize_isActive_idx" ON "SpinPrize"("isActive");
CREATE INDEX IF NOT EXISTS "SpinPrize_order_idx" ON "SpinPrize"("order");

-- Spin indexes
CREATE INDEX IF NOT EXISTS "Spin_userId_idx" ON "Spin"("userId");
CREATE INDEX IF NOT EXISTS "Spin_createdAt_idx" ON "Spin"("createdAt");

-- DailySpinLimit indexes
CREATE INDEX IF NOT EXISTS "DailySpinLimit_userId_idx" ON "DailySpinLimit"("userId");

-- ============================================================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_updated_at BEFORE UPDATE ON "Wallet" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_updated_at BEFORE UPDATE ON "Task" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offer_updated_at BEFORE UPDATE ON "Offer" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setting_updated_at BEFORE UPDATE ON "Setting" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spinprize_updated_at BEFORE UPDATE ON "SpinPrize" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dailyspinlimit_updated_at BEFORE UPDATE ON "DailySpinLimit" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. SAMPLE DATA
-- ============================================================================

-- Insert Super Admin (password: admin123! hashed with bcrypt)
INSERT INTO "User" (id, username, email, password, "fullName", role, "isApproved", level)
VALUES (
    'admin-001',
    'admin',
    'admin@promohive.com',
    '$2b$10$rKJ8b8XsB8T7N9f2Gz3vLuGQxY9CzJY8xwJ8B8XsB8T7N9f2Gz3vLu',
    'Super Admin',
    'SUPER_ADMIN',
    true,
    4
) ON CONFLICT (email) DO NOTHING;

-- Create wallet for admin
INSERT INTO "Wallet" ("userId", balance, "totalEarned")
VALUES (
    'admin-001',
    10000.00,
    10000.00
) ON CONFLICT ("userId") DO NOTHING;

-- Insert sample admin action
INSERT INTO "AdminAction" ("adminId", action, "targetType", "targetId", description, metadata)
VALUES (
    'admin-001',
    'SYSTEM_INITIALIZED',
    'SYSTEM',
    'system',
    'PromoHive system initialized with complete database setup',
    '{"version": "1.0.0", "setup": "complete"}'::jsonb
);

-- ============================================================================
-- 6. SECURITY RULES (RLS - Row Level Security)
-- ============================================================================

-- Enable RLS on critical tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Withdrawal" ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_select_own ON "User" FOR SELECT USING (id = current_setting('app.user_id', true));

CREATE POLICY wallet_select_own ON "Wallet" FOR SELECT USING ("userId" = current_setting('app.user_id', true));

CREATE POLICY transaction_select_own ON "Transaction" FOR SELECT USING ("userId" = current_setting('app.user_id', true));

CREATE POLICY withdrawal_select_own ON "Withdrawal" FOR SELECT USING ("userId" = current_setting('app.user_id', true));

-- ============================================================================
-- 7. GRANTS & PERMISSIONS
-- ============================================================================

-- Grant necessary permissions (adjust as needed for your database user)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO neondb_owner;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO neondb_owner;

-- ============================================================================
-- COMPLETE! ✅
-- ============================================================================

SELECT 'Database setup complete!' AS message;

