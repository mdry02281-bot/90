#!/bin/bash

# PromoHive Deployment Script for Hostinger VPS
# This script automates the deployment process

set -e

echo "🚀 Starting PromoHive deployment..."

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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
print_status "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Install Certbot for SSL
print_status "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Install PostgreSQL
print_status "Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Create database and user
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql << EOF
CREATE DATABASE promohive;
CREATE USER promohive_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
\q
EOF

# Install project dependencies
print_status "Installing project dependencies..."
npm install

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate deploy

# Seed the database
print_status "Seeding database..."
npm run prisma:seed

# Build the application
print_status "Building application..."
npm run build

# Create PM2 ecosystem file
print_status "Setting up PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'promohive',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/promohive << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect all HTTP requests to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Serve static files
    location / {
        root /home/$(whoami)/promohive/dist/client;
        try_files $uri $uri/ /index.html;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3002;
        access_log off;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup SSL with Let's Encrypt
print_warning "Please update your domain name in the Nginx configuration before proceeding with SSL setup"
print_warning "Run the following command to setup SSL:"
print_warning "sudo certbot --nginx -d your-domain.com -d www.your-domain.com"

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create systemd service for PM2
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/promohive.service << 'EOF'
[Unit]
Description=PromoHive Application
After=network.target

[Service]
Type=forking
User=$(whoami)
WorkingDirectory=/home/$(whoami)/promohive
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable promohive

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/promohive << 'EOF'
/home/$(whoami)/promohive/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $(whoami) $(whoami)
    postrotate
        /usr/bin/pm2 reloadLogs
    endscript
}
EOF

print_status "✅ Deployment completed successfully!"
print_status "Your PromoHive application is now running on your VPS"
print_status "Don't forget to:"
print_warning "1. Update your domain name in /etc/nginx/sites-available/promohive"
print_warning "2. Setup SSL certificates with: sudo certbot --nginx -d your-domain.com"
print_warning "3. Update your .env file with production values"
print_warning "4. Configure your DNS to point to this server"

echo ""
print_status "Useful commands:"
echo "  pm2 status                    # Check application status"
echo "  pm2 logs                      # View application logs"
echo "  pm2 restart promohive         # Restart application"
echo "  sudo systemctl status nginx   # Check Nginx status"
echo "  sudo nginx -t                 # Test Nginx configuration"
