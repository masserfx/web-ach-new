# Browser MCP Remote Setup - AC Heating

## 🎯 Cíl
Připojit tvůj **lokální Chrome s MCP Extension** na **remote Hetzner server** (91.99.126.53:8765) a ovládat webové stránky vzdáleně z tvého počítače.

---

## 🏗️ Architektura

```
┌─ Tvůj Lokální Počítač ──────────────────┐
│                                          │
│  Chrome Browser                          │
│  ├─ Tab 1: Web content (vidíš UI)        │
│  └─ MCP Extension                        │
│     └─ WebSocket: ws://91.99.126.53:8765 │
│                                          │
└──────────────┬─────────────────────────┘
               │
               │ WebSocket Connection
               │ (port 8765)
               │
┌──────────────▼──────────────────────────┐
│ Remote Hetzner Server                    │
│ IP: 91.99.126.53                         │
│                                          │
│ ├─ WebSocket Daemon (:8765)              │
│ │  └─ Accepts MCP connections            │
│ ├─ HTTP Server (:3005)                   │
│ │  └─ MCP protocol gateway               │
│ ├─ Browser Automation                    │
│ │  └─ Headless Chrome instance           │
│ └─ Admin Panel (:3100)                   │
│    └─ Live monitoring                    │
└──────────────────────────────────────────┘
```

---

## ✅ Prerequisites

### Na Remote Serveru (už hotovo! ✓)
- [x] Browser MCP daemon běží (port 8765)
- [x] HTTP gateway běží (port 3005)
- [x] Chrome extension je připraven
- [x] Swap space je nakonfigurován
- [x] Node.js heap je optimalizován
- [x] Memory je vyčištěna

### Na Tvém Lokálním Počítači
- [ ] Chrome v95+ (nebo Chromium)
- [ ] Browser MCP extension installován
- [ ] Network access na 91.99.126.53:8765

---

## 📋 Setup Instructions

### Step 1: Verify Remote Server is Ready

```bash
# SSH na server
ssh leos@91.99.126.53

# Check WebSocket daemon
lsof -i :8765
# Output: node ... (LISTEN)

# Check HTTP server
lsof -i :3005
# Output: node ... (LISTEN)

# Check memory status
free -h
# Should show: 2GB swap available, <80% memory used
```

### Step 2: Install MCP Extension Locally

1. **Open Chrome Extensions:**
   - URL: `chrome://extensions/`

2. **Enable Developer Mode:**
   - Toggle "Developer mode" (top right)

3. **Load Unpacked Extension:**
   - Click "Load unpacked"
   - Navigate to: `/Users/[username]/.local/lib/browsermcp-enhanced/chrome-extension`
   - (Or copy from remote: `scp -r leos@91.99.126.53:/home/leos/.local/lib/browsermcp-enhanced/chrome-extension ~`)

4. **Verify Extension is Loaded:**
   - You should see "Browser MCP" extension in your extensions list
   - Status: "Enabled"

### Step 3: Configure Extension for Remote

1. **Right-click Extension Icon:**
   - Click "Options" or "Settings"

2. **Configure Server:**
   ```
   Server Type: WebSocket (Unified Mode)
   Server URL: ws://91.99.126.53:8765
   Instance ID: [Auto-generate or custom]
   Mode: Remote
   ```

3. **Save Configuration**

### Step 4: Connect and Test

1. **Open Chrome Console:**
   - DevTools → Console tab

2. **Test Connection:**
   ```javascript
   // In browser console
   await window.mcp.connect();
   // Should return: { connected: true, instanceId: "..." }
   ```

3. **Navigate to Admin Panel:**
   - Open: `http://91.99.126.53:3100/admin/server`
   - You should see live data

### Step 5: Use Browser MCP

1. **Open Any Website:**
   ```javascript
   // Via Claude CLI or Extension UI
   await browser_navigate({ url: 'https://example.com' });
   await screenshot({ format: 'png' });
   ```

2. **You Will See:**
   - Remote website renders in your local Chrome
   - Full visual feedback
   - Ability to click, type, scroll
   - Screenshots & DOM snapshots

---

## 🔧 Configuration Files

### Remote Server Config
```
/home/leos/ac-heating-web-new/.browsermcp-remote.config.json
```

Key settings:
```json
{
  "remoteConfig": {
    "serverUrl": "http://91.99.126.53",
    "websocketPort": 8765,
    "mode": "unified"
  },
  "security": {
    "allowRemoteAccess": true,
    "corsOrigins": ["chrome-extension://*"]
  }
}
```

### MCP Servers Config (Claude Desktop)
```
~/.claude/mcp_servers.json
```

Add or update:
```json
{
  "mcpServers": {
    "browsermcp": {
      "type": "http",
      "url": "http://127.0.0.1:3005/mcp"
    },
    "browsermcp-remote": {
      "type": "websocket",
      "url": "ws://91.99.126.53:8765"
    }
  }
}
```

---

## 🚀 Usage Examples

### Via Claude CLI (from project directory)

```bash
# This runs on REMOTE server but you see UI locally!

# 1. Navigate to AC Heating
claude "use browser_navigate to go to https://ac-heating.cz"

# 2. Take screenshot
claude "screenshot the entire page"

# 3. Analyze page
claude "get snapshot of the page structure"

# 4. Interact
claude "click the 'Kontakt' button and take screenshot"

# 5. Extract data
claude "extract all product prices from the page"
```

### What You See

1. **Local Chrome window** shows the remote website
2. **Console/DevTools** shows MCP commands
3. **Admin panel** (:3100) shows live monitoring

---

## ⚠️ Important Notes

### Security
- ✅ Extension communicates only with configured server
- ✅ No credential storage in extension
- ✅ CORS headers restrict access to chrome-extension only
- ✅ Headless browser is isolated

### Performance
- WebSocket maintains persistent connection
- No repeated handshakes
- Low latency (same network)
- Supports multiple concurrent sessions

### Troubleshooting

**Issue: "Connection refused"**
```bash
# Check if WebSocket daemon is running
lsof -i :8765

# Restart if needed
cd ~/browsermcp-enhanced && ./scripts/deploy
```

**Issue: "Certificate error"**
```
- Using HTTP not HTTPS (correct for local network)
- Or: configure SSL certificate
```

**Issue: "Memory pressure"**
```bash
# Monitor memory
watch -n 1 'free -h'

# Reduce max sessions if needed
# Edit: .browsermcp-remote.config.json
# Set: maxSessions: 5
```

---

## 📊 Monitoring

Check server health anytime:
- Navigate to: `http://91.99.126.53:3100/admin/server`
- Monitor:
  - Browser MCP service status (port 8765)
  - Memory usage
  - Active connections
  - Session count

---

## 🎯 Next Steps

1. ✅ Verify remote server is ready (done)
2. ⏳ Install extension on your local machine
3. ⏳ Configure extension for remote connection
4. ⏳ Test connection
5. ⏳ Start using Browser MCP with Claude!

---

**Status: READY FOR SETUP** ✅
