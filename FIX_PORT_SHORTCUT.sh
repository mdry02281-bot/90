#!/bin/bash

# Clean up and restart properly
# Run this on your server

echo "🔍 Checking for processes on port 3002..."
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

echo "🛑 Stopping all PM2 processes..."
pm2 delete all

echo "🧹 Cleaning up..."
rm -rf dist

echo "🔨 Rebuilding..."
npm run build

echo "🚀 Starting fresh..."
pm2 start dist/index.js --name promohive

echo "✅ Done!"
pm2 status
pm2 logs promohive --lines 20

