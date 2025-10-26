#!/bin/bash

# Test Neon connection directly from server

echo "Testing Neon database connection..."

# Test 1: Basic connection
echo "Test 1: Basic connection..."
npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | grep -i "error\|success\|connected" || echo "No output"

# Test 2: Check Prisma connection
echo "Test 2: Checking Prisma..."
npx prisma db pull --print 2>&1 | head -5

# Test 3: Try without SSL
echo "Test 3: Trying without SSL..."
export DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb"
npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | grep -i "error\|success" || echo "Test completed"

# Test 4: Network connectivity
echo "Test 4: Testing network..."
nc -zv ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech 5432 2>&1 || telnet ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech 5432 2>&1 | head -3

