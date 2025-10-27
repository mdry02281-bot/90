#!/bin/bash

# Quick Server Update Script for Health Endpoint Fix
echo "🚀 Updating PromoHive with Health Endpoint Fix..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Step 1: Pull latest changes
print_status "Pulling latest changes..."
git pull origin main

# Step 2: Build the application
print_status "Building application..."
npm run build

# Step 3: Restart PM2
print_status "Restarting PM2..."
pm2 restart all

# Step 4: Check status
print_status "Checking PM2 status..."
pm2 status

# Step 5: Test health endpoint
print_status "Testing health endpoint..."
sleep 3
curl -s http://localhost:3002/api/health | head -5

print_success "🎉 Update completed! Health endpoint should now work."
print_status "Test with: curl http://localhost:3002/api/health"
