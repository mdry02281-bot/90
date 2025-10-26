# PromoHive Environment Variables Guide

## 📋 متغيرات البيئة المطلوبة

### 1. قم بإنشاء ملف `.env` في الجذر

```bash
cp env.supabase .env
```

### 2. متغيرات قاعدة البيانات (Supabase)

```env
# Supabase Database Connection
DATABASE_URL="postgresql://postgres:PASSWORD@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"

# Supabase API
SUPABASE_URL="https://jxtutquvxmkrajfvdbab.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. JWT و Authentication

```env
JWT_SECRET="promohive-super-secret-jwt-key-2024"
JWT_REFRESH_SECRET="promohive-super-secret-refresh-key-2024"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
```

### 4. إعدادات الخادم

```env
PORT=3002
NODE_ENV="production"
CORS_ORIGIN="https://promohive.netlify.app"
PLATFORM_URL="https://promohive.netlify.app"
```

### 5. معدل الحد (Rate Limiting)

```env
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
```

### 6. إعدادات البريد الإلكتروني (Hostinger)

```env
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="YOUR_EMAIL_PASSWORD"
SMTP_FROM="promohive@globalpromonetwork.store"
```

### 7. مفاتيح واجهات برمجة التطبيقات الخارجية

```env
# AdGem Integration
ADGEM_JWT_SECRET="your-adgem-jwt-secret"

# Adsterra Integration
ADSTERRA_API_KEY="your-adsterra-api-key"

# CPAlead Integration
CPALEAD_API_KEY="your-cpalead-api-key"
```

### 8. التسجيل

```env
LOG_LEVEL="info"
```

### 9. الأمان

```env
BCRYPT_SALT_ROUNDS="12"
```

---

## 🗄️ جداول قاعدة البيانات المطلوبة

المشروع يستخدم **Prisma ORM** مع **Supabase PostgreSQL**. الجداول ستُنشأ تلقائياً عند تشغيل:

```bash
npm run prisma:migrate
npm run prisma:generate
```

### الجداول الموجودة في Schema:

1. **User** - المستخدمون
2. **Wallet** - المحافظ
3. **Transaction** - المعاملات
4. **Task** - المهام
5. **UserTask** - مهام المستخدم
6. **Proof** - أدلة المهام
7. **Offer** - العروض الخارجية
8. **Referral** - الإحالات
9. **Withdrawal** - طلبات السحب
10. **LevelRequest** - طلبات ترقية المستوى
11. **AdminAction** - إجراءات الأدمن
12. **AdRevenue** - إيرادات الإعلانات
13. **Setting** - الإعدادات
14. **MagicLinkToken** - رابط الدخول السحري

---

## 📝 خطوات التكوين

### 1. إنشاء ملف `.env`

```bash
cp env.supabase .env
```

### 2. تحديث كلمة مرور قاعدة البيانات

في ملف `.env`، غيّر `PASSWORD` في `DATABASE_URL`:

```
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.jxtutquvxmkrajfvdbab.supabase.co:5432/postgres"
```

### 3. تحديث كلمة مرور البريد الإلكتروني

```env
SMTP_PASS="your-actual-email-password"
```

### 4. الحصول على Service Role Key من Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. Settings → API
4. انسخ `service_role` key
5. ضعه في `SUPABASE_SERVICE_ROLE_KEY`

### 5. إنشاء الجداول

```bash
# تثبيت الاعتمادات
npm install

# إنتاج Prisma Client
npm run prisma:generate

# تشغيل المهام
npm run prisma:migrate

# بيانات تجريبية (اختياري)
npm run prisma:seed
```

---

## 🔐 الأمان المهم

- لا تُرفع ملف `.env` إلى Git
- ملف `.gitignore` يتضمن `.env`
- استخدم Service Role Key بعناية (امتيازات عالية)
- لا تُشارك ANON_KEY أو SERVICE_KEY علناً

---

## 🚀 تشغيل المشروع

```bash
# تطوير
npm run dev

# إنتاج
npm run build
npm start

# بناء العميل فقط
npm run build:client
```

---

## 📊 اختبار الاتصال

بعد إعداد `.env`، اختبر الاتصال:

```bash
npm run prisma:studio
```

ستفتح أداة Prisma Studio لعرض البيانات.

---

## ✅ التحقق من نجاح التكوين

1. تأكد من وجود ملف `.env`
2. تحقق من صحة جميع المتغيرات
3. شغّل `npm run prisma:generate`
4. شغّل `npm run prisma:migrate`
5. تحقق من وجود الجداول في Supabase Dashboard

