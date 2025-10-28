# Server Email & DNS Setup (PromoHive)

Important: Do NOT commit real passwords/tokens into Git. Keep secrets in your server `.env` only.

## SMTP (Hostinger)
Add these to your server `.env`:

```
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="promohive@globalpromonetwork.store"
SMTP_PASS="<REPLACE_WITH_REAL_PASSWORD>"
SMTP_FROM="promohive@globalpromonetwork.store"
```

Then restart the app after updating `.env`.

## Cloudflare Nameservers
Set your domain `globalpromonetwork.store` nameservers at the registrar to:

- bingo.ns.cloudflare.com
- mack.ns.cloudflare.com

After propagation, create DNS records in Cloudflare:

- A `@` → your VPS IP (72.60.215.2)
- A `api` → 72.60.215.2 (optional, if separating API)
- CNAME `www` → `globalpromonetwork.store`

For email deliverability (recommended):

- SPF (TXT at root): `v=spf1 include:_spf.mx.hostinger.com ~all`
- DKIM: add Hostinger-provided DKIM record
- DMARC (TXT `_dmarc`): `v=DMARC1; p=quarantine; rua=mailto:postmaster@globalpromonetwork.store`

## Test Email
Use existing endpoints or a small script to send a test email. Check server logs for errors if any.
