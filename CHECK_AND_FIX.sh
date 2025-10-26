#!/bin/bash

cd /root/55

echo "🔍 Checking current setup..."

# Check dist folder
echo "📁 Dist files:"
ls -lah dist/ | head -10

# Check file timestamps
echo ""
echo "📅 File timestamps:"
stat dist/index.html
stat dist/assets/index-*.js

# Rebuild
echo ""
echo "🔨 Rebuilding..."
npm run build

# Check if new files are created
echo ""
echo "📅 New file timestamps:"
stat dist/index.html
stat dist/assets/index-*.js

# Restart PM2
echo ""
echo "🔄 Restarting PM2..."
pm2 restart promohive

# Wait
sleep 3

# Test
echo ""
echo "✅ Testing..."
curl https://globalpromonetwork.store/health

# Check what files are being served
echo ""
echo "🔍 Checking served files:"
curl -I https://globalpromonetwork.store/assets/index-*.js 2>&1 | head -5

echo ""
echo "📋 PM2 Status:"
pm2 status
