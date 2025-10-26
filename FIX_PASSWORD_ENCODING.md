# إصلاح مشكلة @ في Password

## المشكلة:
Password يحتوي على `@` → يسبب مشكلة في parsing

Password: `Ibrahem@811997`

## الحل:

URL-encode الـ password:
```
Ibrahem@811997 → Ibrahem%40811997
```

## على السيرفر:

```bash
cd /root/55
nano .env
```

غيّر من:
```
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem@811997@aws-0..."
```

إلى:
```
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

أو استخدم:
```bash
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres.jxtutquvxmkrajfvdbab:Ibrahem%40811997@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
ENVEOF
```

ثم:
```bash
npm run build
pm2 restart promohive
pm2 logs promohive | grep "Database"
```

