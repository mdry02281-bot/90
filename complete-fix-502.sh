#!/bin/bash

echo "=== PromoHive 502 Error Complete Fix ==="
echo "Date: $(date)"
echo "Server: srv1052990.hstgr.cloud"
echo

# Check if we're on the server
if [[ $(hostname) == "srv1052990" ]]; then
    echo "✓ Running on production server"
else
    echo "⚠ Not on production server"
    echo "To fix the 502 error, run these commands on your server:"
    echo "ssh root@srv1052990"
    echo "cd /var/www/promohive"
    echo "bash complete-fix-502.sh"
    exit 1
fi

cd /var/www/promohive

echo
echo "=== Step 1: Stopping All Services ==="
pm2 stop promohive
pm2 delete promohive

echo
echo "=== Step 2: Updating Environment Configuration ==="
cat > .env << 'ENVEOF'
# PromoHive Production Environment
NODE_ENV=production
PORT=3002
HOST=0.0.0.0

# Database (Supabase) - Using Pooler Connection
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0MDkyNywiZXhwIjoyMDc3MDE2OTI3fQ.kWtyqG9Rz7Z_Cf2hBhgjW5eMwPgC6YLJzZQH1gW8D7o"

# JWT Secrets
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server Configuration
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Email Configuration (Hostinger)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="PromoHive@2025!"
SMTP_FROM="promohive@globalpromonetwork.store"

# External API Keys
ADGEM_JWT_SECRET="your-adgem-jwt-secret"
ADSTERRA_API_KEY="your-adsterra-api-key"
CPALEAD_API_KEY="your-cpalead-api-key"

# Logging and Security
LOG_LEVEL="info"
BCRYPT_SALT_ROUNDS="12"
ENVEOF

echo "✓ Environment file updated"

echo
echo "=== Step 3: Clearing Caches ==="
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build
npm cache clean --force

echo
echo "=== Step 4: Installing Dependencies ==="
npm install --production

echo
echo "=== Step 5: Building Application ==="
npm run build

echo
echo "=== Step 6: Testing Database Connection ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    console.log('✓ Database connection successful');
    return prisma.user.count();
  })
  .then(count => {
    console.log('✓ Users table accessible, count:', count);
    prisma.\$disconnect();
  })
  .catch(err => {
    console.log('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

echo
echo "=== Step 7: Starting PM2 Process ==="
pm2 start ecosystem.config.js --env production

echo
echo "=== Step 8: Restarting Nginx ==="
systemctl restart nginx

echo
echo "=== Step 9: Waiting for Services to Start ==="
sleep 10

echo
echo "=== Step 10: Checking Status ==="
echo "PM2 Status:"
pm2 status

echo
echo "Port Status:"
netstat -tlnp | grep :3002 || echo "❌ Port 3002 not listening"

echo
echo "Testing API:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3002/api/auth/me

echo
echo "=== Step 11: Checking Logs ==="
echo "Recent PM2 logs:"
pm2 logs promohive --lines 10 --nostream

echo
echo "Recent Nginx logs:"
tail -5 /var/log/nginx/error.log

echo
echo "=== Fix Complete ==="
echo "If you still see 502 errors:"
echo "1. Check logs: pm2 logs promohive --lines 50"
echo "2. Check nginx logs: tail -f /var/log/nginx/error.log"
echo "3. Verify the application is accessible at: https://globalpromonetwork.store"
echo
echo "Test the admin panel: https://globalpromonetwork.store/admin"
