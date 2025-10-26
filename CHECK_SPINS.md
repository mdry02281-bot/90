# تحقق من عجلة الحظ

## استخدم هذه الأوامر على السيرفر:

```bash
# التحقق من أن جدول SpinPrize موجود
sudo -u postgres psql -d promohive -c "\dt"

# التحقق من الجوائز
sudo -u postgres psql -d promohive -c "SELECT * FROM \"SpinPrize\";"

# التحقق من الجداول الإضافية
sudo -u postgres psql -d promohive -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

## إذا لم تكن موجودة، شغل seed مرة أخرى:

```bash
cd /root/55
npm run prisma:seed
```
