# Browser MCP - Kompletní Sada Příkazů

Všechny příkazy pro diagnózu a řešení na jednom místě. **Copy-paste ready!**

---

## 🖥️ MAC TERMINAL PŘÍKAZY

### Test 1: Network Connectivity

```bash
nc -zv 91.99.126.53 8765
```

**Výsledky:**
- ✅ `Connection successful` → Port je dostupný
- ❌ `Connection refused` → Firewall blokuje
- ⏱️ `Timeout` → ISP/VPN blokuje

---

### Test 2: WebSocket Handshake

```bash
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/
```

**Výsledky:**
- ✅ `HTTP/1.1 101 Switching Protocols` → Server je správně nakonfigurovaný
- ❌ `HTTP/1.1 404 Not Found` → Daemon není na správném endpointu
- ❌ `HTTP/1.1 500 Internal Server Error` → Daemon má konfigurační problém
- ⏱️ Timeout/nic → Firewall blokuje

---

### Test 3: SSH Tunnel Setup (pokud Test 1 selže)

```bash
# V novém Terminal tabu - nech to běžet!
ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53
```

**Pak v jiném tabu otestuj:**

```bash
# Mělo by vrátit "Connection successful"
nc -zv 127.0.0.1 8765
```

---

### Monitoring - Real-time Status

```bash
# Udělej executable
chmod +x ~/ac-heating-web-new/browser-mcp-monitor.sh

# Spusť (bude kontrolovat každých 5 sekund)
~/ac-heating-web-new/browser-mcp-monitor.sh
```

---

## 🌐 CHROME DEVTOOLS PŘÍKAZY

### Test 3: Extension Manifest & Permissions

V Chrome DevTools extension console:

```javascript
// 1. Check manifest
chrome.runtime.getManifest((manifest) => {
  console.log('=== Extension Manifest ===');
  console.log('host_permissions:', manifest.host_permissions);
  console.log('permissions:', manifest.permissions);

  // Check if 91.99.126.53 is allowed
  const perms = manifest.host_permissions || [];
  const has91 = perms.some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);

  // Check if WebSocket is allowed
  const hasWs = perms.some(p => p.includes('ws://'));
  console.log('✅ WebSocket allowed:', hasWs);
});
```

---

### Test 4: HTTP API Fallback

```javascript
// Test if HTTP API on port 3005 works
fetch('http://91.99.126.53:3005/api/status')
  .then(r => r.json())
  .then(data => {
    console.log('✅ HTTP API Response:', data);
  })
  .catch(error => {
    console.error('❌ HTTP API Failed:', error.message);
  });
```

---

### Test 5: Manual WebSocket Connection

```javascript
// Manually try to connect to WebSocket
console.log('Attempting WebSocket connection...');

const ws = new WebSocket('ws://91.99.126.53:8765/');

ws.onopen = () => {
  console.log('✅ WebSocket Connected!');
  ws.close();
};

ws.onerror = (error) => {
  console.error('❌ WebSocket Error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

// Timeout after 10 seconds
setTimeout(() => {
  if (ws.readyState !== 1) {
    console.error('❌ Connection timeout');
    ws.close();
  }
}, 10000);
```

---

## 🖨️ REMOTE SERVER PŘÍKAZY

### Spuštění Diagnostiky

```bash
# SSH na server
ssh -i ~/.ssh/hetzner_server_ed25519 leos@91.99.126.53

# Spusť diagnostiku
bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh

# Nebo ulož do souboru pro pozdější čtení
bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh > /tmp/diag.txt
cat /tmp/diag.txt
```

---

### Kontrola Daemon Statusu

```bash
# Kontrola zda daemon běží
ps aux | grep browsermcp | grep -v grep

# Detailnější info
lsof -i :8765

# Kontrola portů
netstat -an | grep 8765

# Kontrola proces tree
ps -ef | grep -E "node|chrome|browsermcp" | grep -v grep
```

---

### Restart Daemon

```bash
# Zjisti PID
ps aux | grep browsermcp | grep -v grep
# Výstup: leos 2391312 0.0 2.5 450000 190000 ... browsermcp-daemon

# Kill ho (vrať číslo z výstupu výše)
kill -9 2391312

# Ověř že je zavřený
ps aux | grep browsermcp | grep -v grep
# Mělo by: (nic)

# Spusť znovu
cd ~/.local/lib/browsermcp-enhanced
npm start

# Ověř že je spuštěný
lsof -i :8765
# Mělo by: node ... (LISTEN)
```

---

### Systemd Logs (pokud je daemon spuštěný jako service)

```bash
# Check service status
systemctl --user status browsermcp-daemon.service

# View logs
journalctl --user -u browsermcp-daemon.service -n 50

# Follow logs (real-time)
journalctl --user -u browsermcp-daemon.service -f
```

