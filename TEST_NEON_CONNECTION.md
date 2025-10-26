# اختبار اتصال قاعدة بيانات Neon

## على السيرفر

### 1. التأكد من الـ Connection String
```bash
# تحقق من .env
cat .env | grep DATABASE_URL
```

يجب أن يحتوي على:
```
DATABASE_URL="postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. اختبر الاتصال
```bash
# جرب الاتصال مباشرة
psql "postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT NOW();"
```

إذا نجح:
```bash
# طبق Prisma
npx prisma generate
npx prisma db push
npm run build
pm2 restart promohive
```

### 3. إذا فشل الاتصال

```bash
# حاول بدون sslmode
psql "postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb" -c "SELECT NOW();"
```

أو:
```bash
# حاول مع sslmode=prefer
psql "postgresql://neondb_owner:npg_4Sp2lLZUDOhN@ep-bold-art-ah3oamf8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=prefer" -c "SELECT NOW();"
```

### 4. تحقق من Network Security في Neon
- اذهب إلى: https://console.neon.tech
- Settings → Network → IP Access
- تأكد من Allow All IPs أو أضف IP السيرفر

