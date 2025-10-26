# 🚀 التثبيت النهائي - PromoHive

## ⚠️ مهم جداً!

هذا السكربت سيقوم بـ:
1. حذف قاعدة البيانات القديمة
2. إنشاء قاعدة بيانات جديدة
3. إنشاء جميع الجداول (Users, Wallets, Tasks, Withdrawals, Spins...)
4. زرع البيانات الأساسية (Super Admin + 6 مهام + Spin prizes)

---

## 📋 الأوامر (انسخ والصق على السيرفر):

```bash
cd /root/55

# رفع التحديثات
git pull origin main

# جعل السكربت قابلاً للتنفيذ
chmod +x apply-on-server.sh

# تنفيذ السكربت
./apply-on-server.sh
```

---

## 🎯 ما سيحدث:

1. ✅ حذف قاعدة البيانات القديمة
2. ✅ إنشاء قاعدة بيانات جديدة فارغة
3. ✅ إنشاء الجداول التالية:
   - User (المستخدمون)
   - Wallet (المحافظ)
   - Task (المهام)
   - UserTask (مهام المستخدمين)
   - Proof (إثباتات المهام)
   - Withdrawal (السحوبات)
   - Referral (الإحالات)
   - Transaction (المعاملات)
   - SpinPrize (جوائز عجلة الحظ)
   - Spin (سجلات الدورات)
   - DailySpinLimit (حدود الدورات اليومية)
   - + 3 جداول أخرى

4. ✅ زرع البيانات الأساسية:
   - Super Admin: admin@promohive.com / admin123!
   - 6 مهام عينة
   - 6 جوائز لعجلة الحظ

5. ✅ إعادة بناء التطبيق
6. ✅ إعادة تشغيل PM2

---

## ✅ بعد التنفيذ:

### **التسجيل كـ Admin:**
- Email: `admin@promohive.com`
- Password: `admin123!`

### **للتحقق من قاعدة البيانات:**
```bash
# عدد المستخدمين
sudo -u postgres psql -d promohive -c "SELECT COUNT(*) FROM \"User\";"

# عدد المهام
sudo -u postgres psql -d promohive -c "SELECT COUNT(*) FROM \"Task\";"

# المحافظ
sudo -u postgres psql -d promohive -c "SELECT u.username, w.balance, w.\"totalEarned\" FROM \"User\" u JOIN \"Wallet\" w ON u.id = w.\"userId\";"

# الجوائز
sudo -u postgres psql -d promohive -c "SELECT name, probability FROM \"SpinPrize\";"
```

### **اختبار الـ API:**
```bash
curl https://globalpromonetwork.store/api/admin/analytics/summary
```

---

## 📊 البيانات المتوقعة:

- **Total Users:** 1 (فقط admin)
- **Active Tasks:** 6 (المهام المزروعة)
- **Pending Withdrawals:** 0
- **Total Revenue:** $1,000 (من محفظة admin)

---

## 🔧 إذا حدثت مشكلة:

### **1. حذف الـ migration folder:**
```bash
rm -rf prisma/migrations
```

### **2. إعادة السكربت:**
```bash
./apply-on-server.sh
```

### **3. رؤية السجلات:**
```bash
pm2 logs promohive --lines 50
```

---

**✅ بعد التنفيذ، سيعمل النظام بالكامل مع بيانات حقيقية!**
