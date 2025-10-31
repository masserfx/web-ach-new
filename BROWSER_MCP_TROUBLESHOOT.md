# Browser MCP Troubleshooting - Automatizovaný Průvodce

## ⚡ Quick Start

Máš tři jednoduché testy, které ukazují, kde je problém:

### Test 1: Mac Terminal

```bash
nc -zv 91.99.126.53 8765
```

**Pokud vidíš:**
- ✅ `Connection successful` → Jdi na Test 2
- ❌ `Connection refused` → Jdi na [Řešení: Firewall](#firewall-je-problém)
- ⏱️ `Timeout` → Jdi na [Řešení: Firewall](#firewall-je-problém)

---

### Test 2: Mac Terminal - WebSocket Handshake

```bash
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/ 2>&1 | head -20
```

**Čekej max 3 sekundy, pak Ctrl+C**

**Pokud vidíš:**
- ✅ `HTTP/1.1 101 Switching Protocols` → Server OK! Jdi na Test 3
- ❌ `HTTP/1.1 404` nebo `500` → Jdi na [Řešení: Server Config](#server-nije-správně-nakonfigurovaný)
- ⏱️ Timeout/nic → Jdi na [Řešení: Firewall](#firewall-je-problém)

---

### Test 3: Chrome DevTools - Extension Permissions

V Chrome DevTools extension console:

```javascript
chrome.runtime.getManifest((manifest) => {
  const perms = manifest.host_permissions || [];
  console.log('host_permissions:', perms);
  const has91 = perms.some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);
});
```

**Pokud vidíš:**
- ✅ `✅ 91.99.126.53 allowed: true` → Jdi na [Řešení: Ostatní](#ostatní-možnosti)
- ❌ `✅ 91.99.126.53 allowed: false` → Jdi na [Řešení: Extension Manifest](#extension-manifest-není-správný)

---

## 🔧 Řešení podle příčiny

### ❌ Firewall je Problém

**Příznak:** Test 1 nebo 2 selže

**Řešení: SSH Tunnel**

#### Krok 1: Spusť SSH tunnel na Macu

```bash
# Terminal 1 - nech běžet stále otevřená
ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53
# Mělo by se zavěsit bez output - to je OK!
```

#### Krok 2: Ověř v novém terminálu

```bash
# Terminal 2 - otevři nový tab
nc -zv 127.0.0.1 8765
# Mělo by: Connection successful
```

#### Krok 3: Updatuj Extension Config

1. Chrome: Extensions page
2. Browser MCP: Click "Options" (nebo ikona ⚙️)
3. Změní:
   - Host: `127.0.0.1` (místo 91.99.126.53)
   - Port: `8765` (stejný)
   - URL: `ws://127.0.0.1:8765` (pokud je field)

#### Krok 4: Reconnect v Extension

1. Klikni "Reconnect" button
2. Mělo by se připojit ✅

---

### ❌ Server není správně nakonfigurovaný

**Příznak:** Test 2 vrátí HTTP 404/500 (server je reachable, ale WebSocket se nenabízí)

**Řešení: Restart Browser MCP Daemon**

#### Na Remote Serveru (SSH)

```bash
# SSH na server
ssh -i ~/.ssh/hetzner_server_ed25519 leos@91.99.126.53

# Zastaví stary daemon
ps aux | grep browsermcp | grep -v grep
# Zobrazí něco jako: leos 2391312 0.0 2.5 450000 190000 ... browsermcp-daemon

# Kill ho
kill -9 2391312  # Vrať PID ze výstupu výše

# Ověř že je killed
ps aux | grep browsermcp | grep -v grep
# Mělo by nic nevrátit

# Spusť daemon znovu
cd ~/.local/lib/browsermcp-enhanced
npm start
# Mělo by: "WebSocket server listening on port 8765"

# V novém terminálu ověř
lsof -i :8765
# Mělo by: node ... (LISTEN)
```

#### Na Macu: Reconnect

Teď zkusit v extension znovu "Reconnect"

---

### ❌ Extension Manifest není správný

**Příznak:** Test 3 vrátí `✅ 91.99.126.53 allowed: false`

**Řešení: Update Manifest (na Macu)**

#### Krok 1: Najdi Extension Adresář

```bash
# Mac Terminal
open ~/browsermcp-extension
# Nebo pokud je jinde:
find ~ -name "manifest.json" -path "*browser*" 2>/dev/null | head -3
```

#### Krok 2: Otevři manifest.json v editoru

```json
{
  "manifest_version": 3,
  "name": "Browser MCP",

  // NAJDI "host_permissions" nebo vytvoř ji:
  "host_permissions": [
    "http://localhost:*/*",
    "ws://localhost:*/*",
    "http://127.0.0.1:*/*",
    "ws://127.0.0.1:*/*",
    "http://91.99.126.53:*/*",
    "ws://91.99.126.53:*/*"
  ],

  // AJDI "permissions" section:
  "permissions": [
    "webRequest",
    "webRequestBlocking"
  ]
}
```

#### Krok 3: Reload Extension v Chrome

```
1. Chrome: chrome://extensions
2. Browser MCP extension: Click 🔄 Reload button
3. Mělo by: "Inspect views" → background page console by mělo být čistá
```

#### Krok 4: Test Connection

V extension console:

```javascript
chrome.runtime.getManifest((manifest) => {
  const perms = manifest.host_permissions || [];
  console.log('Updated host_permissions:', perms);
  const has91 = perms.some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);
});
```

Mělo by vrátit: `✅ 91.99.126.53 allowed: true`

---

### ❌ Ostatní Možnosti

**Příznak:** Všechny testy 1-3 OK, ale extension se stále neconnectuje

#### Možnost 1: Extension Timeout je příliš krátký

V extension options (nebo console):

```javascript
// Zjisti aktuální timeout
console.log('Connection timeout:', window.mcp?.config?.timeout);

// Spusť connection s delším timeout
await window.mcp?.connect?.({
  url: 'ws://91.99.126.53:8765',
  timeout: 30000  // 30 sekund místo 10
});
```

Pokud se takhle connectuje → timeout je problém

**Řešení:** Updatuj extension config pro delší timeout

#### Možnost 2: CORS Headers

Server nemusí slat správné CORS headers

**Zkontroluj DevTools Network tab:**

```
1. Chrome DevTools: Network tab
2. Filter: "8765" nebo "ws"
3. Klikni na WebSocket request
4. Headers tab → Response Headers
5. Měl by vidět:
   - access-control-allow-origin: *
   - access-control-allow-methods: GET, POST, OPTIONS
```

Pokud chybí:

**Na Remote Serveru (v config):**

```bash
cat ~/.local/lib/browsermcp-enhanced/config.json | grep -i cors
```

Mělo by obsahovat:

```json
{
  "cors": {
    "enabled": true,
    "origin": "*",
    "credentials": true
  }
}
```

---

## 📊 Diagnostic Tree

```
Test 1 (nc)
├─ ✅ Connection successful
│  └─ Test 2 (curl)
│     ├─ ✅ HTTP 101
│     │  └─ Test 3 (manifest)
│     │     ├─ ✅ allowed
│     │     │  └─ [Ostatní - delší timeout?]
│     │     └─ ❌ not allowed
│     │        └─ [Updatuj manifest]
│     └─ ❌ HTTP 404/500
│        └─ [Restart daemon]
└─ ❌ Connection refused / Timeout
   └─ [Setup SSH tunnel]
```

---

## 🎯 Postup pro Leoše

1. **Proveď testy 1, 2, 3** (copy-paste z výše)
2. **Řekni mi výsledky** (ať vím, co vidíš)
3. **Já vyberu řešení** (podle stromu výše)
4. **Proveď kroky** (budou 3-5 comandů max)
5. **Test reconnect** → ✅ Connected!

---

## 🚨 Pokud Nic Nefunguje

1. Ověř že SSH tunnel je spuštěný:
   ```bash
   ps aux | grep "L 8765" | grep ssh
   ```

2. Ověř že extension vidí server (bez filtru na host):
   ```javascript
   // V extension console
   fetch('http://91.99.126.53:3005/api/status')
     .then(r => r.json())
     .then(d => console.log('HTTP API Works:', d))
     .catch(e => console.error('HTTP API Failed:', e));
   ```

3. Pokud HTTP funguje ale WebSocket ne → server config issue

---

## 📋 Shrnutí

| Test | OK | Řešení |
|------|----|----|
| `nc` failed | ❌ | SSH tunnel |
| `curl` 404/500 | ❌ | Restart daemon |
| Manifest error | ❌ | Update host_permissions |
| Timeout (30s+) | ✅ | Možná v pořádku, čekat déle |
| Všechno OK | ✅ | Mělo by fungovat! |

