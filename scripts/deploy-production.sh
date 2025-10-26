#!/bin/bash

set -e

echo "🚀 Starting PromoHive Production Deployment..."

# Navigate to project directory
cd /root/55

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Create baseline migration if it doesn't exist
if [ ! -d "prisma/migrations" ]; then
  echo "📝 Creating baseline migration..."
  mkdir -p prisma/migrations
  npx prisma migrate dev --name init --create-only
  npx prisma migrate resolve --applied init
fi

# Run migrations
echo "🗄️ Running database migrations..."
npm run prisma:migrate

# Seed database if empty
echo "🌱 Seeding database..."
npm run prisma:seed || echo "⚠️ Database already seeded or seed failed"

# Build the project
echo "🏗️ Building project..."
npm run build

# Restart PM2
echo "🔄 Restarting PM2 processes..."
pm2 restart promohive || pm2 start npm --name "promohive" -- start

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "📋 Logs:"
pm2 logs promohive --lines 20

