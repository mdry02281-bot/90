#!/bin/bash

# Setup local PostgreSQL database for PromoHive
# Run this on your server

echo "🔧 Setting up local PostgreSQL database..."

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    apt update
    apt install -y postgresql postgresql-contrib
fi

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Create database and user
echo "📊 Creating database and user..."
sudo -u postgres psql << 'EOF'
-- Create database
CREATE DATABASE promohive;

-- Create user
CREATE USER promohive_user WITH PASSWORD 'promohive_secure_password_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
ALTER USER promohive_user CREATEDB;

\c promohive

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO promohive_user;

\q
EOF

echo "✅ Database setup complete!"
echo "📝 Connection string:"
echo "DATABASE_URL=\"postgresql://promohive_user:promohive_secure_password_2024@localhost:5432/promohive\""

