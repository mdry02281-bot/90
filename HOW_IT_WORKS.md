# ✅ كيف يعمل PromoHive

## 1️⃣ **المحافظ (Wallets) - تعمل تلقائياً** 💰

### **عند التسجيل:**
```typescript
// في src/routes/auth.ts (سطر 64-87)
const user = await prisma.user.create({
  data: {
    username: data.username,
    email: data.email,
    password: passwordHash,
    fullName: data.fullName,
    // ... بيانات أخرى
  },
});

// ✅ يتم إنشاء محفظة تلقائياً لكل مستخدم
await prisma.wallet.create({
  data: {
    userId: user.id,
    balance: 0,           // الرصيد الحالي
    pendingBalance: 0,   // الأموال قيد الانتظار
    totalEarned: 0,      // إجمالي الأرباح
    totalWithdrawn: 0,   // إجمالي المسحوبات
  },
});
```

### **كل مستخدم له:**
- ✅ **محفظة خاصة** (wallet)
- ✅ **رصيد منفصل** (balance)
- ✅ **سجل معاملات** (transactions)
- ✅ **تاريخ أرباح** (totalEarned)
- ✅ **تاريخ مسحوبات** (totalWithdrawn)

---

## 2️⃣ **Admin Dashboard - مشكلة الأزرار** 🔧

### **المشكلة:**
الأزرار في "Quick Actions" قد لا تستجيب بسبب:
1. مشكلة في الـ Tabs component
2. مشكلة في الـ state management
3. مشكلة في الـ event handlers

### **الحل:**
```bash
# على السيرفر
cd /root/55
git reset --hard origin/main
git pull origin main
npm run build
pm2 restart promohive
```

### **للتحقق من المشكلة:**
افتح Developer Console (F12) وراقب:
- `console.log('Switching to users tab')` 
- `console.log('Active tab changed to:', activeTab)`

إذا لم ترى هذه الرسائل عند الضغط على الأزرار، فالمشكلة في الـ frontend.

---

## 3️⃣ **للتأكد من أن كل شيء يعمل:**

### **1. التحقق من المحافظ في قاعدة البيانات:**
```bash
# على السيرفر
sudo -u postgres psql -d promohive -c "SELECT u.username, w.balance, w.total_earned FROM users u JOIN wallets w ON u.id = w.user_id;"
```

### **2. التحقق من API:**
```bash
curl https://globalpromonetwork.store/api/admin/analytics/summary
```

### **3. رؤية الإحصائيات الحقيقية:**
```bash
curl https://globalpromonetwork.store/api/admin/users
```

---

## 📊 **البيانات الحقيقية من قاعدة البيانات:**

### **API Endpoint:**
`GET /api/admin/analytics/summary`

### **Returns:**
```json
{
  "success": true,
  "users": {
    "total": 2,        // عدد المستخدمين الفعلي
    "pending": 1,      // المستخدمين قيد الانتظار
    "approved": 1      // المستخدمين الموافق عليهم
  },
  "tasks": {
    "total": 6,        // عدد المهام
    "active": 6        // المهام النشطة
  },
  "withdrawals": {
    "total": 0,
    "pending": 0
  },
  "revenue": {
    "total": 1000,     // من محافظ جميع المستخدمين
    "withdrawn": 0,
    "pending": 0
  }
}
```

---

## 🎯 **الخلاصة:**

1. ✅ **المحافظ تُنشأ تلقائياً** لكل مستخدم جديد
2. ✅ **API يعمل** ويسترجع البيانات من قاعدة البيانات
3. ⚠️ **مشكلة محتملة في frontend** (الأزرار)

**الحل:** 
- ارفع التحديثات على السيرفر
- أبني المشروع مجدداً
- أعد تشغيل PM2
- تحقق من Console للأخطاء
