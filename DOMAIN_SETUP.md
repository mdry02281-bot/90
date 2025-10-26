# 🌐 دليل إعداد الدومين والحماية

## 📋 إعداد globalpromonetwork.store على السيرفر

### 1️⃣ تثبيت Nginx وإعداده

```bash
# تثبيت Nginx
sudo apt update
sudo apt install -y nginx

# التحقق من حالة Nginx
sudo systemctl status nginx

# فتح المنفذ 80 و 443 في الجدار الناري
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

### 2️⃣ ربط الدومين بالسيرفر

```bash
# إنشاء مجلد للدومين
sudo mkdir -p /var/www/globalpromonetwork.store/html

# تغيير الصلاحيات
sudo chown -R $USER:$USER /var/www/globalpromonetwork.store/html
sudo chmod -R 755 /var/www/globalpromonetwork.store

# إنشاء صفحة index بسيطة
echo '<h1>Welcome to PromoHive</h1>' | sudo tee /var/www/globalpromonetwork.store/html/index.html
```

### 3️⃣ إنشاء تكوين Nginx

```bash
# نسخ ملف التكوين من GitHub
cd /root/55

# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/promohive
```

**أضف هذا المحتوى:**

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
        
        # زيادة timeout
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API Routes
    location /api/ {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Authorization, Content-Type' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # زيادة حجم upload
    client_max_body_size 10M;
}
```

### 4️⃣ تفعيل الموقع

```bash
# إنشاء رابط رمزي
sudo ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/

# حذف الموقع الافتراضي
sudo rm /etc/nginx/sites-enabled/default

# اختبار التكوين
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
```

### 5️⃣ إعداد SSL مع Let's Encrypt

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store

# سيطلب منك:
# - Email: your-email@example.com
# - Agree to terms: Y
# - Redirect HTTP to HTTPS: 2

# تجديد الشهادة تلقائياً
sudo certbot renew --dry-run

# التحقق من الـ cron للتجديد التلقائي
sudo certbot renew
```

### 6️⃣ تحديث إعدادات Nginx بعد SSL

```bash
# Certbot سيقوم بتحديث الملف تلقائياً، ولكن للتأكد
sudo nano /etc/nginx/sites-available/promohive
```

**أضف هذه الأسطر بعد `listen 443 ssl http2;`:**

```nginx
listen 443 ssl http2;
server_name globalpromonetwork.store www.globalpromonetwork.store;

# SSL Configuration (تم إضافتها من certbot)
ssl_certificate /etc/letsencrypt/live/globalpromonetwork.store/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/globalpromonetwork.store/privkey.pem;

# SSL Security Settings
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security Headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 7️⃣ إعادة تحميل Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 8️⃣ إعداد PM2 للعمل مع الـ domain

تأكد من أن `PM2` يعمل:

```bash
# عرض حالة PM2
pm2 status

# إذا لم يعمل
cd /root/55
pm2 start npm --name "promohive" -- start

# حفظ الإعدادات
pm2 save
pm2 startup
```

### 9️⃣ تحديث CORS في المشروع

```bash
# تحرير ملف .env
cd /root/55
nano .env

# تحديث CORS_ORIGIN إلى:
CORS_ORIGIN="https://globalpromonetwork.store"

# إعادة تشغيل المشروع
pm2 restart promohive
```

### 🔟 التحقق من كل شيء

```bash
# فحص حالة Nginx
sudo systemctl status nginx

# فحص حالة PM2
pm2 status

# فحص المنافذ
sudo netstat -tulpn | grep -E '3002|80|443'

# اختبار الدومين
curl https://globalpromonetwork.store/health
```

## ✅ النتيجة النهائية

بعد اتمام جميع الخطوات:

```
✓ https://globalpromonetwork.store - يعمل بشكل كامل
✓ SSL Certificate مثبت
✓ Nginx reverse proxy يعمل
✓ API متاح على https://globalpromonetwork.store/api/
✓ Health check: https://globalpromonetwork.store/health
```

## 🔧 أوامر الصيانة

```bash
# إعادة تشغيل Nginx
sudo systemctl restart nginx

# عرض سجلات Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# إعادة تشغيل المشروع
pm2 restart promohive

# عرض حالة SSL
sudo certbot certificates

# تجديد SSL يدوياً
sudo certbot renew
```

## 🚨 استكشاف الأخطاء

### إذا فشل Nginx في بدء التشغيل:

```bash
sudo nginx -t  # اختبار التكوين
sudo systemctl status nginx  # عرض الأخطاء
sudo journalctl -xe  # عرض السجلات المفصلة
```

### إذا لم يعمل الـ domain:

1. تأكد من DNS points إلى IP السيرفر
2. انتظر 24 ساعة لتحديث DNS
3. فحص DNS: `nslookup globalpromonetwork.store`

### إذا لم يعمل SSL:

```bash
# إعادة تثبيت Certbot
sudo certbot --nginx -d globalpromonetwork.store --force-renewal

# إعادة تشغيل Nginx
sudo systemctl restart nginx
```

## 📋 معلومات الدومين

- **Domain:** globalpromonetwork.store
- **Server:** srv1052990.hstgr.cloud
- **IP:** (سيظهر من hostinger)
- **SSL:** Let's Encrypt
- **Backend:** Node.js on port 3002
- **Proxy:** Nginx on port 80/443

## 🎯 الخطوات القادمة

1. ✅ ربط الدومين بالسيرفر
2. ✅ إعداد Nginx
3. ✅ تثبيت SSL
4. 🔄 إعداد Database backup (اختياري)
5. 🔄 إعداد Monitoring (اختياري)

---

**ملاحظة:** اتبع الخطوات بالترتيب ولا تتخطى أي خطوة.

