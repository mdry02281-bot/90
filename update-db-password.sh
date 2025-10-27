#!/bin/bash

# Database Password Update Script
echo "🔧 Updating database password..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Step 1: Pull latest changes
print_status "Pulling latest changes..."
git pull origin main

# Step 2: Restart PM2 with updated environment
print_status "Restarting PM2 with updated environment..."
pm2 restart all --update-env

# Step 3: Wait for restart
print_status "Waiting for server to restart..."
sleep 5

# Step 4: Test health endpoint
print_status "Testing health endpoint..."
curl -s http://localhost:3002/api/health | jq .

# Step 5: Test status endpoint
print_status "Testing status endpoint..."
curl -s http://localhost:3002/api/status | jq .

print_success "🎉 Database password updated! Check results above."
