#!/bin/bash

# 🚀 AC Heating Web Vision - Remote Server Deployment Script
# Usage: ./scripts/deploy-remote.sh

set -e  # Exit on error

echo "════════════════════════════════════════════════════════"
echo "🚀 Deploying AC Heating Web Vision to Remote Server"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest code
echo "📥 Step 1/5: Pulling latest code from GitHub..."
git pull origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git pull successful${NC}"
else
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi
echo ""

# Step 2: Install dependencies
echo "📦 Step 2/5: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
echo ""

# Step 3: Type check
echo "🔍 Step 3/5: Running TypeScript type check..."
npm run type-check
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Type check failed (continuing anyway)${NC}"
fi
echo ""

# Step 4: Build application
echo "🔨 Step 4/5: Building application..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Restart PM2
echo "♻️  Step 5/5: Restarting PM2..."
pm2 restart ac-heating-web 2>/dev/null || pm2 start npm --name "ac-heating-web" -- start
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 restarted${NC}"
else
    echo -e "${RED}❌ PM2 restart failed${NC}"
    exit 1
fi
echo ""

# Show PM2 status
echo "📊 Current PM2 status:"
pm2 list
echo ""

# Show deployment info
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "🌐 Application URLs:"
echo "   - HTTPS: https://91.99.126.53:3100"
echo "   - HTTP:  http://91.99.126.53:3100"
echo ""
echo "📝 View logs:"
echo "   pm2 logs ac-heating-web"
echo ""
echo "🔄 Restart:"
echo "   pm2 restart ac-heating-web"
echo ""
echo "════════════════════════════════════════════════════════"
