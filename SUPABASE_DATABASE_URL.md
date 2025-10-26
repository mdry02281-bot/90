# استخدام Supabase على السيرفر

## Connection String الصحيح:

```
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:[YOUR-DB-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## لإيجاد Password:

1. اذهب إلى: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab/settings/database
2. Database password → Reset password إذا لزم
3. ابحث عن "Connection string" مع password visible

## أو استخدم الميثود المباشرة:

اذهب إلى:
https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab

Settings → Database → Connection String (URI)
انسخ **Session Mode** connection string كاملاً

## تطبيق على السيرفر:

```bash
cd /root/55

# ضع connection string من Supabase
nano .env

# ضع هذا (باستبدال [PASSWORD]):
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:[PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"
JWT_SECRET="key-2024"
NODE_ENV=production
PORT=3002

# طبّق
npx prisma generate
npx prisma db pull
npm run build
pm2 restart promohive
```

