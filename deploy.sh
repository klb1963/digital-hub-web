#!/bin/bash

# ---------------------------
# Deploy static build to hub.leonidk.de
# ---------------------------

set -e

SERVER="digital-hub@hub.leonidk.de"
REMOTE_PATH="/var/www/hub.leonidk.de/html"

echo "🚀 Building static site (next build → out/)..."
npm run build

echo "📂 Syncing ./out → $SERVER:$REMOTE_PATH ..."
rsync -avz --delete \
  ./out/ \
  $SERVER:$REMOTE_PATH/

echo "🔄 Reloading nginx on server..."
ssh $SERVER "sudo systemctl reload nginx"

echo "✨ Done! Deployed to https://hub.leonidk.de"