# 🚀 PromoHive Production Deployment Guide

## 📋 الخطوات التالية على السيرفر srv1052990.hstgr.cloud

### 1️⃣ أولاً: Clone وبناء المشروع

```bash
cd /root
git clone https://github.com/nyttynt96-art/55.git
cd 55

# تثبيت المتطلبات
npm install

# نسخ ملف الإنتاج
cp env.production .env

# تحرير .env وإدخال كلمة مرور البريد الصحيحة
nano .env
# احفظ الملف بالضغط Ctrl+O ثم Enter ثم Ctrl+X
```

### 2️⃣ تجهيز قاعدة البيانات

```bash
# إنشاء مجلد migrations
mkdir -p prisma/migrations

# Baseline for existing database
npx prisma migrate resolve --applied baseline || true

# إنشاء migration جديد
npx prisma migrate dev --name init --create-only
npx prisma migrate resolve --applied init

# تشغيل migrations
npm run prisma:migrate

# Seed قاعدة البيانات
npm run prisma:seed
```

**ملاحظة:** إذا ظهرت رسالة "schema is not empty"، استخدم:

```bash
npx prisma migrate resolve --applied init
npm run prisma:migrate
```

### 3️⃣ بناء المشروع

```bash
npm run build
```

### 4️⃣ تشغيل المشروع باستخدام PM2

```bash
# تثبيت PM2 إذا لم يكن مثبتاً
npm install -g pm2

# تشغيل المشروع
pm2 start npm --name "promohive" -- start

# أو استخدام script المخصص
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

### 5️⃣ إعدادات PM2

```bash
# عرض حالة المشاريع
pm2 list

# عرض السجلات
pm2 logs promohive

# إيقاف المشروع
pm2 stop promohive

# إعادة التشغيل
pm2 restart promohive

# إضافة PM2 للـ startup
pm2 startup
pm2 save
```

### 6️⃣ ربط المشروع بـ Nginx (إختياري)

إنشاء ملف تكوين Nginx:

```bash
sudo nano /etc/nginx/sites-available/promohive
```

أضف هذا المحتوى:

```nginx
server {
    listen 80;
    server_name globalpromonetwork.store www.globalpromonetwork.store;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

تفعيل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 بيانات الدخول الافتراضية

```
Email: admin@promohive.com
Password: admin123!
Role: SUPER_ADMIN
```

## 📊 مراقبة المشروع

```bash
# عرض حالة PM2
pm2 status

# عرض السجلات الحالية
pm2 logs promohive

# عرض معلومات مفصلة
pm2 show promohive

# إحصائيات الأداء
pm2 monit
```

## 🔄 التحديثات اللاحقة

عند الرغبة في تحديث المشروع:

```bash
cd /root/55
git pull origin main
npm install
npm run build
pm2 restart promohive
```

أو استخدام الـ script المخصص:

```bash
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

## 🛠️ استكشاف الأخطاء

### إذا لم يبدأ المشروع:

```bash
# عرض السجلات
pm2 logs promohive

# التحقق من المنافذ
netstat -tulpn | grep 3002

# إعادة تشغيل PM2
pm2 restart all
```

### إذا واجهت مشكلة في قاعدة البيانات:

```bash
# إعادة توليد Prisma Client
npm run prisma:generate

# عرض حالة الـ migrations
npx prisma migrate status
```

### إذا واجهت مشكلة في البناء:

```bash
# تنظيف ملفات البناء القديمة
rm -rf dist node_modules/.cache

# إعادة البناء
npm run build
```

## 📝 ملاحظات مهمة

1. **الـ .env**: تأكد من تحديث جميع المتغيرات في ملف `.env` خاصة:
   - `SMTP_PASS`: كلمة مرور البريد الإلكتروني
   - `JWT_SECRET` و `JWT_REFRESH_SECRET`: مفاتيح أمان قوية

2. **الأمان**: استخدم HTTPS في الإنتاج وليس HTTP

3. **النسخ الاحتياطي**: قم بعمل نسخ احتياطي لقاعدة البيانات بشكل دوري

4. **المراقبة**: راقب سجلات المشروع بانتظام

## ✅ التحقق من حالة المشروع

```bash
# التحقق من حالة PM2
pm2 status

# التحقق من المنفذ
curl http://localhost:3002/health

# عرض السجلات الأخيرة
pm2 logs promohive --lines 50
```

## 🎯 النتيجة المتوقعة

بعد اتمام جميع الخطوات بنجاح، يجب أن ترى:

```
✓ PM2 process running
✓ Server listening on port 3002
✓ Database connected
✓ Admin user created
```

---

**PromoHive** - Global Promo Network 🚀

