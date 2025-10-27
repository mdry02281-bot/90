# 🚀 PromoHive Server Update Guide

## ✅ المشاكل التي تم إصلاحها

### 1. إصلاح الثغرات الأمنية
- تم إصلاح 7 ثغرات أمنية متوسطة الخطورة
- تحديث `nodemailer` إلى الإصدار 7.0.10
- تحديث `vite` إلى الإصدار 7.1.12
- تحديث `vitest` إلى الإصدار 4.0.3

### 2. إصلاح مشكلة PM2 Environment
- تم إضافة `env_production` في `ecosystem.config.js`
- تم تصحيح مسار السكريبت من `./server/dist/index.js` إلى `./dist/index.js`
- تم إضافة جميع متغيرات البيئة المطلوبة

### 3. إنشاء سكريبتات النشر والتحديث
- `deploy-update.sh` - سكريبت شامل للتحديث
- `setup-environment.sh` - سكريبت لإعداد متغيرات البيئة

---

## 📋 خطوات التحديث على السيرفر

### الخطوة 1: الاتصال بالسيرفر
```bash
ssh root@srv1052990.hstgr.cloud
```

### الخطوة 2: الانتقال إلى مجلد المشروع
```bash
cd /var/www/promohive
```

### الخطوة 3: سحب التحديثات من Git
```bash
git pull origin main
```

### الخطوة 4: تثبيت/تحديث التبعيات
```bash
npm install
```

### الخطوة 5: إصلاح الثغرات الأمنية
```bash
npm audit fix --force
```

### الخطوة 6: توليد Prisma Client
```bash
npm run prisma:generate
```

### الخطوة 7: تشغيل Migration للقاعدة
```bash
npm run prisma:migrate
```

### الخطوة 8: بناء التطبيق
```bash
npm run build
```

### الخطوة 9: إيقاف PM2
```bash
pm2 stop all
pm2 delete all
```

### الخطوة 10: مسح الكاش واللوجز
```bash
pm2 flush
```

### الخطوة 11: تشغيل PM2 مع البيئة الإنتاجية
```bash
pm2 start ecosystem.config.js --env production
```

### الخطوة 12: حفظ إعدادات PM2
```bash
pm2 save
```

### الخطوة 13: إعداد PM2 للبدء التلقائي
```bash
pm2 startup
```

### الخطوة 14: التحقق من حالة التطبيق
```bash
pm2 status
pm2 logs --lines 10
```

---

## 🔧 إعداد متغيرات البيئة

### الخطوة 1: إنشاء ملف .env
```bash
cp env.production .env
```

### الخطوة 2: تعديل كلمة مرور قاعدة البيانات
```bash
nano .env
```
قم بتغيير `[YOUR-PASSWORD]` بكلمة المرور الفعلية لقاعدة البيانات

### الخطوة 3: إضافة متغيرات البيئة إلى Shell Profile
```bash
echo 'export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"' >> ~/.bashrc
echo 'export SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"' >> ~/.bashrc
echo 'export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"' >> ~/.bashrc
echo 'export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ0MDkyNywiZXhwIjoyMDc3MDE2OTI3fQ.kWtyqG9Rz7Z_Cf2hBhgjW5eMwPgC6YLJzZQH1gW8D7o"' >> ~/.bashrc
echo 'export JWT_SECRET="promohive-super-secret-jwt-key-2024"' >> ~/.bashrc
echo 'export JWT_REFRESH_SECRET="promohive-super-secret-refresh-key-2024"' >> ~/.bashrc
echo 'export PORT="3002"' >> ~/.bashrc
echo 'export HOST="srv1052990.hstgr.cloud"' >> ~/.bashrc
echo 'export CORS_ORIGIN="https://globalpromonetwork.store"' >> ~/.bashrc
echo 'export PLATFORM_URL="https://globalpromonetwork.store"' >> ~/.bashrc
```

### الخطوة 4: إعادة تحميل متغيرات البيئة
```bash
source ~/.bashrc
```

---

## 🚀 استخدام السكريبتات التلقائية

### السكريبت الشامل للتحديث
```bash
# جعل السكريبت قابل للتنفيذ
chmod +x deploy-update.sh

# تشغيل السكريبت
./deploy-update.sh
```

### سكريبت إعداد متغيرات البيئة
```bash
# جعل السكريبت قابل للتنفيذ
chmod +x setup-environment.sh

# تشغيل السكريبت
./setup-environment.sh
```

---

## 🔍 التحقق من التطبيق

### فحص حالة PM2
```bash
pm2 status
```

### فحص اللوجز
```bash
pm2 logs
```

### فحص اللوجز في الوقت الفعلي
```bash
pm2 logs --follow
```

### مراقبة الأداء
```bash
pm2 monit
```

### اختبار التطبيق
```bash
curl http://localhost:3002/api/health
```

---

## 🛠️ استكشاف الأخطاء

### إذا فشل البناء
```bash
# فحص الأخطاء
npm run build 2>&1 | tee build-error.log

# فحص التبعيات
npm ls
```

### إذا فشل PM2
```bash
# فحص اللوجز
pm2 logs --err

# إعادة تشغيل
pm2 restart all
```

### إذا فشل الاتصال بقاعدة البيانات
```bash
# اختبار الاتصال
psql "postgresql://postgres:[YOUR-PASSWORD]@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"

# فحص متغيرات البيئة
printenv | grep DATABASE
```

---

## 📊 مراقبة الأداء

### فحص استخدام الذاكرة
```bash
pm2 status
free -h
```

### فحص استخدام القرص
```bash
df -h
du -sh /var/www/promohive
```

### فحص العمليات
```bash
ps aux | grep node
```

---

## 🔄 التحديثات المستقبلية

### تحديث سريع
```bash
git pull origin main
npm install
npm run build
pm2 restart all
```

### تحديث شامل
```bash
./deploy-update.sh
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من اللوجز: `pm2 logs`
2. تحقق من حالة PM2: `pm2 status`
3. تحقق من متغيرات البيئة: `printenv | grep -E "(DATABASE|SUPABASE|JWT|PORT)"`
4. أعد تشغيل الخدمة: `pm2 restart all`

---

**تم إعداد PromoHive بنجاح! 🎉**
