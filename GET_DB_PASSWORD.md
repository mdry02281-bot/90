# الحصول على Database Password

## المشكلة:
```
FATAL: Tenant or user not found
```

## السبب:
DATABASE_URL يحتاج إلى **Database Password الصحيح** (ليس Service Role Key).

---

## الحل: احصل على Database Password

### الطريقة 1: من Supabase Dashboard

1. اذهب إلى: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
2. **Settings → Database**
3. تحت **Connection string**
4. اختر **Transaction mode** (ليس Session)
5. انسخ **Database URL** الكامل

مثلاً:
```
postgresql://postgres.jxtutquvxmkrajfvdbab:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

---

### الطريقة 2: Reset Database Password

1. https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
2. **Settings → Database**
3. ابحث عن **Database password**
4. **Reset database password**
5. انسخ الـ password الجديد
6. ضعه في connection string

---

## الخطوات على السيرفر:

بعد الحصول على password:

```bash
cd /root/55

# ضع password الصحيح هنا:
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
ENVEOF

npm run build
pm2 restart promohive
pm2 logs promohive | grep "Database"
```

---

## ملاحظة:
- Service Role Key = للتحكم في Supabase APIs
- Database Password = للاتصال بقاعدة البيانات PostgreSQL

**أحتاج Database Password!**

