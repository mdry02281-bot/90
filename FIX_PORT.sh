#!/bin/bash

cd /root/55

echo "🔍 Finding process using port 3002..."
sudo lsof -i :3002

echo "🔪 Killing all processes on port 3002..."
sudo fuser -k 3002/tcp

echo "⏱️  Waiting 2 seconds..."
sleep 2

echo "🛑 Stopping all PM2 processes..."
pm2 delete all

echo "🧹 Cleaning PM2..."
pm2 flush

echo "✅ Starting fresh..."
npm run build
pm2 start npm --name promohive -- start
pm2 save

echo "⏱️  Waiting 5 seconds..."
sleep 5

echo "🔍 Checking status..."
pm2 status

echo ""
echo "🧪 Testing..."
curl http://localhost:3002/health

echo ""
echo "🔍 Checking logs..."
pm2 logs promohive --lines 10
