# دليل النشر الكامل - PromoHive

## 📦 الملفات المطلوبة

1. **promohive-frontend.zip** (1.5 MB) - للنشر على Netlify
2. **promohive-backend.zip** (41 KB) - للنشر على VPS/GitHub

---

## 🌐 الجزء 1: نشر Frontend على Netlify

### الخطوة 1: رفع إلى GitHub

```bash
# فك الضغط
unzip promohive-frontend.zip
cd promohive-frontend

# إنشاء Git repository
git init
git add .
git commit -m "Initial commit"

# رفع إلى GitHub
git remote add origin https://github.com/YOUR_USERNAME/promohive-frontend.git
git push -u origin main
```

### الخطوة 2: ربط مع Netlify

1. اذهب إلى [Netlify](https://app.netlify.com)
2. انقر **"Add new site"** → **"Import an existing project"**
3. اختر **GitHub** وحدد repository: `promohive-frontend`
4. إعدادات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. انقر **"Deploy site"**

### الخطوة 3: تكوين Environment Variables

في Netlify Dashboard:
1. اذهب إلى **Site settings** → **Environment variables**
2. أضف:
   ```
   VITE_API_URL=https://globalpromonetwork.store/api
   ```

### الخطوة 4: تكوين Redirects

الملف `netlify.toml` موجود بالفعل ويحتوي على:
- Proxy للـ API requests
- SPA routing

### الخطوة 5: Custom Domain (اختياري)

1. في Netlify: **Domain settings** → **Add custom domain**
2. أضف: `promohive.netlify.app` أو دومين خاص
3. سيتم تفعيل SSL تلقائياً

---

## 🖥️ الجزء 2: نشر Backend على VPS

### الخطوة 1: رفع إلى GitHub

```bash
# فك الضغط
unzip promohive-backend.zip
cd promohive-backend

# إنشاء Git repository
git init
git add .
git commit -m "Initial commit"

# رفع إلى GitHub
git remote add origin https://github.com/YOUR_USERNAME/promohive-backend.git
git push -u origin main
```

### الخطوة 2: الاتصال بالـ VPS

```bash
ssh root@72.60.215.2
# Password: Loveyou@811997
```

### الخطوة 3: تثبيت المتطلبات

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت PM2
npm install -g pm2

# تثبيت Nginx
apt install -y nginx

# تثبيت Git
apt install -y git
```

### الخطوة 4: استنساخ المشروع

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/promohive-backend.git promohive
cd promohive
```

### الخطوة 5: إنشاء .env

```bash
nano .env
```

الصق هذا المحتوى:

```env
# Database (NeonDB)
DATABASE_URL="postgresql://neondb_owner:npg_Lw6yGODYYpPz@ep-divine-sea-a5wfz4pu.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT Secrets (Generate new ones!)
JWT_ACCESS_SECRET="PromoHive2025AccessSecretKeyVeryLongAndSecure64CharactersMinimum123"
JWT_REFRESH_SECRET="PromoHive2025RefreshSecretKeyVeryLongAndSecure64CharactersMinimum456"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Admin Account
ADMIN_EMAIL="1sanadsa1997@gmil.com"
ADMIN_PASSWORD="PromoHive@Admin2025!"
ADMIN_NAME="Super Admin"

# SMTP Email
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="PromoHive@2025!"
SMTP_SECURE="true"
SMTP_FROM_NAME="PromoHive Team"
SMTP_FROM_EMAIL="promohive@globalpromonetwork.store"

# Server
NODE_ENV="production"
PORT="3002"
FRONTEND_URL="https://YOUR-APP.netlify.app"
CORS_ORIGIN="https://YOUR-APP.netlify.app"

# Settings
WELCOME_BONUS_AMOUNT="5.00"
MIN_WITHDRAWAL_AMOUNT="10.00"
USDT_CONVERSION_RATE="1.0"
```

**⚠️ مهم:** غيّر `FRONTEND_URL` و `CORS_ORIGIN` إلى رابط Netlify الحقيقي!

### الخطوة 6: تثبيت Dependencies

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### الخطوة 7: بناء المشروع

```bash
npm run build
```

### الخطوة 8: تشغيل مع PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### الخطوة 9: تكوين Nginx

```bash
nano /etc/nginx/sites-available/promohive
```

الصق:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

تفعيل:

```bash
ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### الخطوة 10: تثبيت SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store
```

---

## ✅ التحقق من النشر

### Frontend (Netlify)
```bash
curl https://YOUR-APP.netlify.app
```

### Backend (VPS)
```bash
curl https://globalpromonetwork.store/api/health
```

---

## 🔄 التحديثات المستقبلية

### تحديث Frontend

```bash
# على جهازك
cd promohive-frontend
git add .
git commit -m "Update"
git push

# Netlify سيبني تلقائياً
```

### تحديث Backend

```bash
# على VPS
cd /var/www/promohive
git pull
npm install
npm run build
pm2 restart promohive
```

---

## 📋 الأوامر المفيدة

### PM2
```bash
pm2 list              # قائمة العمليات
pm2 logs promohive    # عرض اللوجات
pm2 restart promohive # إعادة التشغيل
pm2 stop promohive    # إيقاف
```

### Nginx
```bash
systemctl status nginx   # الحالة
systemctl reload nginx   # إعادة التحميل
nginx -t                 # اختبار التكوين
```

### Database
```bash
npx prisma studio  # واجهة إدارة DB
npx prisma migrate dev  # إنشاء migration جديد
```

---

## 🎯 الخلاصة

✅ **Frontend**: Netlify (CDN + Auto SSL)  
✅ **Backend**: VPS (PM2 + Nginx + SSL)  
✅ **Database**: NeonDB (PostgreSQL)  
✅ **Email**: Hostinger SMTP

**الروابط النهائية:**
- Frontend: `https://YOUR-APP.netlify.app`
- Backend API: `https://globalpromonetwork.store/api`
- Admin: `https://YOUR-APP.netlify.app/admin`

---

## 🆘 المساعدة

إذا واجهت مشاكل:
1. تحقق من اللوجات: `pm2 logs promohive`
2. تحقق من Nginx: `tail -f /var/log/nginx/error.log`
3. تحقق من Database: `npx prisma studio`

**جاهز 100% للنشر!** 🚀

