# إصلاح مشكلة Git

## على السيرفر:

```bash
cd /root/55

# تجاهل التغييرات المحلية
git reset --hard origin/main

# رفع التحديثات
git pull origin main

# إعادة البناء
npm run build

# إعادة تشغيل PM2
pm2 restart promohive

# اختبار (مع .store/)
curl https://globalpromonetwork.store/health
```
