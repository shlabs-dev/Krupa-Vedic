#!/bin/bash
# Run ONCE on a fresh Ubuntu 22.04/24.04 server, from inside the krupa folder:
#   sudo bash deploy/setup-server.sh you@email.com
set -e
EMAIL=${1:?Usage: sudo bash deploy/setup-server.sh your@email.com}
DOMAIN=krupa.co.in

echo "==> Installing Docker, Nginx, Certbot"
apt-get update -y
apt-get install -y ca-certificates curl nginx certbot python3-certbot-nginx
if ! command -v docker >/dev/null; then curl -fsSL https://get.docker.com | sh; fi

echo "==> Preparing .env"
if [ ! -f .env ]; then
  PASS=$(openssl rand -base64 18)
  echo "ADMIN_PASSWORD=$PASS" > .env
  echo "    Admin login -> user: admin   password: $PASS   (saved in .env)"
fi

echo "==> Building and starting the app"
docker compose up -d --build

echo "==> Configuring Nginx"
cp deploy/nginx-krupa.conf /etc/nginx/sites-available/krupa
ln -sf /etc/nginx/sites-available/krupa /etc/nginx/sites-enabled/krupa
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Opening firewall"
if command -v ufw >/dev/null; then ufw allow OpenSSH; ufw allow 'Nginx Full'; fi

echo "==> Getting free HTTPS certificate"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m "$EMAIL" --redirect

echo "✅ Done! Open https://$DOMAIN"
