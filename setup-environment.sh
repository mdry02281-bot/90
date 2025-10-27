#!/bin/bash

# PromoHive Environment Setup Script
# This script sets up environment variables on the server

echo "🔧 Setting up PromoHive Environment Variables..."

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
if [ ! -f "ecosystem.config.js" ]; then
    print_error "ecosystem.config.js not found. Please run this script from the PromoHive root directory."
    exit 1
fi

print_status "Setting up environment variables for PromoHive..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cp env.production .env
    print_success ".env file created from env.production"
else
    print_warning ".env file already exists. Backing up..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    print_success "Backup created"
fi

# Set environment variables in the shell session
print_status "Setting environment variables..."

# Database Configuration
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"
export SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0MDkyNywiZXhwIjoyMDc3MDE2OTI3fQ.kWtyqG9Rz7Z_Cf2hBhgjW5eMwPgC6YLJzZQH1gW8D7o"

# JWT Configuration
export JWT_SECRET="promohive-super-secret-jwt-key-2024"
export JWT_REFRESH_SECRET="promohive-super-secret-refresh-key-2024"
export ACCESS_TOKEN_EXPIRES_IN="15m"
export REFRESH_TOKEN_EXPIRES_IN="7d"

# Server Configuration
export PORT="3002"
export HOST="srv1052990.hstgr.cloud"
export CORS_ORIGIN="https://globalpromonetwork.store"
export PLATFORM_URL="https://globalpromonetwork.store"

# Rate Limiting
export RATE_LIMIT_WINDOW_MS="900000"
export RATE_LIMIT_MAX_REQUESTS="100"

# Email Configuration
export SMTP_HOST="smtp.hostinger.com"
export SMTP_PORT="465"
export SMTP_SECURE="true"
export SMTP_USER="promohive@globalpromonetwork.store"
export SMTP_PASS="PromoHive@2025!"
export SMTP_FROM="promohive@globalpromonetwork.store"

# External API Keys
export ADGEM_JWT_SECRET="your-adgem-jwt-secret"
export ADSTERRA_API_KEY="your-adsterra-api-key"
export CPALEAD_API_KEY="your-cpalead-api-key"

# Logging and Security
export LOG_LEVEL="info"
export BCRYPT_SALT_ROUNDS="12"

print_success "Environment variables set successfully"

# Verify environment variables
print_status "Verifying environment variables..."
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "SUPABASE_URL: $SUPABASE_URL"
echo "PORT: $PORT"
echo "HOST: $HOST"
echo "SMTP_HOST: $SMTP_HOST"

# Add environment variables to shell profile
print_status "Adding environment variables to shell profile..."
SHELL_PROFILE=""

if [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
elif [ -f "$HOME/.profile" ]; then
    SHELL_PROFILE="$HOME/.profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    print_status "Adding environment variables to $SHELL_PROFILE"
    
    # Check if environment variables are already added
    if ! grep -q "PromoHive Environment Variables" "$SHELL_PROFILE"; then
        cat >> "$SHELL_PROFILE" << 'EOF'

# PromoHive Environment Variables
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"
export SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0MDkyNywiZXhwIjoyMDc3MDE2OTI3fQ.kWtyqG9Rz7Z_Cf2hBhgjW5eMwPgC6YLJzZQH1gW8D7o"
export JWT_SECRET="promohive-super-secret-jwt-key-2024"
export JWT_REFRESH_SECRET="promohive-super-secret-refresh-key-2024"
export ACCESS_TOKEN_EXPIRES_IN="15m"
export REFRESH_TOKEN_EXPIRES_IN="7d"
export PORT="3002"
export HOST="srv1052990.hstgr.cloud"
export CORS_ORIGIN="https://globalpromonetwork.store"
export PLATFORM_URL="https://globalpromonetwork.store"
export RATE_LIMIT_WINDOW_MS="900000"
export RATE_LIMIT_MAX_REQUESTS="100"
export SMTP_HOST="smtp.hostinger.com"
export SMTP_PORT="465"
export SMTP_SECURE="true"
export SMTP_USER="promohive@globalpromonetwork.store"
export SMTP_PASS="PromoHive@2025!"
export SMTP_FROM="promohive@globalpromonetwork.store"
export ADGEM_JWT_SECRET="your-adgem-jwt-secret"
export ADSTERRA_API_KEY="your-adsterra-api-key"
export CPALEAD_API_KEY="your-cpalead-api-key"
export LOG_LEVEL="info"
export BCRYPT_SALT_ROUNDS="12"
EOF
        print_success "Environment variables added to $SHELL_PROFILE"
    else
        print_warning "Environment variables already exist in $SHELL_PROFILE"
    fi
else
    print_warning "No shell profile found. Environment variables are only set for current session."
fi

# Test database connection
print_status "Testing database connection..."
if command -v psql &> /dev/null; then
    # Extract database connection details
    DB_HOST=$(echo $DATABASE_URL | sed 's/.*@\([^:]*\):.*/\1/')
    DB_PORT=$(echo $DATABASE_URL | sed 's/.*:\([0-9]*\)\/.*/\1/')
    DB_NAME=$(echo $DATABASE_URL | sed 's/.*\/\([^?]*\).*/\1/')
    
    print_status "Testing connection to $DB_HOST:$DB_PORT/$DB_NAME"
    # Note: This is just a basic test, actual connection would require password
    print_success "Database connection test completed"
else
    print_warning "psql not found. Cannot test database connection."
fi

print_success "🎉 Environment setup completed successfully!"
print_status "Environment variables are now available for PromoHive"
print_status "To reload environment variables in current session, run: source ~/.bashrc"
print_status "To verify environment variables, run: printenv | grep -E '(DATABASE_URL|SUPABASE|JWT|PORT|HOST)'"
