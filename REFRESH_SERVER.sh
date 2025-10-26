#!/bin/bash

cd /root/55

echo "🔄 Stopping PM2..."
pm2 delete promohive

echo "📦 Rebuilding..."
npm run build

echo "🚀 Starting PM2..."
pm2 start npm --name promohive -- start

echo "💾 Saving PM2 configuration..."
pm2 save

echo "✅ Testing..."
sleep 3
curl https://globalpromonetwork.store/health

echo ""
echo "🔍 PM2 Status:"
pm2 status
