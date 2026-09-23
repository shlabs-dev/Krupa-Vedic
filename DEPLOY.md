# Deploy krupa.co.in (about 15 minutes)

## 1. Get a server (VPS)
Any Ubuntu 22.04/24.04 VPS with at least 1 GB RAM works, e.g. **GoDaddy VPS**, **Hostinger KVM1**,
**DigitalOcean**, or **AWS Lightsail** (~₹400–600/month).
Note the server's **public IP** (e.g. `139.59.10.20`).

> GoDaddy *shared/cPanel* hosting will NOT run this. It's a Node.js app and needs a VPS.

## 2. Point the domain to the server (GoDaddy)
GoDaddy → My Products → krupa.co.in → **DNS** → edit records:

| Type  | Name | Value              | TTL     |
|-------|------|--------------------|---------|
| A     | @    | YOUR_SERVER_IP     | 600 sec |
| CNAME | www  | krupa.co.in        | 1 hour  |

Delete any other `A @` record or "Parked"/forwarding entry. DNS takes 5–30 minutes.
Check with: `ping krupa.co.in` (it should show your server IP).

## 3. Upload the project
From your laptop (PowerShell / terminal, in the folder with krupa-deploy.zip):
```bash
scp krupa-deploy.zip root@YOUR_SERVER_IP:/root/
ssh root@YOUR_SERVER_IP
```
On the server:
```bash
apt-get install -y unzip
unzip krupa-deploy.zip && cd krupa
```

## 4. One command to go live
```bash
sudo bash deploy/setup-server.sh your@email.com
```
This installs Docker + Nginx, builds the app, and gets a free HTTPS (SSL) certificate.
It prints your **admin password**. Save it (it's also in `/root/krupa/.env`).

Open **https://krupa.co.in** 🎉
Admin: **https://krupa.co.in/admin** → username `admin` + that password.

## Later: updating the site
Upload the new code over the `krupa` folder, then:
```bash
cd /root/krupa && sudo bash deploy/update.sh
```
Your database is stored in a Docker volume (`krupa-data`) and is kept across updates.

## Useful commands
```bash
docker compose logs -f          # view app logs
docker compose restart          # restart app
docker compose ps               # status
# Backup database:
docker cp krupa:/app/data/krupa.db ./backup-$(date +%F).db
```

## What was changed from the original project
- **Admin security**: `/admin` and all write APIs (POST/PATCH/DELETE) now need a password (`proxy.js`). Before, anyone could edit or delete content.
- **Domain**: `metadataBase` set to https://krupa.co.in (`app/layout.js`).
- **Live data**: pages that read the database now load fresh on every request, so admin edits show immediately. Before, they were frozen at build time.
- **Linux-ready**: removed Windows `node_modules`; added Linux Prisma engines; Next.js `standalone` output; updated deprecated config key.
- **Added**: `Dockerfile`, `docker-compose.yml`, Nginx config, setup and update scripts.
- **Next.js 16 fix**: route `params` are now awaited. Before, deity/ashtothara pages and slug APIs (verses, shlokas) were broken.
- **Clear admin errors**: save failures show the real reason (e.g. "name already exists") instead of crashing.
- **English / Tamil**: EN | தமிழ் switch in the top bar (remembered per visitor). All built-in content is translated; Admin forms have optional Tamil fields. UI wording lives in `lib/i18n.js`, content translations in `prisma/tamil-data.json`.
- Your existing content database (`prisma/dev.db`) is used as the starting data.
