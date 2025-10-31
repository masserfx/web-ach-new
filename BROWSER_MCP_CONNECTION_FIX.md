# Browser MCP Connection Fix - Kompletní Diagnostika

## 🔍 Situace

**Uživatel hlásí:**
- ✅ Extension nainstalovaná na Macu
- ✅ Host: 91.99.126.53, Port: 8765 (nastaveno správně)
- ✅ Remote server vykazuje aktivitu
- ❌ Ale persistent connection se nezdaří

**Znamená to:** WebSocket se iniciuje → Server to vidí → Ale upgrade na WebSocket protokol selže

---

## 🔧 KROK 1: Diagnostika Remote Serveru (leos spustí SSH)

### Na remote serveru spusť:

```bash
cd ~/ac-heating-web-new
bash BROWSER_MCP_REMOTE_DIAGNOSTICS.sh > /tmp/browsermcp-diag.txt 2>&1

# Otevři výstup
cat /tmp/browsermcp-diag.txt
```

**Co se bude kontrolovat:**
1. Je WebSocket daemon vůbec spuštěný?
2. Na jakém portu a s jakým PID?
3. Jsou tam chyby v logech?
4. Firewall blokuje 8765?
5. Jaká je konfigurace?

### Když máš výstup, poslej mi:
- Status WebSocket daemonu
- Lines s "Connection" nebo "Error"
- Firewall status

---

## 🔧 KROK 2: Diagnostika Mac Chrome Extension

### Na Mac: Otevři DevTools Extension

```
1. Chrome: chrome://extensions
2. Najdi "Browser MCP"
3. Klikni "Inspect views" → "background page"
4. DevTools Console tab
```

### V konzoli spusť:

```javascript
// 1. Zkontroluj config
console.log('Extension Config:', window.mcp?.config);

// 2. Zkontroluj manifest
console.log('Extension ID:', chrome.runtime.id);

// 3. Zkontroluj permissions
chrome.permissions.getAll((perms) => {
  console.log('Permissions:', perms);
});

// 4. Zkontroluj host_permissions
chrome.runtime.getManifest().then(manifest => {
  console.log('Manifest host_permissions:', manifest.host_permissions);
});

// 5. Manuální pokus připojit se
console.log('Attempting manual connection...');
await window.mcp?.connect?.({
  url: 'ws://91.99.126.53:8765',
  timeout: 15000
}).then(
  result => console.log('✅ Connected:', result),
  error => console.error('❌ Failed:', error.message)
);
```

**Co posílej z console:**
- Extension Config
- Extension ID
- Permissions
- host_permissions z manifestu
- Chybová zpráva z connection pokusu

---

## 🔧 KROK 3: Network-Level Diagnostika

### Test 1: Mac Terminal - je server online?

```bash
# Jednoduché připojení na port
nc -zv 91.99.126.53 8765
# Mělo by: Connection successful (or timeout, ale NE "refused")
```

### Test 2: Mac Terminal - WebSocket handshake

```bash
# Curl test s WebSocket headers
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  -H "Origin: http://localhost" \
  http://91.99.126.53:8765/

# Mělo by vrátit:
# HTTP/1.1 101 Switching Protocols  ← TO JE ÚSPĚCH
# connection: upgrade
# upgrade: websocket
```

**Pokud vrátí:**
- `Connection refused` → Firewall blokuje
- `Timeout` → Firewall blokuje (ticho)
- `HTTP 404 / 500` → Server slyší, ale není konfigurovaný
- `101 Switching Protocols` → OK! Problém je v extension

### Test 3: Mac Chrome DevTools Network Tab

```
1. DevTools: Network tab
2. V extension console spusť manuální connect (viz KROK 2)
3. V Network tab by měl být vidět WebSocket request
4. Kontroluj status:
   - Zelené = upgrade OK (101)
   - Červené = error
   - Gray = timeout
```

---

## 🎯 Interpretace Výsledků

### Scénář A: `nc` vrátí "Connection refused"

```
❌ Problém: Firewall/ISP blokuje port 8765
✅ Řešení: SSH tunnel
```

