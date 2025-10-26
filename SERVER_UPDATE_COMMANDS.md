# خطوات تحديث السيرفر - Server Update Commands

## طريقة 1: سحب التحديثات يدوياً

```bash
# سجل دخول للسيرفر
ssh root@your-server-ip

# اذهب لمجلد المشروع
cd /var/www/promohive  # أو المجلد الصحيح حسب إعداداتك

# سحب التحديثات
git fetch origin main
git pull origin main

# مسح الكاش
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build
npm cache clean --force

# إعادة البناء
npm run build

# إعادة تشغيل التطبيق
pm2 restart promohive
# أو
pm2 restart all

# عرض الحالة
pm2 status
pm2 logs promohive --lines 50
```

## طريقة 2: استخدام سكربت جاهز

انسخ هذا السكربت واستخدمه:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment update..."

cd /var/www/promohive || cd ~/promohive

echo "📥 Pulling latest changes..."
git fetch origin main
git pull origin main

echo "🧹 Clearing caches..."
rm -rf node_modules/.cache
rm -rf .next
rm -rf dist
rm -rf build
npm cache clean --force

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "🔄 Restarting application..."
pm2 restart promohive || pm2 start dist/index.js --name promohive

echo "✅ Deployment complete!"
pm2 status
pm2 logs promohive --lines 20 --nostream
```

## التحقق من النتيجة

بعد التشغيل، تحقق من:

```bash
# التحقق من حالة التطبيق
pm2 status

# عرض السجلات
pm2 logs promohive --lines 50

# التحقق من المنافذ المستخدمة
netstat -tulpn | grep node

# التحقق من الـ Git log
git log --oneline -5
```

## إذا حدثت أخطاء

### الخطأ: "cannot lock ref"
```bash
git gc --prune=now
git remote prune origin
```

### الخطأ: "Permission denied"
```bash
chmod -R 755 /var/www/promohive
chown -R www-data:www-data /var/www/promohive
```

### الخطأ: "Port already in use"
```bash
pm2 delete promohive
pm2 start dist/index.js --name promohive
```

## بعد النجاح

افتح المتصفح وتحقق:
```
https://globalpromonetwork.store/admin
```

افتح تبويب Overview وتحقق من:
- ✅ قسم Debug يعرض البيانات
- ✅ Recent Activity يظهر (إن وجد)
- ✅ الأرقام تظهر بشكل صحيح

