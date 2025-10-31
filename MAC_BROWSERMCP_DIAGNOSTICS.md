# Browser MCP Remote Connection Diagnostics

## 🔍 Problem
- ✅ Remote server: WebSocket daemon running on :8765
- ✅ Extension installed on Mac
- ✅ Configuration set (Host: 91.99.126.53, Port: 8765)
- ❌ "Reconnect" button doesn't connect
- ⚠️ But server shows activity/attempts

---

## 📋 Diagnostic Checklist for Mac

### Step 1: Test Network Connectivity

```bash
# From your Mac terminal, test if port 8765 is reachable

# Test 1: Simple port connectivity
nc -zv 91.99.126.53 8765
# Expected: Connection successful

# Test 2: WebSocket connectivity with curl
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765

# Expected: Should hang or return upgrade headers (good sign!)
# Ctrl+C to exit
```

### Step 2: Check Extension Configuration

**In Chrome: chrome://extensions/**

1. Find "Browser MCP" extension
2. Click **Details**
3. Check:
   - ✅ "Enabled" toggle is ON
   - ✅ "Allow in incognito" is checked
   - ✅ "Allow access to file URLs" is checked

**Inspect Extension (for debugging):**

1. Click **"Inspect views"** → **"background page"**
2. Open **Console** tab
3. Run:
   ```javascript
   // Check if extension can connect
   console.log('MCP Config:', window.mcp?.config);

   // Try manual connection
   await window.mcp?.connectToServer({
     url: 'ws://91.99.126.53:8765',
     timeout: 10000
   });
   ```

### Step 3: Check Chrome DevTools Network

1. Open **Developer Tools** (Cmd+Option+I)
2. Go to **Network** tab
3. Click **Reconnect** in extension
4. Look for:
   - **WebSocket** connection attempt to `91.99.126.53:8765`
   - Status: Should show upgrade attempt or error
   - If you see RED ❌ = connection failed
   - If hanging = trying to connect (good!)

### Step 4: Check Firewall/Network

```bash
# On Mac: Check if outbound 8765 is blocked

# Method 1: Check System Firewall
System Settings → Network → Firewall → Firewall Options
→ Look for Chrome in allowed apps list
→ If not there: Add Chrome

# Method 2: Check if VPN is blocking
- Disconnect VPN if connected
- Try reconnect
- If works = VPN issue

# Method 3: Check ISP blocking
- Some ISPs block uncommon ports
- Try SSH tunnel instead (see below)
```

### Step 5: Check Extension Permissions

```javascript
// In Chrome DevTools Console while extension is open:

// Check what origins extension can access
chrome.permissions.getAll((perms) => {
  console.log('Extension Permissions:', perms);
});

// Should include: "https://*:8765/*" or "*://91.99.126.53:8765/*"
```

---

## 🔧 Solutions to Try (In Order)

### Solution 1: Restart Chrome & Extension

```bash
# On Mac:

# 1. Completely quit Chrome
Cmd+Q  # or killall Chrome

# 2. Remove extension cache
rm -rf "~/Library/Application Support/Google/Chrome/Default/Local Storage/chrome-extension*"
rm -rf "~/Library/Application Support/Google/Chrome/Default/Web Data"

# 3. Reopen Chrome
open -a Google\ Chrome

# 4. Go to chrome://extensions and reload Browser MCP extension
# Click reload button
```

### Solution 2: Check if SSH Tunnel is Needed

Some networks/firewalls block arbitrary WebSocket ports. Try SSH tunnel:

```bash
# On Mac terminal:

# Create SSH tunnel
ssh -N -L 8765:localhost:8765 leos@91.99.126.53 &

# Now in extension: Configure to connect to
# Host: 127.0.0.1
# Port: 8765

# Test with curl
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://127.0.0.1:8765
```

### Solution 3: Check Extension Manifest

The extension may need updated manifest for remote domains:

**File:** `~/.local/lib/browsermcp-enhanced/chrome-extension/manifest.json`

Should include:
```json
{
  "permissions": [
    "webRequest",
    "webRequestBlocking"
  ],
  "host_permissions": [
    "http://91.99.126.53:*/*",
    "ws://91.99.126.53:*/*",
    "*://localhost:*/*"
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

### Solution 4: Increase Debug Logging

Edit `/home/leos/.local/lib/browsermcp-enhanced/chrome-extension/unified-connection-manager.js`:

Find:
```javascript
const DEBUG = false;
```

Change to:
```javascript
const DEBUG = true; // Enable verbose logging
```

Then reload extension and check console for detailed logs.

---

## 🔗 What "Activity on Remote" Means

When you see activity on remote (port 8765) but extension won't connect:

1. **Extension sends initial WebSocket handshake**
2. **Server receives it** ← This is the "activity"
3. **Connection fails to upgrade** (HTTP to WebSocket)
4. **Extension times out after 10 seconds**

**Likely causes:**
- CORS headers not matching
- WebSocket upgrade being blocked
- Timeout too short (network latency)

---

## 📝 Information to Provide When Creating Issue

If connection still fails, gather this info:

```bash
# On remote server (run these for logs):

# 1. Check daemon logs
tail -100 /tmp/browsermcp-daemon.log

# 2. Check systemd logs
systemctl --user status browsermcp-daemon.service -n 50

# 3. Check if Chrome process exists
ps aux | grep -i chrome

# 4. Network stats
netstat -an | grep 8765

# 5. Check firewall rules
sudo ufw status (if using ufw)
```

```javascript
// On Mac Chrome console:

// Get extension ID
chrome.runtime.id

// Get all active ports
chrome.runtime.getPorts((ports) => {
  console.log('Active ports:', ports);
});

// Get last error
chrome.runtime.lastError && console.log(chrome.runtime.lastError);
```

---

## 🎯 Most Likely Solutions (Try These First)

### #1: Restart Chrome Completely
```bash
killall Chrome
# Wait 2 seconds
open -a Google\ Chrome
```

### #2: Reload Extension
- Go to chrome://extensions
- Find "Browser MCP"
- Click the refresh/reload icon

### #3: Check if Firewall Blocking
- System Settings → Network → Firewall
- Add Chrome to allowed apps

### #4: Use SSH Tunnel
```bash
ssh -N -L 8765:localhost:8765 leos@91.99.126.53
# Then connect to 127.0.0.1:8765 instead
```

---

## ✅ When Connection Works

You'll see:
1. **Extension icon** shows "Connected" status
2. **Chrome DevTools** → Network shows WebSocket with status **101 (Switching Protocols)**
3. **Console** shows no CORS or timeout errors
4. **Admin panel** (91.99.126.53:3100) shows Browser MCP "running"

---

## 🚨 If Still Stuck

Run on remote server:
```bash
# Real-time WebSocket connection monitor
tcpdump -i any -n 'tcp port 8765' -v

# Or with netstat
watch -n 1 'netstat -an | grep 8765'
```

Compare states before/after clicking "Reconnect" to see what's happening.
