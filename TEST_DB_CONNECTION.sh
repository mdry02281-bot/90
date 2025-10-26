#!/bin/bash

# اختبار الاتصال بقاعدة البيانات
cd /root/55

echo "Testing database connection..."
echo ""

# عرض DATABASE_URL الحالي (مخفية)
cat .env | grep DATABASE_URL | sed 's/DATABASE_URL="postgresql:\/\/postgres.jxtutquvxmkrajfvdbab:[^@]*@/DATABASE_URL="postgresql:\/\/postgres.jxtutquvxmkrajfvdbab:***@/'

echo ""
echo "To get the correct password:"
echo "1. Go to: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab"
echo "2. Settings → Database"
echo "3. Database password → Reset"
echo "4. Copy the new password"
echo "5. Update .env file with the correct password"
echo ""

# محاولة الاتصال بقاعدة البيانات
echo "Trying to connect to database..."
npx prisma db pull --schema prisma/schema.prisma || echo "❌ Connection failed - password is incorrect"

