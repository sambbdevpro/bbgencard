#!/bin/bash
# ============================================
# BBGenCard - Ubuntu Server Setup Script
# Run: bash deploy-ubuntu.sh
# ============================================

set -e

APP_NAME="bbgencard"
APP_DIR="/var/www/$APP_NAME"
REPO_URL=""  # <-- Đặt URL repo git của bạn ở đây (nếu có)
NODE_VERSION="20"
API_PORT=3001

echo ""
echo "🚀 BBGenCard - Ubuntu Deployment Script"
echo "========================================="
echo ""

# ---- Step 1: Install Node.js ----
echo "[1/7] Installing Node.js $NODE_VERSION..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "  ✓ Node.js already installed: $(node -v)"
fi

# ---- Step 2: Install PM2 ----
echo "[2/7] Installing PM2..."
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
else
  echo "  ✓ PM2 already installed"
fi

# ---- Step 3: Install Nginx ----
echo "[3/7] Installing Nginx..."
if ! command -v nginx &> /dev/null; then
  sudo apt-get update
  sudo apt-get install -y nginx
else
  echo "  ✓ Nginx already installed"
fi

# ---- Step 4: Setup app directory ----
echo "[4/7] Setting up app directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

if [ -n "$REPO_URL" ]; then
  echo "  Cloning from $REPO_URL..."
  git clone $REPO_URL $APP_DIR || (cd $APP_DIR && git pull)
else
  echo "  ⚠  No REPO_URL set. Please copy files manually to $APP_DIR"
  echo "  Example: scp -r ./* user@server:$APP_DIR/"
fi

# ---- Step 5: Install dependencies & build ----
echo "[5/7] Installing dependencies & building..."
cd $APP_DIR
npm install
npm run build

# ---- Step 6: Start API with PM2 ----
echo "[6/7] Starting API server with PM2..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start server.js --name $APP_NAME
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || true

# ---- Step 7: Configure Nginx ----
echo "[7/7] Configuring Nginx..."

sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<NGINX
server {
    listen 80;
    server_name _;  # Thay bằng domain thật: server_name bbgencard.example.com;

    # Frontend (Vite build)
    root $APP_DIR/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 256;
}
NGINX

sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo ""
echo "  Frontend: http://YOUR_SERVER_IP"
echo "  API:      http://YOUR_SERVER_IP/api/generate?bin=559888&quantity=5"
echo ""
echo "  PM2 status: pm2 status"
echo "  PM2 logs:   pm2 logs $APP_NAME"
echo "  Restart:    pm2 restart $APP_NAME"
echo ""
