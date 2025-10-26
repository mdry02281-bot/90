# حل المشكلة - Solution

## الوضع الحالي:
- ✅ السيرفر يعمل
- ✅ الواجهة تعرض debug panel
- ❌ DATABASE_URL غير صحيح
- ✅ لدي 3 pending users في Supabase

---

## الخطوات (على السيرفر):

```bash
cd /root/55

# احصل على Connection String من Supabase:
# 1. اذهب: https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
# 2. Settings → Database
# 3. Copy connection string (Session mode)
# 4. انسخ كل النص الذي يبدأ بـ: postgresql://

# ضعه في .env:
nano .env
```

الصق هذا **بدون تغيير**:

```
DATABASE_URL="[الصق Connection String من Supabase هنا]"
JWT_SECRET="promohive-secret-2024"
JWT_REFRESH_SECRET="promohive-refresh-2024"
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
```

ثم:

```bash
npx prisma generate
npx prisma db pull
npm run build
pm2 restart promohive
pm2 logs promohive
```

---

## التحقق:

افتح في المتصفح:
```
https://globalpromonetwork.store/admin
```

يجب أن ترى:
- ✅ 3 pending users (في تبويب Users)
- ✅ Recent Activity
- ✅ أزرار Approve

---

**مهم:** أحتاج Connection String من Supabase Dashboard.

