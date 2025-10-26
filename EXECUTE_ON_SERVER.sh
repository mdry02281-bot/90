#!/bin/bash

cd /root/55

# استخدم Direct Connection بدلاً من Pooler
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@db.jxtutquvxmkrajfvdbab.supabase.co:6543/postgres"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
ENVEOF

echo "✅ Updated .env"
echo ""
echo "Building..."
npm run build

echo ""
echo "Restarting PM2..."
pm2 restart promohive

echo ""
echo "Checking logs..."
pm2 logs promohive --lines 20 | grep -i "database\|error\|tenant"

echo ""
echo "✅ Done! Check: https://globalpromonetwork.store/admin"

