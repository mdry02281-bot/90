#!/bin/bash

cd /root/55

cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres?pgbouncer=true"
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

echo "Testing database connection..."
npx prisma db pull --schema prisma/schema.prisma || echo "⚠️ Connection test failed but continuing..."

echo ""
echo "Building..."
npm run build

echo ""
echo "Restarting PM2..."
pm2 restart promohive

echo ""
echo "Checking status..."
sleep 2
pm2 logs promohive --lines 15 | grep -E "Database|Connected|FATAL|error" || pm2 logs promohive --lines 10

echo ""
echo "✅ Done! Check: https://globalpromonetwork.store/admin"

