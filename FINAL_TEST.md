# 🧪 الاختبار النهائي

## على السيرفر:

```bash
cd /root/55

# 1. تسجيل دخول والحصول على token
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@promohive.com","password":"admin123!"}'

# 2. ستحصل على token، استخدمه هنا:
TOKEN="YOUR_TOKEN_HERE"

# 3. اختبار analytics
curl http://localhost:3002/api/admin/analytics/summary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 4. أو بدون token (للاختبار فقط)
curl http://localhost:3002/api/admin/users
```

---

## النتيجة المتوقعة:

```json
{
  "users": {
    "total": 1,
    "pending": 0,
    "approved": 1
  },
  "tasks": {
    "total": 5,
    "active": 5
  },
  "withdrawals": {
    "total": 0,
    "pending": 0
  },
  "revenue": {
    "total": 1000,
    "withdrawn": 0,
    "pending": 1000
  }
}
```

---

## إذا كانت النتيجة كما أعلاه:

المشكلة ليست في الـ API، بل في المتصفح.

### الحل:
1. أمسح cache المتصفح تماماً
2. افتح Incognito
3. أو استخدم Chrome DevTools → Application → Clear Storage → Clear all

---

## تحقق من المستخدمين:

```bash
sudo -u postgres psql -d promohive -c "SELECT username, email, role FROM \"User\";"
# يجب أن يعرض: superadmin | admin@promohive.com | SUPER_ADMIN
```
