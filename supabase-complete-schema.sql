-- PromoHive Database Schema for Supabase
-- This script creates all necessary tables and initial data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE task_type AS ENUM ('MANUAL', 'ADGEM', 'ADSTERRA', 'REFERRAL');
CREATE TYPE task_status AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'PENDING');
CREATE TYPE transaction_type AS ENUM ('CREDIT', 'DEBIT', 'WITHDRAWAL', 'REFERRAL_BONUS', 'TASK_REWARD', 'LUCK_WHEEL', 'MINING_RETURN');
CREATE TYPE withdrawal_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');
CREATE TYPE level_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birthdate DATE NOT NULL,
    role user_role DEFAULT 'USER',
    level INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_id UUID, -- For task completion, withdrawal, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reward DECIMAL(10,2) NOT NULL,
    type task_type NOT NULL,
    status task_status DEFAULT 'ACTIVE',
    proof_required BOOLEAN DEFAULT TRUE,
    max_completions INTEGER DEFAULT NULL,
    current_completions INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Tasks (completion tracking)
CREATE TABLE user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    status task_status DEFAULT 'PENDING',
    proof_url TEXT,
    admin_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(referrer_id, referred_id)
);

-- Withdrawals table
CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    network VARCHAR(20) NOT NULL,
    status withdrawal_status DEFAULT 'PENDING',
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Level Requests table
CREATE TABLE level_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_level INTEGER NOT NULL,
    requested_level INTEGER NOT NULL,
    upgrade_cost DECIMAL(10,2) NOT NULL,
    proof_url TEXT,
    status level_status DEFAULT 'PENDING',
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USDT Addresses table
CREATE TABLE usdt_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(255) UNIQUE NOT NULL,
    network VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Luck Wheel table
CREATE TABLE luck_wheel_spins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    prize_amount DECIMAL(10,2) NOT NULL,
    spin_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, spin_date)
);

-- Mining Contracts table
CREATE TABLE mining_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    daily_return DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    total_return DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Mining Contracts
CREATE TABLE user_mining_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES mining_contracts(id) ON DELETE CASCADE,
    investment_amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Actions table
CREATE TABLE admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    target_user_id UUID REFERENCES users(id),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_task_id ON user_tasks(task_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_luck_wheel_user_date ON luck_wheel_spins(user_id, spin_date);
CREATE INDEX idx_user_mining_user_id ON user_mining_contracts(user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO users (id, email, username, full_name, password_hash, gender, birthdate, role, level, is_approved, referral_code) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@promohive.com', 'superadmin', 'Super Administrator', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4V5Qj5K5K2', 'male', '1990-01-01', 'SUPER_ADMIN', 3, true, 'ADMIN001');

INSERT INTO wallets (user_id, balance, total_earned, total_withdrawn) VALUES
('00000000-0000-0000-0000-000000000001', 1000.00, 1000.00, 0.00);

INSERT INTO tasks (title, description, reward, type, status, proof_required) VALUES
('Follow Instagram Account', 'Follow our Instagram account and like 5 recent posts', 2.50, 'MANUAL', 'ACTIVE', true),
('Join Telegram Group', 'Join our Telegram group and stay active for 7 days', 5.00, 'MANUAL', 'ACTIVE', true),
('Download Mobile App', 'Download and install our mobile app', 3.00, 'MANUAL', 'ACTIVE', true),
('Subscribe YouTube Channel', 'Subscribe to our YouTube channel and watch 3 videos', 1.50, 'MANUAL', 'ACTIVE', true),
('Follow Twitter Account', 'Follow our Twitter account and retweet 2 posts', 2.00, 'MANUAL', 'ACTIVE', true),
('Join Discord Server', 'Join our Discord server and stay active for 5 days', 4.00, 'MANUAL', 'ACTIVE', true);

INSERT INTO usdt_addresses (address, network, is_active) VALUES
('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 'TRC20', true),
('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'ERC20', true);

INSERT INTO mining_contracts (name, price, daily_return, duration_days, total_return, profit, is_active) VALUES
('Basic Mining', 10.00, 0.50, 30, 15.00, 5.00, true),
('Advanced Mining', 50.00, 3.00, 30, 90.00, 40.00, true),
('Premium Mining', 100.00, 7.00, 30, 210.00, 110.00, true);

INSERT INTO settings (key, value, description) VALUES
('platform_name', 'PromoHive', 'Platform name'),
('welcome_bonus', '5.00', 'Welcome bonus amount'),
('min_withdrawal', '10.00', 'Minimum withdrawal amount'),
('max_daily_spins', '3', 'Maximum daily spins for luck wheel'),
('max_spin_prize', '0.30', 'Maximum prize amount for luck wheel'),
('referral_level_1', '2.50', 'Level 1 referral commission'),
('referral_level_2', '1.25', 'Level 2 referral commission'),
('referral_level_3', '0.75', 'Level 3 referral commission'),
('exchange_rate', '1.00', 'USDT to USD exchange rate');

-- Create views for easier querying
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.username,
    u.full_name,
    u.role,
    u.level,
    u.is_approved,
    w.balance,
    w.total_earned,
    w.total_withdrawn,
    COUNT(DISTINCT r.id) as total_referrals,
    COUNT(DISTINCT ut.id) as tasks_completed,
    COUNT(DISTINCT lws.id) as daily_spins_today
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
LEFT JOIN referrals r ON u.id = r.referrer_id
LEFT JOIN user_tasks ut ON u.id = ut.user_id AND ut.status = 'COMPLETED'
LEFT JOIN luck_wheel_spins lws ON u.id = lws.user_id AND lws.spin_date = CURRENT_DATE
GROUP BY u.id, w.balance, w.total_earned, w.total_withdrawn;

-- Grant permissions (adjust based on your Supabase setup)
-- These would typically be handled by Supabase's RLS policies
