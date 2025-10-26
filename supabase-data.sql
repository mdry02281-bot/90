-- PromoHive Admin Data Setup for Supabase
-- Run this AFTER running the schema.sql

-- Insert SUPER_ADMIN user
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO users (
    id,
    username,
    email,
    password,
    full_name,
    gender,
    birthdate,
    role,
    level,
    is_approved,
    is_suspended,
    created_at,
    updated_at
) VALUES (
    'admin-001',
    'superadmin',
    'admin@promohive.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', -- Admin123!
    'Super Administrator',
    'Other',
    '1990-01-01',
    'SUPER_ADMIN',
    3,
    true,
    false,
    NOW(),
    NOW()
);

-- Create wallet for SUPER_ADMIN
INSERT INTO wallets (
    user_id,
    balance,
    pending_balance,
    total_earned,
    total_withdrawn,
    created_at,
    updated_at
) VALUES (
    'admin-001',
    1000.00,
    0.00,
    1000.00,
    0.00,
    NOW(),
    NOW()
);

-- Insert sample tasks
INSERT INTO tasks (
    id,
    title,
    description,
    type,
    reward,
    instructions,
    url,
    proof_required,
    status,
    max_participants,
    current_participants,
    created_at,
    updated_at
) VALUES 
(
    'task-001',
    'Follow Instagram Account',
    'Follow our Instagram account and like 5 recent posts',
    'MANUAL',
    2.50,
    '1. Follow @promohive on Instagram\n2. Like 5 recent posts\n3. Take screenshot of your follow\n4. Submit proof',
    'https://instagram.com/promohive',
    true,
    'ACTIVE',
    1000,
    0,
    NOW(),
    NOW()
),
(
    'task-002',
    'Join Telegram Group',
    'Join our Telegram group and stay active for 7 days',
    'MANUAL',
    5.00,
    '1. Join our Telegram group\n2. Stay active for 7 days\n3. Send a message introducing yourself\n4. Submit screenshot of your membership',
    'https://t.me/promohive',
    true,
    'ACTIVE',
    500,
    0,
    NOW(),
    NOW()
),
(
    'task-003',
    'Download Mobile App',
    'Download and install our mobile app',
    'MANUAL',
    3.00,
    '1. Download our mobile app from Play Store/App Store\n2. Complete registration\n3. Take screenshot of app installed\n4. Submit proof',
    'https://play.google.com/store/apps/details?id=com.promohive',
    true,
    'ACTIVE',
    2000,
    0,
    NOW(),
    NOW()
),
(
    'task-004',
    'Watch YouTube Video',
    'Watch our promotional video and subscribe to channel',
    'MANUAL',
    1.50,
    '1. Watch our promotional video (minimum 2 minutes)\n2. Subscribe to our YouTube channel\n3. Like the video\n4. Submit screenshot proof',
    'https://youtube.com/watch?v=promohive',
    true,
    'ACTIVE',
    1500,
    0,
    NOW(),
    NOW()
),
(
    'task-005',
    'Share on Social Media',
    'Share our promotional post on your social media',
    'MANUAL',
    4.00,
    '1. Share our promotional post on Facebook/Twitter\n2. Use hashtag #PromoHive\n3. Keep post public for 24 hours\n4. Submit screenshot proof',
    'https://facebook.com/promohive',
    true,
    'ACTIVE',
    800,
    0,
    NOW(),
    NOW()
);

-- Insert sample offers
INSERT INTO offers (
    id,
    external_id,
    source,
    title,
    description,
    reward,
    url,
    is_active,
    metadata,
    created_at,
    updated_at
) VALUES 
(
    'offer-001',
    'ADGEM_001',
    'ADGEM',
    'Complete Survey - Gaming',
    'Complete a 5-minute survey about gaming preferences',
    1.25,
    'https://adgem.com/survey/gaming',
    true,
    '{"category": "survey", "duration": "5min", "difficulty": "easy"}',
    NOW(),
    NOW()
),
(
    'offer-002',
    'ADGEM_002',
    'ADGEM',
    'Download Game - Puzzle',
    'Download and play puzzle game for 10 minutes',
    2.00,
    'https://adgem.com/game/puzzle',
    true,
    '{"category": "game", "duration": "10min", "difficulty": "medium"}',
    NOW(),
    NOW()
),
(
    'offer-003',
    'ADSTERRA_001',
    'ADSTERRA',
    'Sign Up - News App',
    'Sign up for news app and verify email',
    1.75,
    'https://adsterra.com/news-app',
    true,
    '{"category": "signup", "duration": "3min", "difficulty": "easy"}',
    NOW(),
    NOW()
);

