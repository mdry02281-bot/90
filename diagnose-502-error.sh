#!/bin/bash

echo "=== PromoHive 502 Error Diagnosis ==="
echo "Date: $(date)"
echo

# Check if we're on the server
if [[ $(hostname) == "srv1052990" ]]; then
    echo "✓ Running on production server"
else
    echo "⚠ Not on production server - connecting via SSH"
    echo "Run this script on the server: ssh root@srv1052990"
    exit 1
fi

echo
echo "=== 1. Checking PM2 Process Status ==="
pm2 status

echo
echo "=== 2. Checking if Port 3002 is Listening ==="
netstat -tlnp | grep :3002 || echo "❌ Port 3002 not listening"

echo
echo "=== 3. Checking Nginx Status ==="
systemctl status nginx --no-pager -l

echo
echo "=== 4. Checking Nginx Error Logs ==="
tail -20 /var/log/nginx/error.log

echo
echo "=== 5. Checking Application Logs ==="
pm2 logs promohive --lines 20 --nostream

echo
echo "=== 6. Testing Local API Connection ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3002/api/auth/me || echo "❌ Local API not responding"

echo
echo "=== 7. Checking Environment Variables ==="
cd /var/www/promohive
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."

echo
echo "=== 8. Checking Database Connection ==="
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
echo "=== 9. Checking Disk Space ==="
df -h /var/www/promohive

echo
echo "=== 10. Checking Memory Usage ==="
free -h

echo
echo "=== Diagnosis Complete ==="
echo "If you see any ❌ errors above, those need to be fixed."
echo "Common fixes:"
echo "- Restart PM2: pm2 restart promohive"
echo "- Restart Nginx: systemctl restart nginx"
echo "- Check environment variables in /var/www/promohive/.env"
echo "- Check database connection string"
