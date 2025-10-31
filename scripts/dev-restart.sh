#!/bin/bash
# Dev Server Hard Restart Script
# Kills all dev processes, clears cache, and restarts

echo "🔄 Restarting dev server with cache clear..."

# Kill all Next.js dev processes
echo "⏹️  Stopping all Next.js processes..."
ps aux | grep "next dev" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
lsof -ti :3100 | xargs kill -9 2>/dev/null

# Clear Next.js cache
echo "🧹 Clearing .next cache..."
cd ~/ac-heating-web-new
rm -rf .next

# Wait a moment
sleep 1

# Start dev server
echo "🚀 Starting dev server..."
npm run dev

echo "✅ Dev server restarted on http://91.99.126.53:3100"
