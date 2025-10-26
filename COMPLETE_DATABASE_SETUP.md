# دليل إعداد قاعدة البيانات الكامل - Complete Database Setup Guide

## 📋 المشكلة
الواجهة الأمامية تظهر بيانات وهمية لأن النظام غير مربوط بقاعدة البيانات الحقيقية.

## 🔧 الحل الشامل

### 1. إعداد DATABASE_URL في السيرفر

```bash
# على السيرفر
cd /root/55

# أنشئ ملف .env
nano .env
```

أضف هذا المحتوى:

```env
DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
```

### 2. تطبيق SQL السكريبت على قاعدة البيانات

#### الطريقة 1: من Neon Dashboard
1. اذهب إلى https://console.neon.tech
2. افتح SQL Editor
3. انسخ محتوى ملف `DATABASE_COMPLETE_SETUP.sql`
4. الصقه في SQL Editor
5. اضغط Run

#### الطريقة 2: من Command Line
```bash
# من جهازك المحلي
psql "postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -f DATABASE_COMPLETE_SETUP.sql
```

#### الطريقة 3: من VS Code
1. ثبت PostgreSQL extension في VS Code
2. اضغط F1 → PostgreSQL: New Query
3. اتصل بقاعدة البيانات
4. الصق المحتوى من `DATABASE_COMPLETE_SETUP.sql`
5. اضغط Run

### 3. تطبيق Prisma على السيرفر

```bash
# على السيرفر
cd /root/55

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# أو استخدم migrate
npx prisma migrate deploy
```

### 4. تطبيق Seed (البيانات التجريبية)

```bash
# على السيرفر
npx prisma db seed
```

### 5. إعادة بناء وتشغيل التطبيق

```bash
# على السيرفر
npm run build
pm2 restart promohive
pm2 logs promohive
```

## ✅ التحقق من النجاح

### 1. تحقق من الاتصال
```bash
# على السيرفر
cd /root/55
npx prisma studio
```

أو

```bash
npx prisma db execute --stdin < DATABASE_COMPLETE_SETUP.sql
```

### 2. تحقق من البيانات
افتح لوحة الأدمن في المتصفح:
```
https://globalpromonetwork.store/admin
```

يجب أن ترى:
- ✅ قسم Debug يعرض بيانات حقيقية
- ✅ عدد المستخدمين الحقيقي
- ✅ Recent Activity (إن وجدت)
- ✅ أزرار Approve/Reject تظهر

### 3. إنشاء مستخدم test
من لوحة الأدمن:
1. اضغط زر "Create Test User"
2. تحقق من ظهوره في القائمة
3. اضغط "Approve" عليه
4. تأكد من نجاح العملية

## 🎯 ملخص الخطوات

1. ✅ أنشئ ملف `.env` على السيرفر مع DATABASE_URL
2. ✅ طبّق `DATABASE_COMPLETE_SETUP.sql` على قاعدة البيانات
3. ✅ شغّل `npx prisma generate` على السيرفر
4. ✅ شغّل `npx prisma db push` على السيرفر
5. ✅ شغّل `npm run build` على السيرفر
6. ✅ أعِد تشغيل التطبيق: `pm2 restart promohive`
7. ✅ اختبر الموقع في المتصفح

## 📊 ما يفعله SQL السكريبت

1. **ينشئ جميع الأنواع (Enums)** - UserRole, TaskStatus, إلخ
2. **ينشئ جميع الجداول** - User, Wallet, Transaction, إلخ
3. **ينشئ جميع الفهارس** - لتحسين الأداء
4. **ينشئ Triggers** - لتحديث `updatedAt` تلقائياً
5. **يضيف بيانات تجريبية** - Super Admin و wallet
6. **يضيف RLS Policies** - لأمان البيانات
7. **يضيف AdminAction** - لـ Recent Activity

## 🔍 التحقق من الأخطاء

إذا فشل أي شيء:

```bash
# على السيرفر - تحقق من اتصال Prisma
cd /root/55
npx prisma db pull

# تحقق من الـ schema
npx prisma validate

# عرض البيانات
npx prisma studio
```

## 📞 دعم إضافي

إذا واجهت أي مشكلة:
1. افتح Console في المتصفح (F12)
2. افحص رسائل الخطأ
3. افحص Nginx error logs: `tail -f /var/log/nginx/error.log`
4. افحص PM2 logs: `pm2 logs promohive`