---

### Configuration Check

```bash
# Check if config exists
cat ~/.local/lib/browsermcp-enhanced/config.json | grep -i port

# Or
cat ~/ac-heating-web-new/.browsermcp-remote.config.json | grep -i websocketport
```

---

### Firewall Check

```bash
# Check UFW (Ubuntu Firewall)
sudo ufw status
sudo ufw status | grep 8765

# Check iptables
sudo iptables -L -n | grep 8765

# Allow port if needed
sudo ufw allow 8765
```

---

### Memory & Performance

```bash
# Check memory
free -h

# Check CPU
top -bn1 | grep "Cpu(s)"

# Monitor in real-time
watch -n 1 'free -h'
```

---

### Kill Process on Port (pokud je obsazený)

```bash
# Zjisti co běží na portu 8765
lsof -i :8765

# Kill to
kill -9 $(lsof -t -i :8765)

# Ověř
lsof -i :8765
# Mělo by: (nic)
```

---

## 🛠️ ŘEŠENÍ PŘÍKAZŮ

### Řešení 1: Firewall (SSH Tunnel)

**Na Macu:**

```bash
# Terminal 1: Spusť tunnel (nech otevřený)
ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53

# Terminal 2: Ověř že funguje
nc -zv 127.0.0.1 8765
```

**V Chrome Extension Settings:**
- Host: `127.0.0.1` (ne 91.99.126.53)
- Port: `8765`
- Click Reconnect → ✅

---

### Řešení 2: Server Config (Restart Daemon)

**Na Remote Serveru:**

```bash
# SSH
ssh -i ~/.ssh/hetzner_server_ed25519 leos@91.99.126.53

# Kill old
ps aux | grep browsermcp | grep -v grep
kill -9 <PID>

# Start new
cd ~/.local/lib/browsermcp-enhanced
npm start

# Wait 3-5 seconds
# Verify
lsof -i :8765
```

**Na Macu: Click Reconnect → ✅**

---

### Řešení 3: Extension Manifest

**Na Macu:**

```bash
# 1. Find extension directory
find ~ -name "manifest.json" -path "*browser*" -path "*extension*" 2>/dev/null | head -3

# 2. Edit the manifest.json file
# Add/update "host_permissions":
# [
#   "http://localhost:*/*",
#   "ws://localhost:*/*",
#   "http://127.0.0.1:*/*",
#   "ws://127.0.0.1:*/*",
#   "http://91.99.126.53:*/*",
#   "ws://91.99.126.53:*/*"
# ]

# 3. Reload extension in Chrome
# chrome://extensions → Browser MCP → Reload button (🔄)

# 4. Test in console (from Test 3 above)
```

---

## 📊 DIAGNOSTIC CHECKLIST

Vytiskni si toto a zaškrtávej jak postupuješ:

```
[ ] Test 1: nc -zv 91.99.126.53 8765
    Result: ___________

[ ] Test 2: curl WebSocket handshake
    Result: ___________

[ ] Test 3: Chrome console manifest test
    Result: ___________

[ ] Identified problem: ___________

[ ] Applied solution: ___________

[ ] Test Reconnect: ___________

[ ] Monitoring: ./browser-mcp-monitor.sh running: [ ] Yes [ ] No
```

---

## 🎯 QUICK REFERENCE TABLE

| Test | Command | Success | Failure |
|------|---------|---------|---------|
| 1 | `nc -zv 91.99.126.53 8765` | "Connection successful" | "refused" or "Timeout" |
| 2 | `curl` WebSocket | "HTTP/1.1 101" | "404" or "500" or timeout |
| 3 | Chrome manifest | "allowed: true" | "allowed: false" |

---

## 💾 COPY-PASTE BLOCKS

### Full Test Sequence (Run in order)

```bash
# Copy & run each one, paste results

# Test 1
echo "=== Test 1: TCP Connectivity ===" && \
nc -zv 91.99.126.53 8765

# Test 2
echo "=== Test 2: WebSocket Handshake ===" && \
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/ | head -10

# Test 3 (Run in Chrome console)
# chrome://extensions → Browser MCP → Inspect → Console → Paste:
# chrome.runtime.getManifest((manifest) => {
#   const has91 = (manifest.host_permissions || []).some(p => p.includes('91.99.126.53'));
#   console.log('✅ 91.99.126.53 allowed:', has91);
# });
```

---

## 📝 NOTES

- **SSH Key:** `~/.ssh/hetzner_server_ed25519`
- **Server:** `leos@91.99.126.53`
- **Port:** `8765` (WebSocket), `3005` (HTTP API), `3100` (Admin)
- **Config:** `~/.local/lib/browsermcp-enhanced/config.json`

---

**Poslední update:** 2024
**Příkazy testovány na:** Mac + Hetzner Linux server

