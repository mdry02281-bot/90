#!/bin/bash

# PromoHive Server Update Script
# This script updates the PromoHive application on the server

echo "🚀 Starting PromoHive Update Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the PromoHive root directory."
    exit 1
fi

print_status "Current directory: $(pwd)"

# Step 1: Pull latest changes from Git
print_status "Step 1: Pulling latest changes from Git..."
git pull origin main
if [ $? -eq 0 ]; then
    print_success "Git pull completed successfully"
else
    print_error "Git pull failed"
    exit 1
fi

# Step 2: Install/Update dependencies
print_status "Step 2: Installing/updating dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Fix security vulnerabilities
print_status "Step 3: Checking and fixing security vulnerabilities..."
npm audit fix --force
if [ $? -eq 0 ]; then
    print_success "Security vulnerabilities fixed"
else
    print_warning "Some vulnerabilities could not be fixed automatically"
fi

# Step 4: Generate Prisma client
print_status "Step 4: Generating Prisma client..."
npm run prisma:generate
if [ $? -eq 0 ]; then
    print_success "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    exit 1
fi

# Step 5: Run database migrations
print_status "Step 5: Running database migrations..."
npm run prisma:migrate
if [ $? -eq 0 ]; then
    print_success "Database migrations completed successfully"
else
    print_error "Database migrations failed"
    exit 1
fi

# Step 6: Build the application
print_status "Step 6: Building the application..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 7: Stop PM2 processes
print_status "Step 7: Stopping PM2 processes..."
pm2 stop all
pm2 delete all
if [ $? -eq 0 ]; then
    print_success "PM2 processes stopped and deleted"
else
    print_warning "Some PM2 processes may not have been stopped properly"
fi

# Step 8: Clear PM2 logs
print_status "Step 8: Clearing PM2 logs..."
pm2 flush
if [ $? -eq 0 ]; then
    print_success "PM2 logs cleared"
else
    print_warning "Could not clear PM2 logs"
fi

# Step 9: Start PM2 with production environment
print_status "Step 9: Starting PM2 with production environment..."
pm2 start ecosystem.config.js --env production
if [ $? -eq 0 ]; then
    print_success "PM2 started successfully"
else
    print_error "Failed to start PM2"
    exit 1
fi

# Step 10: Save PM2 configuration
print_status "Step 10: Saving PM2 configuration..."
pm2 save
if [ $? -eq 0 ]; then
    print_success "PM2 configuration saved"
else
    print_warning "Could not save PM2 configuration"
fi

# Step 11: Setup PM2 startup script
print_status "Step 11: Setting up PM2 startup script..."
pm2 startup
if [ $? -eq 0 ]; then
    print_success "PM2 startup script configured"
else
    print_warning "Could not configure PM2 startup script"
fi

# Step 12: Check application status
print_status "Step 12: Checking application status..."
sleep 5
pm2 status
pm2 logs --lines 10

print_success "🎉 PromoHive update completed successfully!"
print_status "Application should now be running on port 3002"
print_status "Check logs with: pm2 logs"
print_status "Check status with: pm2 status"

# Optional: Test the application
print_status "Testing application endpoint..."
curl -f http://localhost:3002/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Application is responding correctly"
else
    print_warning "Application may not be responding yet. Check logs with: pm2 logs"
fi

echo ""
print_status "Update process completed!"
print_status "You can monitor the application with:"
print_status "  - pm2 status"
print_status "  - pm2 logs"
print_status "  - pm2 monit"
