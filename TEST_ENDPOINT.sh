#!/bin/bash

# على السيرفر نفذ:

cd /root/55

# اطبع المحتوى الكامل للـ response من dashboard endpoint
echo "=== Testing /api/admin/dashboard endpoint ==="
curl -s -X GET "http://localhost:3002/api/admin/dashboard" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=test" \
  | jq '.'
  
echo ""
echo "=== Last 20 lines of PM2 logs ==="
pm2 logs promohive --lines 20 --nostream

echo ""
echo "=== Direct Prisma test ==="
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.count().then(c => console.log('✅ Total users:', c)).then(() => prisma.user.findMany({ where: { isApproved: false }, take: 5 })).then(users => { console.log('✅ Pending users:'); users.forEach(u => console.log('  -', u.email, '| Approved:', u.isApproved)); }).catch(e => console.error('❌ Error:', e.message));"
