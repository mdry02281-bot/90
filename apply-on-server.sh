#!/bin/bash

cd /root/55

echo "🗑️ Dropping database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS promohive;"

echo "📦 Creating database..."
sudo -u postgres psql -c "CREATE DATABASE promohive OWNER promohive_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;"

echo "📝 Copying env file..."
cp env.production.local .env

echo "📦 Generating Prisma Client..."
npm run prisma:generate

echo "🚀 Creating migrations directory..."
mkdir -p prisma/migrations/20251026150000_initial_setup

echo "🔧 Pushing schema to database..."
npx prisma db push --skip-generate

echo "🌱 Seeding database..."
npm run prisma:seed

echo "🔨 Building..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart promohive

echo "✅ Done! Testing..."
sleep 3
curl https://globalpromonetwork.store/health

echo ""
echo "🔍 Checking database..."
sudo -u postgres psql -d promohive -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
