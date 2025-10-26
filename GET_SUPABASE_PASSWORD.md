# كيفية الحصول على Supabase Password

## الخطوات:

1. اذهب إلى: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
2. Sidebar → Settings (الإعدادات) 
3. Database → Copy connection string
4. انسخ **Session mode** connection string كاملاً

## أو:

1. Settings → Database → Connection info
2. Database password → Reset if needed
3. انسخ connection string الذي يحتوي على password

## مثال connection string صحيح:

```
postgresql://postgres.jxtutquvxmkrajfvdbab:YOUR_ACTUAL_PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

## على السيرفر:

```bash
cd /root/55
nano .env
```

الصق connection string من Supabase Dashboard.

---

## بديل مؤقت (بدون قاعدة بيانات):

إذا لم تتمكن من الحصول على password، استخدم mock data مؤقتاً:

```bash
# على السيرفر
cd /root/55
cat > .env << 'EOF'
DATABASE_URL="file:./mock.db"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
NODE_ENV=production
PORT=3002
EOF

npm run build
pm2 restart promohive
```

