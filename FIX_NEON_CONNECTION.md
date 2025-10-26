# إصلاح اتصال قاعدة بيانات Neon

## المشكلة
السيرفر لا يستطيع الوصول إلى قاعدة بيانات Neon

## الحلول

### الحل 1: Allow All IPs في Neon (الأسهل)
1. اذهب إلى: https://console.neon.tech
2. اختر مشروعك: `ep-bold-art-ah3oamf8`
3. Settings → Security → IP Restrictions
4. اضغط "Allow All IPs"
5. احفظ

### الحل 2: إضافة IP السيرفر
1. اذهب إلى Neon Dashboard
2. Settings → Security
3. أضف IP السيرفر (ابحث عنه بـ `curl ifconfig.me`)
4. احفظ

### الحل 3: استخدام connection string صحيح

```bash
# على السيرفر
cd /root/55
nano .env
```

```
DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### الحل 4: اختبار الاتصال

```bash
# على السيرفر
psql "postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT 1;"
```

إذا نجح:
```bash
# طبق Prisma
npx prisma db push
npm run build
pm2 restart promohive
```

## التحقق من النجاح

```bash
pm2 logs promohive | grep -i "database\|connected"
```

يجب أن ترى:
```
info: 📊 Database: Connected
```

