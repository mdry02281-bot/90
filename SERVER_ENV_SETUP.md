# إعداد ملف .env على السيرفر

## الخطوات:

### 1. احصل على Connection String من Supabase

اذهب إلى:
```
https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab/settings/database
```

انسخ **Connection string** (Session mode)

### 2. على السيرفر:

```bash
cd /root/55
nano .env
```

### 3. ضع هذا المحتوى:

```
# Supabase Database
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require"

# أو بدون SSL إذا فشل
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:[PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"

# JWT
JWT_SECRET="promohive-super-secret-key-2024"
JWT_REFRESH_SECRET="promohive-refresh-secret-2024"

# Server
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
```

### 4. تطبيق التغييرات:

```bash
npx prisma generate
npx prisma db pull
npm run build
pm2 restart promohive
pm2 logs promohive
```

### 5. التحقق:

افتح في المتصفح:
```
https://globalpromonetwork.store/admin
```

يجب أن ترى:
- ✅ بيانات حقيقية من Supabase
- ✅ Recent Activity (3 actions موجودة)
- ✅ Admin actions في Overview

