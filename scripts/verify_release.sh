#!/bin/bash

# PromoHive Release Verification Script
# This script ensures the release is ready for deployment

set -e

echo "🔍 Starting PromoHive release verification..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Check if .env file exists
if [ -f ".env" ]; then
    print_error ".env file found! This should not be committed to the repository"
    exit 1
else
    print_status ".env file not found (good)"
fi

# Check if env.example exists
if [ -f "env.example" ]; then
    print_status "env.example file found"
else
    print_error "env.example file not found"
    exit 1
fi

# Check if build passes
echo "🔨 Testing build process..."
if npm run build; then
    print_status "Build process completed successfully"
else
    print_error "Build process failed"
    exit 1
fi

# Check for TODO comments
echo "📝 Checking for TODO comments..."
if grep -r "TODO\|FIXME\|HACK" src/ --exclude-dir=node_modules; then
    print_error "TODO/FIXME/HACK comments found in source code"
    exit 1
else
    print_status "No TODO/FIXME/HACK comments found"
fi

# Check for console.log statements
echo "🔍 Checking for console.log statements..."
if grep -r "console\.log" src/ --exclude-dir=node_modules; then
    print_error "console.log statements found in source code"
    exit 1
else
    print_status "No console.log statements found"
fi

# Check if README exists and contains required sections
echo "📖 Checking README.md..."
if [ -f "README.md" ]; then
    print_status "README.md file found"
    
    # Check for required sections
    if grep -q "Environment Variables" README.md; then
        print_status "Environment Variables section found in README"
    else
        print_warning "Environment Variables section not found in README"
    fi
    
    if grep -q "Deployment" README.md; then
        print_status "Deployment section found in README"
    else
        print_warning "Deployment section not found in README"
    fi
    
    if grep -q "SUPER_ADMIN" README.md; then
        print_status "SUPER_ADMIN creation instructions found in README"
    else
        print_warning "SUPER_ADMIN creation instructions not found in README"
    fi
else
    print_error "README.md file not found"
    exit 1
fi

# Check if package.json has correct scripts
echo "📦 Checking package.json scripts..."
if grep -q '"build"' package.json; then
    print_status "Build script found in package.json"
else
    print_error "Build script not found in package.json"
    exit 1
fi

if grep -q '"dev"' package.json; then
    print_status "Dev script found in package.json"
else
    print_error "Dev script not found in package.json"
    exit 1
fi

# Check if Prisma schema exists
if [ -f "prisma/schema.prisma" ]; then
    print_status "Prisma schema found"
else
    print_error "Prisma schema not found"
    exit 1
fi

# Check if seed file exists
if [ -f "prisma/seed.ts" ]; then
    print_status "Prisma seed file found"
else
    print_error "Prisma seed file not found"
    exit 1
fi

# Check if ecosystem.config.js exists
if [ -f "ecosystem.config.js" ]; then
    print_status "PM2 ecosystem config found"
else
    print_error "PM2 ecosystem config not found"
    exit 1
fi

# Check if deployment script exists
if [ -f "scripts/deploy.sh" ]; then
    print_status "Deployment script found"
else
    print_error "Deployment script not found"
    exit 1
fi

# Check if all required dependencies are installed
echo "📦 Checking dependencies..."
if npm list --depth=0 > /dev/null 2>&1; then
    print_status "All dependencies are properly installed"
else
    print_error "Dependency check failed"
    exit 1
fi

# Check if TypeScript compiles without errors
echo "🔧 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    print_status "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Check if tests pass (if test script exists)
if grep -q '"test"' package.json; then
    echo "🧪 Running tests..."
    if npm test; then
        print_status "All tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
else
    print_warning "No test script found in package.json"
fi

# Check file permissions
echo "🔐 Checking file permissions..."
if [ -x "scripts/deploy.sh" ]; then
    print_status "Deployment script is executable"
else
    print_warning "Deployment script is not executable (run: chmod +x scripts/deploy.sh)"
fi

# Check if logo files exist
if [ -f "public/logo.png" ]; then
    print_status "Logo PNG file found"
else
    print_warning "Logo PNG file not found"
fi

if [ -f "public/logo.svg" ]; then
    print_status "Logo SVG file found"
else
    print_warning "Logo SVG file not found"
fi

# Final summary
echo ""
echo "🎉 Release verification completed!"
echo ""
print_status "✅ Release is ready for deployment"
echo ""
echo "Next steps:"
echo "1. Create a .env file from env.example"
echo "2. Update environment variables with production values"
echo "3. Run the deployment script: ./scripts/deploy.sh"
echo "4. Setup SSL certificates"
echo "5. Configure your domain DNS"
echo ""
echo "Default SUPER_ADMIN credentials:"
echo "Email: admin@promohive.com"
echo "Password: admin123!"
echo ""
print_status "Happy deploying! 🚀"
