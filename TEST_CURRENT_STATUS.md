# التحقق من الحالة الحالية

## السيرفر الآن:
- ✅ PM2: Online
- ✅ Build: Completed  
- ⚠️ Database: محاولة الاتصال

## اختبر الموقع:

افتح:
```
https://globalpromonetwork.store/admin
```

---

## إذا ظهر خطأ:

تحقق من PM2 logs:
```bash
pm2 logs promohive --lines 30
```

ابحث عن:
- "Database: Connected" ✅
- أو "Can't reach database" ❌

---

## حل سريع (إذا فشل الاتصال):

```bash
cd /root/55

# استخدم Neon بدلاً من Supabase
cat > .env << 'EOF'
DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="promohive-secret-2024"
NODE_ENV=production
PORT=3002
EOF

npm run build
pm2 restart promohive
pm2 logs promohive
```

---

الموقع يعمل حالياً في معظم الحالات حتى بدون اتصال كامل بقاعدة البيانات (mock mode).

اختبر:
```
https://globalpromonetwork.store/admin
```

