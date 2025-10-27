#!/bin/bash

# Final Fix Script for Health Endpoint
echo "🔧 Final fix for health endpoint..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Pull latest changes
print_status "Pulling latest changes..."
git pull origin main

# Step 2: Clean and rebuild
print_status "Cleaning previous build..."
rm -rf dist/*

print_status "Building application..."
npm run build

# Step 3: Check if server.js was created
if [ -f "dist/server.js" ]; then
    print_success "Server file created successfully"
    ls -la dist/server.js
else
    print_error "Server file not found!"
    print_status "Checking dist directory:"
    ls -la dist/
    exit 1
fi

# Step 4: Restart PM2
print_status "Restarting PM2..."
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js --env production

# Step 5: Wait and test
print_status "Waiting for server to start..."
sleep 5

print_status "Testing health endpoint..."
curl -s http://localhost:3002/api/health | head -3

print_status "Testing status endpoint..."
curl -s http://localhost:3002/api/status | head -3

print_success "🎉 Fix completed! Check the results above."
