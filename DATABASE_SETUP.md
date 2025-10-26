# إعداد قاعدة البيانات البديلة

## الخيار 1: Neon (PostgreSQL Serverless مجاني)
1. سجل في: https://neon.tech
2. أنشئ مشروع جديد
3. احصل على Connection String
4. استبدل DATABASE_URL في .env

## الخيار 2: Railway (PostgreSQL مجاني)
1. سجل في: https://railway.app
2. أنشئ مشروع جديد
3. أضف PostgreSQL database
4. احصل على Connection String

## الخيار 3: Supabase (الموجود حالياً)
1. اذهب إلى Supabase Dashboard
2. Settings → Database
3. Network Restrictions
4. اضغط "Restrict all access" ثم احذفه لإزالة القيود
5. أو أضف `0.0.0.0/0` للسماح بالجميع

## الخيار 4: قاعدة بيانات محلية على السيرفر
```bash
cd /root/55
bash setup-database.sh
cp env.production.local .env
npm run build
pm2 restart promohive
```

## بعد تغيير DATABASE_URL:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
pm2 restart promohive
```
