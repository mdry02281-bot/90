# 🔒 دليل الأمان - PromoHive

## ✅ الإجراءات الأمنية المطبقة

### 1. تشفير البيانات
- ✅ كلمات المرور مشفرة بـ **bcrypt** (10 rounds)
- ✅ JWT tokens مع secrets قوية
- ✅ قاعدة البيانات مشفرة (PostgreSQL SSL)

### 2. حماية الاتصال
- ✅ **SSL/HTTPS** مفعّل (Let's Encrypt)
- ✅ Security Headers (Helmet)
- ✅ CORS محدود للدومين فقط
- ✅ Rate Limiting (100 requests/15min)

### 3. المصادقة والتفويض
- ✅ JWT Access Tokens (15 min expiry)
- ✅ JWT Refresh Tokens (7 days expiry)
- ✅ أدوار المستخدمين (USER, ADMIN, SUPER_ADMIN)
- ✅ صلاحيات على كل API endpoint

### 4. حماية قاعدة البيانات
```bash
# قاعدة البيانات محلية فقط (localhost)
# لا يمكن الوصول إليها من الخارج
# كلمة مرور قوية عشوائية
# Connection limit: 10 connections max
```

### 5. ملفات حساسة
```bash
# .env محمي ولا يُرفع على Git
# كلمات المرور قوية (openssl rand)
# Database credentials آمنة
```

## 🛡️ نصائح إضافية

### لتأمين السيرفر:
```bash
# 1. تحديث النظام
sudo apt update && sudo apt upgrade -y

# 2. فحص الـ UFW (Firewall)
sudo ufw status
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# 3. حماية .env
chmod 600 .env
chmod 600 env.production

# 4. مراقبة السجلات
pm2 logs promohive --lines 100
```

## 🔐 كلمات المرور الآمنة

استخدم دائماً كلمات مرور قوية:
- طول 20 حرف على الأقل
- أرقام + حروف + رموز
- مثال: `My#P@ss123!Secure2024!`

## ✅ الحماية من الهجمات

1. **SQL Injection**: ✅ محمي (Prisma)
2. **XSS**: ✅ محمي (Helmet CSP)
3. **CSRF**: ✅ محمي (cookies + CORS)
4. **Brute Force**: ✅ محمي (Rate Limiting)
5. **DDoS**: ✅ محمي (Nginx + Rate Limit)

## 📊 المراقبة الأمنية

```bash
# رصد محاولات الدخول الفاشلة
grep "login" /var/log/auth.log

# رصد حملات PM2
pm2 monitor

# رصد استخدام الموارد
htop
```

## 🚨 في حالة الخرق

1. قم بتغيير جميع كلمات المرور فوراً
2. أغلق الجلسات النشطة: `pm2 restart promohive`
3. راجع السجلات: `pm2 logs promohive`
4. راجع أنشطة قاعدة البيانات
5. ابحث عن أنماط غير عادية

## 📞 الدعم

إذا كانت لديك أي مشاكل أمنية:
- راجع السجلات في `/root/.pm2/logs/`
- راجع سجلات Nginx في `/var/log/nginx/`
- راجع سجلات PostgreSQL في `/var/log/postgresql/`

---

**آخر تحديث:** 2025-01-26
**الإصدار:** 1.0.0
