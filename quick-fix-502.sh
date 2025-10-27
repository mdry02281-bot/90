#!/bin/bash

echo "=== PromoHive 502 Error Quick Fix ==="
echo "Date: $(date)"
echo

# Check if we're on the server
if [[ $(hostname) == "srv1052990" ]]; then
    echo "✓ Running on production server"
else
    echo "⚠ Not on production server"
    echo "To fix the 502 error, run these commands on your server:"
    echo "ssh root@srv1052990"
    echo "cd /var/www/promohive"
    echo "bash quick-fix-502.sh"
    exit 1
fi

cd /var/www/promohive

echo
echo "=== Step 1: Stopping PM2 Process ==="
pm2 stop promohive

echo
echo "=== Step 2: Checking Environment ==="
if [ ! -f .env ]; then
    echo "❌ .env file not found, copying from env.production"
    cp env.production .env
fi

echo
echo "=== Step 3: Installing Dependencies ==="
npm install --production

echo
echo "=== Step 4: Building Application ==="
npm run build

echo
echo "=== Step 5: Starting PM2 Process ==="
pm2 start ecosystem.config.js --env production

echo
echo "=== Step 6: Restarting Nginx ==="
systemctl restart nginx

echo
echo "=== Step 7: Checking Status ==="
sleep 5
pm2 status
echo
echo "Testing API..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3002/api/auth/me

echo
echo "=== Quick Fix Complete ==="
echo "Check the status above. If still getting 502:"
echo "1. Check logs: pm2 logs promohive"
echo "2. Check nginx logs: tail -f /var/log/nginx/error.log"
echo "3. Verify database connection"
