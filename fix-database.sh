#!/bin/bash

# Fix PostgreSQL permissions and recreate database

echo "🔧 Fixing database permissions..."

# Reset local changes
git checkout -- prisma/schema.prisma
git pull origin main

# Update password
sudo -u postgres psql -c "ALTER USER promohive_user WITH PASSWORD 'promohive_pass123';"

# Grant schema permissions
sudo -u postgres psql -d promohive -c "GRANT ALL ON SCHEMA public TO promohive_user;"
sudo -u postgres psql -d promohive -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO promohive_user;"
sudo -u postgres psql -d promohive -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO promohive_user;"
sudo -u postgres psql -d promohive -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO promohive_user;"
sudo -u postgres psql -d promohive -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO promohive_user;"

# Drop and recreate database
echo "🗑️ Dropping old database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS promohive;"
sudo -u postgres psql -c "CREATE DATABASE promohive;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;"

# Update .env
cp env.production.local .env

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🚀 Running migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

# Build
echo "🔨 Building..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart promohive

# Test
echo "🧪 Testing..."
sleep 3
curl https://globalpromonetwork.store/health

echo "✅ Done!"
