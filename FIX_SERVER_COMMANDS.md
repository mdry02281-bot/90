# 🔧 إصلاح قاعدة البيانات على السيرفر

## الأوامر المطلوبة (انسخ والصق):

```bash
cd /root/55

# رفع التحديثات
git pull origin main

# إعطاء صلاحيات للمستخدم
sudo -u postgres psql -c "ALTER USER promohive_user WITH PASSWORD 'promohive_pass123';"
sudo -u postgres psql -d promohive -c "GRANT ALL ON SCHEMA public TO promohive_user;"
sudo -u postgres psql -d promohive -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO promohive_user;"
sudo -u postgres psql -d promohive -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO promohive_user;"

# حذف وإعادة إنشاء قاعدة البيانات
sudo -u postgres psql -c "DROP DATABASE IF EXISTS promohive;"
sudo -u postgres psql -c "CREATE DATABASE promohive OWNER promohive_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;"

# نسخ ملف البيئة
cp env.production.local .env

# تحديث Prisma
npm run prisma:generate

# تشغيل الـ migrations
npm run prisma:migrate

# زرع البيانات
npm run prisma:seed

# إعادة البناء
npm run build

# إعادة تشغيل PM2
pm2 restart promohive

# اختبار
sleep 3
curl https://globalpromonetwork.store/health
```
