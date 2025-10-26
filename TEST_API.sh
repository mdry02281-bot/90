#!/bin/bash

echo "🧪 Testing API endpoints..."

echo ""
echo "1️⃣ Health check:"
curl http://localhost:3002/health
echo ""

echo ""
echo "2️⃣ Getting admin token..."
TOKEN=$(curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@promohive.com","password":"admin123!"}' \
  2>/dev/null | jq -r '.accessToken')

echo "Token: ${TOKEN:0:50}..."

echo ""
echo "3️⃣ Testing analytics endpoint:"
curl http://localhost:3002/api/admin/analytics/summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" 2>/dev/null | jq

echo ""
echo "✅ Done!"
