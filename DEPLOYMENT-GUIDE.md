# PromoHive Deployment Guide - خطوة بخطوة للنشر على Netlify

## 📋 المتطلبات المسبقة

- حساب GitHub
- حساب Supabase
- حساب Netlify
- Node.js 18+ مثبت على جهازك

## 🚀 الخطوة 1: إعداد Supabase

### 1.1 إنشاء مشروع Supabase
1. اذهب إلى [Supabase](https://supabase.com)
2. اضغط على "New Project"
3. اختر اسم المشروع: `promohive`
4. اختر كلمة مرور قوية للقاعدة
5. اختر المنطقة الأقرب لك
6. اضغط "Create new project"

### 1.2 تشغيل SQL Scripts
1. اذهب إلى SQL Editor في Supabase
2. انسخ محتوى ملف `supabase-schema.sql`
3. اضغط "Run" لإنشاء الجداول
4. انسخ محتوى ملف `supabase-data.sql`
5. اضغط "Run" لإدراج البيانات الأولية

### 1.3 الحصول على مفاتيح API
1. اذهب إلى Settings → API
2. انسخ:
   - Project URL
   - anon public key
   - service_role key (احتفظ به سراً)

## 🔧 الخطوة 2: إعداد GitHub Repository

### 2.1 رفع المشروع إلى GitHub
```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial PromoHive setup with Supabase integration"
git branch -M main
git remote add origin https://github.com/nyttynt96-art/1.git
git push -u origin main
```

### 2.2 التأكد من الملفات المطلوبة
تأكد من وجود هذه الملفات:
- `netlify.toml`
- `package.json`
- `vite.config.ts`
- `tailwind.config.js`
- `tsconfig.json`
- `tsconfig.backend.json`
- `tsconfig.node.json`

## 🌐 الخطوة 3: نشر على Netlify

### 3.1 إنشاء حساب Netlify
1. اذهب إلى [Netlify](https://netlify.com)
2. اضغط "Sign up"
3. اختر "Sign up with GitHub"
4. اربط حساب GitHub

### 3.2 إنشاء موقع جديد
1. اضغط "New site from Git"
2. اختر "GitHub"
3. ابحث عن repository: `nyttynt96-art/1`
4. اضغط "Select"

### 3.3 إعداد Build Settings
```
Build command: npm run build:client
Publish directory: dist
Node version: 18
```

### 3.4 إضافة Environment Variables
اذهب إلى Site Settings → Environment Variables وأضف:

```
NODE_ENV=production
VITE_SUPABASE_URL=https://jxtutquvxmkrajfvdbab.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dHV0cXV2eG1rcmFqZnZkYmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NDA5MjcsImV4cCI6MjA3NzAxNjkyN30.jLMQWJqwj6Amja-bsBmLwZjmTHgusL_1q2n_ZThbRrM
```

### 3.5 النشر
1. اضغط "Deploy site"
2. انتظر حتى يكتمل البناء (5-10 دقائق)
3. ستحصل على رابط الموقع: `https://random-name.netlify.app`

## 🔐 الخطوة 4: إعداد الأمان

### 4.1 تحديث كلمة مرور قاعدة البيانات
1. اذهب إلى Supabase → Settings → Database
2. اضغط "Reset database password"
3. انسخ كلمة المرور الجديدة
4. حدث ملف `.env` في Netlify

### 4.2 إعداد Row Level Security (RLS)
في Supabase SQL Editor، شغل:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_link_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Create policies for wallets table
CREATE POLICY "Users can view own wallet" ON wallets
    FOR SELECT USING (auth.uid()::text = user_id);

-- Create policies for tasks table
CREATE POLICY "Anyone can view active tasks" ON tasks
    FOR SELECT USING (status = 'ACTIVE');

-- Create policies for settings table
CREATE POLICY "Anyone can view settings" ON settings
    FOR SELECT USING (true);
```

## 🎨 الخطوة 5: تخصيص الموقع

### 5.1 تغيير اسم الموقع
1. اذهب إلى Site Settings → Site details
2. اضغط "Change site name"
3. اختر اسم مثل: `promohive` أو `promohive-app`

### 5.2 إعداد Custom Domain (اختياري)
1. اذهب إلى Domain management
2. اضغط "Add custom domain"
3. أدخل اسم النطاق الخاص بك
4. اتبع التعليمات لإعداد DNS

## 📱 الخطوة 6: اختبار الموقع

### 6.1 اختبار الوظائف الأساسية
1. افتح الموقع في المتصفح
2. جرب التسجيل بحساب جديد
3. جرب تسجيل الدخول بحساب الإدمن:
   - Email: `admin@promohive.com`
   - Password: `Admin123!`

### 6.2 اختبار لوحة الإدارة
1. سجل دخول بحساب الإدمن
2. اذهب إلى `/admin`
3. تأكد من عمل جميع الوظائف

## 🔧 الخطوة 7: إعداد البريد الإلكتروني

### 7.1 إعداد SMTP
1. اذهب إلى Netlify → Environment Variables
2. أضف متغيرات البريد:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@promohive.com
```

### 7.2 إنشاء App Password لـ Gmail
1. اذهب إلى Google Account Settings
2. Security → 2-Step Verification
3. App passwords → Generate
4. انسخ كلمة المرور وأضفها في Netlify

## 📊 الخطوة 8: مراقبة الأداء

### 8.1 إعداد Analytics
1. اذهب إلى Site Settings → Analytics
2. فعّل "Netlify Analytics"
3. أو أضف Google Analytics

### 8.2 مراقبة الأخطاء
1. اذهب إلى Functions → Logs
2. راقب الأخطاء والتحسينات

## 🚀 الخطوة 9: النشر النهائي

### 9.1 إعادة النشر
```bash
# في مجلد المشروع
git add .
git commit -m "Production ready"
git push origin main
```

### 9.2 اختبار نهائي
1. تأكد من عمل جميع الوظائف
2. اختبر على أجهزة مختلفة
3. تأكد من سرعة التحميل

## 📞 الدعم والمساعدة

إذا واجهت أي مشاكل:

1. **GitHub Issues**: أنشئ issue في repository
2. **Netlify Support**: استخدم دعم Netlify
3. **Supabase Support**: استخدم دعم Supabase

## 🎉 تهانينا!

لقد نجحت في نشر PromoHive على Netlify! 

موقعك الآن متاح على: `https://your-site-name.netlify.app`

### معلومات تسجيل الدخول للإدمن:
- **Email**: `admin@promohive.com`
- **Password**: `Admin123!`
- **Role**: `SUPER_ADMIN`

### الخطوات التالية:
1. غيّر كلمة مرور الإدمن
2. أضف مهام جديدة
3. أعد تكوين الإعدادات
4. ابدأ في جذب المستخدمين

---

**PromoHive** - منصة الترويج العالمية! 🚀
