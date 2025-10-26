# دليل تصحيح لوحة الأدمن - Admin Dashboard Debug Guide

## المشكلة
لوحة الأدمن لا تعرض أزرار القبول/الرفض وتظهر "بيانات وهمية".

## التحديثات التي تمت

### 1. إصلاح endpoint الخاطئ
- **قبل**: الواجهة كانت تستدعي `/api/admin/analytics/summary` (غير موجود)
- **بعد**: تم تعديلها إلى `/api/admin/dashboard` (الصحيح)

### 2. إضافة Logs للتصحيح
تم إضافة console.log في الأماكن التالية:
- `fetchDashboardStats()`: لطباعة استجابة الـ API
- `fetchPendingUsers()`: لطباعة بيانات المستخدمين المنتظرين
- `handleApproveUser()`: لطباعة عملية الموافقة

### 3. إضافة قسم Debug
تم إضافة كارد أزرق في تبويب "Users" يعرض:
- عدد المستخدمين المنتظرين
- حالة التحميل
- البيانات الخام (Raw Data)

### 4. إضافة زر "Create Test User"
تم إضافة زر لإنشاء مستخدم اختبار مباشرة من الواجهة لتسهيل الاختبار.

## خطوات التشخيص

### 1. افتح Developer Tools
```bash
# اضغط F12 أو
# اذهب إلى إعدادات المتصفح > أدوات المطور
```

### 2. افتح Console
سيظهر لك الـ logs التالية عند زيارة لوحة الأدمن:
```
Fetching pending users...
Pending users response status: 200
Pending users response data: {...}
Number of pending users: X
```

### 3. افتح Network Tab
راقب الطلبات التالية:
- `GET /api/admin/dashboard` - لجلب الإحصائيات
- `GET /api/admin/users?status=pending` - لجلب المستخدمين المنتظرين
- `POST /api/admin/users/:id/approve` - عند الضغط على Approve

### 4. تحقق من الاستجابة
افتح أي request وابدع على "Response":
```json
{
  "success": true,
  "users": [
    {
      "id": "...",
      "email": "...",
      "isApproved": false,
      ...
    }
  ]
}
```

## حلول سريعة

### الحل 1: إنشاء مستخدم اختبار من الواجهة
1. اذهب إلى لوحة الأدمن
2. اختر تبويب "Users"
3. اضغط على زر "Create Test User" في قسم Debug
4. سيتم إنشاء مستخدم جديد بمصادقة pending

### الحل 2: إنشاء مستخدم اختبار عبر السيرفر
شغّل هذا الأمر في terminal على السيرفر:

```bash
# عبر PowerShell
cd C:\Users\SANND\Desktop\promohive\promohive
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.create({ data: { email: 'test@example.com', password: 'hashedpassword', username: 'testuser', fullName: 'Test User', gender: 'male', birthdate: new Date('1990-01-01'), role: 'USER', isApproved: false } }).then(console.log).finally(() => prisma.$disconnect());"
```

### الحل 3: تحويل مستخدم موجود إلى pending
```sql
-- في قاعدة البيانات Supabase
UPDATE "User" 
SET "isApproved" = false 
WHERE email = 'user@example.com';
```

### الحل 4: استخدام Prisma Studio
```bash
cd C:\Users\SANND\Desktop\promohive\promohive
npx prisma studio
```

ثم:
1. افتح جدول User
2. ابحث عن مستخدم
3. غيّر `isApproved` إلى `false`

## التحقق من المصادقة

### تحقق من التوكن
في Console، شغّل:
```javascript
console.log(document.cookie);
```

يجب أن يكون هناك cookie باسم:
- `accessToken` أو
- `jwt` أو
- أي اسم آخر حسب إعداداتك

### التحقق من الصلاحيات
تأكد أن المستخدم المسجل به:
- `role = 'ADMIN'` أو `'SUPER_ADMIN'`
- في قاعدة البيانات

## الاختبار المنهجي

### Test Case 1: عرض المستخدمين المنتظرين
**الخطوات:**
1. افتح لوحة الأدمن
2. اذهب إلى تبويب "Users"
3. ابحث عن قسم "Debug Information"
4. تحقق من عدد المستخدمين المنتظرين

**النتيجة المتوقعة:**
- إذا كان العدد > 0: ستظهر أزرار Approve
- إذا كان العدد = 0: ستظهر رسالة "No Pending Users"

### Test Case 2: إنشاء مستخدم اختبار
**الخطوات:**
1. اضغط على زر "Create Test User"
2. افتح Console
3. ابحث عن الرسالة: "Creating test user..."
4. انتظر رسالة: "Test user created successfully"

**النتيجة المتوقعة:**
- عدد المستخدمين المنتظرين يزداد
- يظهر مستخدم جديد في القائمة
- يظهر زر Approve بجانب المستخدم الجديد

### Test Case 3: موافقة على مستخدم
**الخطوات:**
1. اضغط على زر "Approve" بجانب مستخدم
2. افتح Console
3. ابحث عن الرسالة: "Approving user: [id]"
4. انتظر رسالة: "Approve success"

**النتيجة المتوقعة:**
- المستخدم يختفي من قائمة المنتظرين
- تظهر رسالة نجاح
- العدد الكلي للمستخدمين يزيد

## الأخطاء الشائعة

### خطأ: "Failed to load dashboard stats"
**السبب:** السيرفر غير نشط أو endpoint خاطئ
**الحل:** تأكد أن backend يعمل على المنفذ الصحيح

### خطأ: "Network error"
**السبب:** مشكلة في الاتصال أو CORS
**الحل:** تحقق من إعدادات CORS في backend

### خطأ: "Unauthorized"
**السبب:** المستخدم ليس admin
**الحل:** 
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### خطأ: بيانات وهمية
**السبب:** قاعدة البيانات غير متصلة أو empty
**الحل:** شغّل seed أو أنشئ بيانات اختبارية

## الخطوات التالية

بعد تشغيل الواجهة:

1. **افتح لوحة الأدمن**
2. **ابحث عن قسم "Debug Information"** في تبويب Users
3. **أرسل لي:**
   - عدد المستخدمين المنتظرين (Pending Users Count)
   - أي رسائل خطأ من Console
   - أي data من قسم "Raw Data"

4. **جرّب زر "Create Test User"**
5. **أرسل لي النتيجة** (نجاح أو فشل)

بهذا أقدر أحدد المشكلة بدقة وأقدم حل نهائي!

