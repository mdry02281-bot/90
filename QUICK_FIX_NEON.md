# حل سريع لمشكلة Neon Database

## 🎯 الخطوات:

### 1. في Neon Dashboard:
```
https://console.neon.tech
→ Settings  
→ Network
→ IP Access
→ Change to "Allow all IPs (0.0.0.0/0)"
→ Save
```

### 2. على السيرفر:
```bash
# اختبار الاتصال
npx prisma db execute --stdin <<< "SELECT 1;" && echo "✅ Connected!" || echo "❌ Failed"
```

### 3. إذا نجح:
```bash
npx prisma db push
npm run build
pm2 restart promohive
pm2 logs promohive
```

---

## 🔒 بديل آمن أكثر:

إذا لا تريد Allow all IPs، احصل على IP السيرفر أولاً:

```bash
# على السيرفر
curl ifconfig.me
```

ثم في Neon:
- Settings → Network → IP Access
- Add IP → ضع IP السيرفر
- Save

---

## ⚡ الحل الأسرع (مؤقت للتجريب):

في Neon Dashboard:
1. Settings → Network
2. Security → **Temporarily disable IP filtering**
3. Test the connection
4. عودة الإعدادات الأصلية بعد التجريب

