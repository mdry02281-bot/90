# الحصول على Database Password الصحيح

## المشكلة:
```
FATAL: Tenant or user not found
```

## السبب:
Password: `Ibrahem@811997` غير صحيح أو غير موجود في Supabase.

---

## الحل: احصل على Database Password من Supabase

### الخطوات:

1. **اذهب إلى Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/jxtutquvxmkrajfvdbab
   ```

2. **افتح Settings:**
   - من القائمة اليسرى: **Settings** → **Database**

3. **Database Password:**
   - ستجد قسم **Database password**
   - إذا كان مخفي: اضغط **Show** أو **Reveal**
   - إذا لم تعرف password: **Reset database password** → انسخ الـ password الجديد

4. **أو انسخ Connection String:**
   - في نفس الصفحة **Connection string**
   - اختر **Transaction mode**
   - انسخ النص الكامل الذي يبدأ بـ:
   ```
   postgresql://postgres.jxtutquvxmkrajfvdbab:[PASSWORD-HERE]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

---

## ثم على السيرفر:

```bash
cd /root/55
nano .env
```

غيّر `Ibrahem%40811997` إلى **password الصحيح** من Dashboard.

---

**مهم:** يجب أن تكون password من Supabase Dashboard، وليس رمز من كود.

