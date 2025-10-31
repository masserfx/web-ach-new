#!/bin/bash

# PM2 Setup Script for AC Heating Web
# This script sets up PM2 process manager for production deployment

set -e

echo "🚀 AC Heating Web - PM2 Setup"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 is not installed${NC}"
    echo "Installing PM2 globally..."
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed successfully${NC}"
else
    echo -e "${GREEN}✅ PM2 is already installed (version $(pm2 --version))${NC}"
fi

echo ""

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p /home/leos/ac-heating-web-new/logs
echo -e "${GREEN}✅ Logs directory created${NC}"

echo ""

# Stop any existing processes
echo "🛑 Stopping existing PM2 processes..."
pm2 stop all || true
pm2 delete all || true
echo -e "${GREEN}✅ Existing processes stopped${NC}"

echo ""

# Build the application
echo "🏗️  Building production application..."
cd /home/leos/ac-heating-web-new
npm run build
echo -e "${GREEN}✅ Build completed${NC}"

echo ""

# Start production process
echo "🚀 Starting production process..."
pm2 start ecosystem.config.js --only ac-heating-web
echo -e "${GREEN}✅ Production process started${NC}"

echo ""

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save
echo -e "${GREEN}✅ Configuration saved${NC}"

echo ""

# Setup PM2 startup script (requires sudo for first-time setup)
echo "🔧 Setting up PM2 to start on system boot..."
echo -e "${YELLOW}This step requires sudo access (one-time setup)${NC}"
echo "If you don't have sudo access, skip this step and run it manually later:"
echo "  sudo pm2 startup systemd -u leos --hp /home/leos"
echo ""

read -p "Do you want to setup PM2 startup now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo pm2 startup systemd -u leos --hp /home/leos
    echo -e "${GREEN}✅ PM2 startup configured${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped PM2 startup setup${NC}"
fi

echo ""
echo "=============================="
echo -e "${GREEN}✅ PM2 Setup Complete!${NC}"
echo "=============================="
echo ""
echo "Your application is now running at: http://91.99.126.53:3100"
echo ""
echo "📊 Useful PM2 commands:"
echo "  pm2 status              - Show process status"
echo "  pm2 logs                - View logs (all processes)"
echo "  pm2 logs ac-heating-web - View logs (production only)"
echo "  pm2 restart all         - Restart all processes"
echo "  pm2 stop all            - Stop all processes"
echo "  pm2 monit               - Real-time monitoring"
echo ""
echo "🔄 To switch between dev and production:"
echo "  pm2 stop ac-heating-web && pm2 start ac-heating-dev  # Switch to dev"
echo "  pm2 stop ac-heating-dev && pm2 start ac-heating-web  # Switch to prod"
echo ""
