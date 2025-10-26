#!/bin/bash

# PromoHive Test Runner Script
# This script runs the test suite with proper setup

set -e

echo "🧪 Starting PromoHive test suite..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if test database is configured
if [ -z "$TEST_DATABASE_URL" ]; then
    print_warning "TEST_DATABASE_URL not set, using default test database"
    export TEST_DATABASE_URL="postgresql://test:test@localhost:5432/promohive_test"
fi

# Check if test database exists
print_status "Setting up test database..."

# Create test database if it doesn't exist
createdb promohive_test 2>/dev/null || print_warning "Test database may already exist"

# Run Prisma migrations for test database
print_status "Running Prisma migrations for test database..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run tests
print_status "Running test suite..."
if npm test; then
    print_status "✅ All tests passed!"
else
    print_error "❌ Some tests failed"
    exit 1
fi

# Run coverage report
print_status "Generating coverage report..."
if npm run test:coverage; then
    print_status "✅ Coverage report generated"
else
    print_warning "Coverage report generation failed"
fi

# Clean up test database
print_status "Cleaning up test database..."
dropdb promohive_test 2>/dev/null || print_warning "Test database cleanup failed"

print_status "🎉 Test suite completed successfully!"
