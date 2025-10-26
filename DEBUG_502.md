# 🔧 حل مشكلة 502 Bad Gateway

## الأوامر على السيرفر:

```bash
cd /root/55

# 1. التحقق من PM2
pm2 logs promohive --lines 50

# 2. التحقق من الـ process
pm2 show promohive

# 3. إعادة تشغيل بقوة
pm2 delete promohive
pm2 start npm --name promohive -- start
pm2 save

# 4. التحقق من المنافذ
netstat -tulpn | grep 3002

# 5. اختبار من السيرفر نفسه
curl http://localhost:3002/health

# 6. إذا كان هناك خطأ، رؤية السجلات
pm2 logs promohive --err --lines 100
```

---

## حلول إضافية:

### إذا كان هناك port conflict:
```bash
# قتل أي process يستخدم port 3002
sudo fuser -k 3002/tcp

# ثم أعد تشغيل
pm2 delete promohive
pm2 start npm --name promohive -- start
```

### إذا كان هناك خطأ في database:
```bash
# تحقق من connection
sudo -u postgres psql -d promohive -c "SELECT 1;"

# تحقق من environment variables
cat .env | grep DATABASE_URL
```

### إذا كان Nginx لا يرى الـ backend:
```bash
# إعادة تشغيل Nginx
sudo systemctl restart nginx

# رؤية سجلات Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## التحقق من أن كل شيء يعمل:

```bash
# 1. PM2 status
pm2 status

# 2. PM2 logs
pm2 logs promohive --lines 20

# 3. Test from server
curl http://localhost:3002/health

# 4. Test from outside (via Nginx)
curl https://globalpromonetwork.store/health

# 5. Check database
sudo -u postgres psql -d promohive -c "SELECT COUNT(*) FROM \"User\";"
```
