#!/bin/bash

# Script to update and rebuild the application on the server
# Usage: ssh root@srv1052990 "bash -s" < DEPLOY_UPDATE.sh

set -e  # Exit on error

echo "🚀 Starting deployment update..."

# Navigate to the project directory
cd /var/www/promohive || cd ~/promohive

# Pull latest changes from main branch
echo "📥 Pulling latest changes from main branch..."
git fetch origin main
git pull origin main

# Clear all caches
echo "🧹 Clearing caches..."
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Install/update dependencies if needed
echo "📦 Checking dependencies..."
npm install

# Rebuild the application
echo "🔨 Building application..."
npm run build

# Restart the application
echo "🔄 Restarting application..."
pm2 restart promohive || pm2 start dist/index.js --name promohive

# Show status
echo "✅ Deployment complete!"
pm2 status

# Show recent logs
echo "📋 Recent logs:"
pm2 logs promohive --lines 20 --nostream

