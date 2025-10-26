# 🚀 تطبيق قاعدة البيانات المحلية - PromoHive

## ⚠️ مهم جداً!

هذا سينقل قاعدة البيانات من **Supabase** إلى **PostgreSQL محلية** على السيرفر.

## 📋 الخطوات المطلوبة

### 1. تسجيل الدخول للسيرفر
```bash
ssh root@srv1052990.hstgr.cloud
```

### 2. الانتقال للمشروع
```bash
cd /root/55
```

### 3. رفع التحديثات
```bash
git pull origin main
```

### 4. إعادة تعيين كلمة مرور قاعدة البيانات
```bash
# تغيير كلمة المرور المستخدم PostgreSQL
sudo -u postgres psql -c "ALTER USER promohive_user WITH PASSWORD 'promohive_pass123';"
```

### 5. نسخ ملف البيئة المحلية
```bash
cp env.production.local .env
cat .env | grep DATABASE_URL
```

### 6. إنشاء الجداول الجديدة
```bash
npm run prisma:generate
```

### 7. تشغيل الـ Migrations
```bash
npm run prisma:migrate
```

### 8. Seed البيانات (الجوائز + عجلة الحظ)
```bash
npm run prisma:seed
```

### 9. إعادة بناء التطبيق
```bash
npm run build
```

### 10. إعادة تشغيل PM2
```bash
pm2 restart promohive
```

### 11. اختبار
```bash
curl https://globalpromonetwork.store/health
```

---

## 🔍 مراقبة السجلات

```bash
# رصد في الوقت الفعلي
pm2 logs promohive --lines 50

# التحقق من حالة PM2
pm2 status

# رصد استخدام الموارد
pm2 monit
```

---

## ⚡ التأكد من أن كل شيء يعمل

```bash
# 1. Health check
curl https://globalpromonetwork.store/health

# 2. رؤية الرسائل
pm2 logs promohive --lines 20

# 3. تأكد من عدم وجود أخطاء
grep -i error /root/.pm2/logs/promohive-error.log | tail -20
```

---

## 🔄 إذا حدثت مشكلة

### استعادة قاعدة البيانات من Supabase
```bash
# نسخ ملف البيئة القديم
cp env.production .env

# إعادة البناء
npm run build
pm2 restart promohive
```

### مراجعة السجلات للتعرف على الخطأ
```bash
pm2 logs promohive --lines 100
```

---

## 📊 البيانات التي سيتم إضافتها

بعد تشغيل `npm run prisma:seed` سيتم:

1. ✅ **Super Admin** (إذا لم يكن موجوداً)
   - Email: admin@promohive.com
   - Password: admin123!

2. ✅ **7 مهام عينة**
   - Instagram Follow
   - Telegram Join
   - App Download
   - Social Media Share
   - Survey
   - 2x AdGem Offers

3. ✅ **4 عروض**
   - من AdGem, Adsterra, CPAlead

4. ✅ **إعدادات افتراضية**
   - Welcome Bonus: $5.00
   - Min Withdrawal: $10.00
   - Exchange Rate: 1.00
   - Referral Bonuses

5. ✅ **عجلة الحظ - 6 جوائز:**
   - 🎁 Small Bonus (0.10 coins) - 25%
   - 🎁 Medium Bonus (0.25 coins) - 15%
   - 🎁 Large Bonus (0.50 coins) - 10%
   - 🌟 Extra Spin - 10%
   - 💎 Mega Bonus (1.00 coin) - 5%
   - 😔 Try Again - 35%

---

## 🎯 النتيجة النهائية

- ✅ قاعدة بيانات محلية آمنة
- ✅ محافظ خاصة لكل عميل
- ✅ مهام يدوية مع موافقة الادمن
- ✅ مهام تلقائية (AdGem, Adsterra, CPAlead)
- ✅ عجلة حظ (3 دورات يومية)
- ✅ نظام إحالة تلقائي (3 مستويات)
- ✅ سحوبات مع موافقة الادمن
- ✅ أمان عالي (bcrypt, JWT, SSL, Helmet)

---

**آخر تحديث:** 2025-01-26