**Setup SSH Tunnel na Macu:**
```bash
# Terminal 1: Vytvoř SSH tunnel
ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53

# Terminal 2: V Chrome extension změní config:
# Host: 127.0.0.1
# Port: 8765
# URL: ws://127.0.0.1:8765

# Zkusit reconnect v extension
```

---

### Scénář B: `nc` OK, ale `curl` vrátí "Timeout" nebo nic

```
❌ Problém: Server přijímá TCP, ale WebSocket upgrade se nezdaří
⚠️  Důvody:
   - Server není správně nakonfigurovaný
   - CORS headers chybí
   - WebSocket handler není aktivní
✅ Řešení: Restartuj Browser MCP daemon
```

**Na remote serveru:**
```bash
# Zastaví daemon
ps aux | grep browsermcp | grep -v grep | awk '{print $2}' | xargs kill -9

# Spusť znovu (zjistit exact command)
# Obvykle: cd ~/.local/lib/browsermcp-enhanced && npm start

# Zkontroluj porty znovu
lsof -i :8765
lsof -i :3005
```

---

### Scénář C: `curl` vrátí "HTTP/1.1 101 Switching Protocols" ✅

```
✅ Server OK!
❌ Problém: Extension manifest nebo permissions
```

**Zkontroluj na Macu (devtools):**

```javascript
// V extension console
chrome.runtime.getManifest((manifest) => {
  console.log('host_permissions:', manifest.host_permissions);
  console.log('permissions:', manifest.permissions);
});
```

Musí obsahovat:
```json
{
  "host_permissions": [
    "ws://91.99.126.53:*/*",
    "http://91.99.126.53:*/*",
    "*://localhost:*/*"
  ]
}
```

Pokud chybí: **Musíme updatovat manifest a reloadnout extension**

---

### Scénář D: Curl vrátí HTTP 404 / 500

```
❌ Problém: Server není nakonfigurovaný na port 8765
✅ Řešení: Zkontroluj config a restart
```

---

## 📋 Checklist Procesu

### Phase 1: Remote Server Diagnostika
- [ ] Spusť `BROWSER_MCP_REMOTE_DIAGNOSTICS.sh`
- [ ] Ověř: Je daemon spuštěný?
- [ ] Ověř: Port 8765 naslouchá?
- [ ] Zkontroluj: Firewall pravidla
- [ ] Zkontroluj: Konfigurace soubor

### Phase 2: Mac Network Test
- [ ] `nc -zv 91.99.126.53 8765` → Connection successful?
- [ ] `curl` s WebSocket headers → Jaký HTTP status?
- [ ] DevTools Network tab → Je vidět WebSocket request?

### Phase 3: Extension Diagnostika
- [ ] DevTools extension console → Jaká je chyba?
- [ ] Manifest host_permissions → Jsou tam správné origin?
- [ ] Extension ID → Je správně?

### Phase 4: Řešení
- [ ] Pokud firewall: SSH tunnel
- [ ] Pokud server config: Restart daemon
- [ ] Pokud manifest: Update permissions
- [ ] Re-test připojení

---

## 🚀 Když bude Fungovat

Uvidíš:
1. **Extension icon** → Status "Connected"
2. **DevTools Network** → WebSocket with 101 status
3. **Admin panel** (91.99.126.53:3100) → Browser MCP "running"
4. **Console** → Žádné CORS/timeout errors

---

## 📞 Co Poslat Zpět

Až proběhneš diagnostiku, posli mi:

1. **Z `BROWSER_MCP_REMOTE_DIAGNOSTICS.sh`:**
   ```
   WebSocket daemon status: [running/stopped]
   PID: [number]
   Listening on: [port]
   Errors in logs: [yes/no, jakých]
   Firewall: [blocking/allowing]
   ```

2. **Z Mac terminal:**
   ```
   nc result: [Connection successful / refused / timeout]
   curl result: [HTTP status code]
   Exact error: [copy-paste]
   ```

3. **Z Chrome extension console:**
   ```
   host_permissions: [list or "missing"]
   Connection error: [exact message]
   ```

Pak mohu navrhnout přesné řešení! 🎯

