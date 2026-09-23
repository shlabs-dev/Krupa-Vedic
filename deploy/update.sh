#!/bin/bash
# Run after uploading new code: sudo bash deploy/update.sh
set -e
docker compose up -d --build
docker image prune -f
echo "✅ Updated"
