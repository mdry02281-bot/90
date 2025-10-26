# إصلاح Connection String

## المشكلة:
```
FATAL: Tenant or user not found
```

## السبب:
`aws-0-us-west-1.pooler.supabase.com` غير صحيح أو password غير صحيح.

---

## الحل 1: استخدم Direct Connection

```bash
cd /root/55

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

npm run build
pm2 restart promohive
pm2 logs promohive | grep "Database"
```

**الفرق:** `db.jxtutquvxmkrajfvdbab.supabase.co:6543` بدلاً من `aws-0-us-west-1.pooler.supabase.com:5432`

---

## الحل 2: احصل على Password الصحيح

1. اذهب إلى: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
2. Settings → Database
3. Connection string → **Direct connection**
4. انسخ الـ connection string **كامل**

---

## الحل 3: استخدم .env من النسخة المحلية

انسخ `.env` من جهازك إلى السيرفر.

---

**أنفذ الحل 1 أولاً!**

