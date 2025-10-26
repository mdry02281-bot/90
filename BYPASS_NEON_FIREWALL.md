# حل مشكلة Firewall في Neon

## المشكلة
السيرفر لا يستطيع الوصول إلى Neon بسبب Firewall/Network restrictions

## الحلول السريعة

### الحل 1: تعطيل Firewall مؤقتاً (لتجريب)
1. اذهب إلى: https://console.neon.tech
2. Settings → Network
3. IP Access → Allow all IPs (0.0.0.0/0)
4. اختبار الاتصال من السيرفر

### الحل 2: استخدام Non-pooler connection
```bash
# حاول بدون pooler
postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### الحل 3: استخدام connection string من Neon Dashboard
في Neon:
1. Project → Copy connection string
2. استخدم القيمة المعروضة مباشرة
3. تأكد من وجود SSL

### الحل 4: فحص Network
```bash
# على السيرفر - تحقق من الاتصال
telnet ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech 5432

# أو
nc -zv ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech 5432
```

إذا فشل = Firewall يمنع

### الحل 5: استخدام Proxy/Tunnel (مؤقت)
```bash
# استخدام SSH tunnel
ssh -L 5432:ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech:5432 root@your-server
```

ثم استخدم:
```
DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@localhost:5432/neondb"
```