-- Insert platform settings
INSERT INTO settings (
    id,
    key,
    value,
    updated_at
) VALUES 
(
    'setting-001',
    'PLATFORM_NAME',
    'PromoHive',
    NOW()
),
(
    'setting-002',
    'PLATFORM_DESCRIPTION',
    'Global Promo Network Platform - Earn money by completing tasks',
    NOW()
),
(
    'setting-003',
    'WELCOME_BONUS',
    '5.00',
    NOW()
),
(
    'setting-004',
    'MINIMUM_WITHDRAWAL',
    '10.00',
    NOW()
),
(
    'setting-005',
    'EXCHANGE_RATE',
    '1.00',
    NOW()
),
(
    'setting-006',
    'REFERRAL_BONUS_L1',
    '2.50',
    NOW()
),
(
    'setting-007',
    'REFERRAL_BONUS_L2',
    '1.25',
    NOW()
),
(
    'setting-008',
    'REFERRAL_BONUS_L3',
    '0.75',
    NOW()
),
(
    'setting-009',
    'LEVEL_UPGRADE_COST_L1',
    '50.00',
    NOW()
),
(
    'setting-010',
    'LEVEL_UPGRADE_COST_L2',
    '100.00',
    NOW()
),
(
    'setting-011',
    'LEVEL_UPGRADE_COST_L3',
    '200.00',
    NOW()
),
(
    'setting-012',
    'LEVEL_BONUS_L1',
    '1.25',
    NOW()
),
(
    'setting-013',
    'LEVEL_BONUS_L2',
    '1.50',
    NOW()
),
(
    'setting-014',
    'LEVEL_BONUS_L3',
    '2.00',
    NOW()
),
(
    'setting-015',
    'PAYOUT_WALLET',
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    NOW()
),
(
    'setting-016',
    'CONTACT_EMAIL',
    'support@promohive.com',
    NOW()
),
(
    'setting-017',
    'TELEGRAM_SUPPORT',
    '@PromoHiveSupport',
    NOW()
),
(
    'setting-018',
    'DISCORD_INVITE',
    'https://discord.gg/promohive',
    NOW()
);

-- Insert sample ad revenue data
INSERT INTO ad_revenue (
    id,
    source,
    date,
    revenue,
    impressions,
    clicks,
    conversions,
    metadata,
    created_at
) VALUES 
(
    'revenue-001',
    'ADGEM',
    CURRENT_DATE - INTERVAL '1 day',
    25.50,
    10000,
    500,
    25,
    '{"campaign": "gaming_survey", "cpm": 2.55}',
    NOW()
),
(
    'revenue-002',
    'ADSTERRA',
    CURRENT_DATE - INTERVAL '1 day',
    18.75,
    7500,
    375,
    15,
    '{"campaign": "news_app", "cpm": 2.50}',
    NOW()
),
(
    'revenue-003',
    'CPALEAD',
    CURRENT_DATE - INTERVAL '1 day',
    12.30,
    5000,
    250,
    12,
    '{"campaign": "mobile_app", "cpm": 2.46}',
    NOW()
);

-- Create admin action log
INSERT INTO admin_actions (
    id,
    admin_id,
    action,
    target_type,
    target_id,
    description,
    metadata,
    created_at
) VALUES 
(
    'action-001',
    'admin-001',
    'CREATE',
    'TASK',
    'task-001',
    'Created new manual task: Follow Instagram Account',
    '{"task_reward": 2.50, "task_type": "MANUAL"}',
    NOW()
),
(
    'action-002',
    'admin-001',
    'CREATE',
    'TASK',
    'task-002',
    'Created new manual task: Join Telegram Group',
    '{"task_reward": 5.00, "task_type": "MANUAL"}',
    NOW()
),
(
    'action-003',
    'admin-001',
    'CREATE',
    'OFFER',
    'offer-001',
    'Imported AdGem offer: Complete Survey - Gaming',
    '{"source": "ADGEM", "reward": 1.25}',
    NOW()
);

-- Success message
SELECT 'PromoHive database setup completed successfully!' as status;
