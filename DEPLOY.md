# Deploy krupa.co.in

## Option A — GoDaddy Node.js Hosting (easiest)
1. GoDaddy → **Node.js Hosting** → your app → **Upload zip** → choose `krupa-godaddy.zip`
   (package.json is at the top of the zip, as GoDaddy requires).
2. GoDaddy runs `npm install`, `npm run build`, `npm start` automatically (Node 22).
3. **Settings → Domain** → choose `krupa.co.in`. HTTPS is automatic.
4. Admin: `https://krupa.co.in/admin` → username `admin`, password is in `.env.production`.
   To change it: edit `.env.production` and upload again.

**Your content:** the database file is created at `data/krupa.db` on first start (copied from `prisma/dev.db`).
Warning: uploading a new zip may reset `data/` on GoDaddy, so anything added through Admin could be lost.
Do your big Admin edits after the final upload.

---

## Option B — Your own VPS with Docker

### 1. Get a server (VPS)
Any Ubuntu 22.04/24.04 VPS with at least 1 GB RAM works, e.g. **GoDaddy VPS**, **Hostinger KVM1**,
**DigitalOcean**, or **AWS Lightsail** (~₹400–600/month).
Note the server's **public IP** (e.g. `139.59.10.20`).

> GoDaddy *shared/cPanel* hosting will NOT run this. It's a Node.js app and needs a VPS.

### 2. Point the domain to the server (GoDaddy)
GoDaddy → My Products → krupa.co.in → **DNS** → edit records:

| Type  | Name | Value              | TTL     |
|-------|------|--------------------|---------|
| A     | @    | YOUR_SERVER_IP     | 600 sec |
| CNAME | www  | krupa.co.in        | 1 hour  |

Delete any other `A @` record or "Parked"/forwarding entry. DNS takes 5–30 minutes.
Check with: `ping krupa.co.in` (it should show your server IP).

### 3. Upload the project
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

### 4. One command to go live
```bash
sudo bash deploy/setup-server.sh your@email.com
```
This installs Docker + Nginx, builds the app, and gets a free HTTPS (SSL) certificate.
It prints your **admin password**. Save it (it's also in `/root/krupa/.env`).

Open **https://krupa.co.in** 🎉
Admin: **https://krupa.co.in/admin** → username `admin` + that password.

### Later: updating the site
Upload the new code over the `krupa` folder, then:
```bash
cd /root/krupa && sudo bash deploy/update.sh
```
Your database is stored in a Docker volume (`krupa-data`) and is kept across updates.

### Useful commands
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
- **No Prisma engine**: database access uses Node 22's built-in SQLite (`lib/db.js`, same query style). Fixes the `libssl.so.1.1` crash on GoDaddy; no native packages needed.
- **Added**: `Dockerfile`, `docker-compose.yml`, Nginx config, setup and update scripts.
- **Next.js 16 fix**: route `params` are now awaited. Before, deity/ashtothara pages and slug APIs (verses, shlokas) were broken.
- **Clear admin errors**: save failures show the real reason (e.g. "name already exists") instead of crashing.
- **English / Tamil**: EN | தமிழ் switch in the top bar (remembered per visitor). All built-in content is translated; Admin forms have optional Tamil fields. UI wording lives in `lib/i18n.js`, content translations in `prisma/tamil-data.json`.
- Your existing content (`prisma/dev.db`) is copied to `data/krupa.db` on first start.
- Scripts: `npm run db:tamil` (fill Tamil translations), `npm run db:seed` (re-add built-in content).
