#!/bin/bash

# PromoHive 502 Error - Immediate Fix
# Run this on your server: ssh root@srv1052990

echo "🔧 Fixing PromoHive 502 Error..."

cd /var/www/promohive

# Stop and restart PM2
pm2 stop promohive
pm2 delete promohive

# Update environment with correct database URL
cat > .env << 'EOF'
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0MDkyNywiZXhwIjoyMDc3MDE2OTI3fQ.kWtyqG9Rz7Z_Cf2hBhgjW5eMwPgC6YLJzZQH1gW8D7o"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
CORS_ORIGIN="https://globalpromonetwork.store"
PLATFORM_URL="https://globalpromonetwork.store"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="PromoHive@2025!"
SMTP_FROM="promohive@globalpromonetwork.store"
ADGEM_JWT_SECRET="your-adgem-jwt-secret"
ADSTERRA_API_KEY="your-adsterra-api-key"
CPALEAD_API_KEY="your-cpalead-api-key"
LOG_LEVEL="info"
BCRYPT_SALT_ROUNDS="12"
EOF

# Rebuild and restart
npm run build
pm2 start ecosystem.config.js --env production
systemctl restart nginx

# Wait and test
sleep 5
echo "✅ Testing API..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3002/api/auth/me

echo "🎉 Fix complete! Check: https://globalpromonetwork.store"
