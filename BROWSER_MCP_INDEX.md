# 🔗 Browser MCP Connection - Úplný Index

## 📚 Dokumentace

Máte případ, kdy Browser MCP extension na Macu se neconnectuje k remote serveru (91.99.126.53:8765), ale remote server vykazuje aktivitu.

Vytvořil jsem kompletní sadu nástrojů a dokumentů pro diagnostiku a řešení.

---

## 📖 Soubory Podle Případu Užití

### 1️⃣ **Začít zde: BROWSER_MCP_QUICK_REF.txt**
```
Rychlá referenční karta se třemi testy
- Test 1: nc (network connectivity)
- Test 2: curl (WebSocket handshake)
- Test 3: manifest (extension permissions)

Rozhodovací strom → Vybere správné řešení
```

**Kdy:** Když chceš nejrychleji zjistit problém
**Čas:** 5-10 minut na testy

---

### 2️⃣ **Detailní Řešení: BROWSER_MCP_TROUBLESHOOT.md**
```
Kompletní step-by-step průvodce
- Firewall problém → SSH tunnel setup
- Server config → Restart daemon
- Manifest issue → Update host_permissions
- Ostatní problémy → Timeout, CORS, atd.
```

**Kdy:** Když znáš problém a chceš detailní instructions
**Čas:** 15-30 minut na vyřešení

---

### 3️⃣ **Hluboká Analýza: BROWSER_MCP_CONNECTION_FIX.md**
```
Profesionální diagnostika se 12 kroky
- Network-level testing
- Chrome DevTools inspection
- Systemd logs
- Firewall rules
- Configuration verification
```

**Kdy:** Když potřebuješ porozumět problému do detailů
**Čas:** 30-60 minut na plnou analýzu

---

### 4️⃣ **Server Diagnostika: BROWSER_MCP_REMOTE_DIAGNOSTICS.sh**
```bash
# Run na remote serveru
bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh

# Zkontroluje:
- Is daemon running?
- Which port?
- Any errors?
- Firewall rules
- Configuration files
```

**Kdy:** Když si nejseš jistý stavem serveru
**Čas:** 2-3 minuty

---

### 5️⃣ **Monitoring Tool: browser-mcp-monitor.sh**
```bash
# Run na Macu
chmod +x browser-mcp-monitor.sh
./browser-mcp-monitor.sh

# Kontinuálně monitoruje každých 5 sekund:
- Port 8765 dostupnost
- WebSocket handshake
- HTTP API fallback
```

**Kdy:** Když chceš vidět real-time stav připojení
**Čas:** Běží neustále, Ctrl+C pro zastavení

---

## 🎯 Doporučený Pracovní Postup

### Scénář A: Neznáš důvod problému

```
1. Přečti si BROWSER_MCP_QUICK_REF.txt (5 min)
2. Spusť 3 testy na Macu
3. Řekni mi výsledky
4. Já řeknu řešení
```

---

### Scénář B: Chceš to vyřešit sám

```
1. Přečti BROWSER_MCP_QUICK_REF.txt
2. Spusť 3 testy
3. Pokud problém identifikován → BROWSER_MCP_TROUBLESHOOT.md
4. Následuj step-by-step kroky
5. Test "Reconnect" → ✅ Connected!
```

---

### Scénář C: Server diagnostika

```
1. SSH na remote server
2. bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh
3. Řekni mi výstup
4. Já řeknu co dělat
```

---

### Scénář D: Kontinuální monitoring

```
1. Na Macu: chmod +x ~/ac-heating-web-new/browser-mcp-monitor.sh
2. ./browser-mcp-monitor.sh
3. Nechat běžet v novém terminal tabu
4. Vidět real-time status připojení
```

---

## 🔍 Klíčové Příkazy (Copy-Paste)

### Testování z Mac Terminálu

```bash
# Test 1: Connectivity
nc -zv 91.99.126.53 8765

# Test 2: WebSocket handshake
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/

# Test 3: SSH Tunnel (pokud Test 1 selže)
ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53
```

### Testování z Chrome Console

```javascript
// Test 3: Extension permissions
chrome.runtime.getManifest((manifest) => {
  const perms = manifest.host_permissions || [];
  const has91 = perms.some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);
});

// Fallback: HTTP API test
fetch('http://91.99.126.53:3005/api/status')
  .then(r => r.json())
  .then(d => console.log('HTTP API:', d))
  .catch(e => console.error('Failed:', e));
```

### Serverové Diagnostiky

```bash
# Spusť na remote serveru:
bash ~/ac-heating-web-new/BROWSER_MCP_REMOTE_DIAGNOSTICS.sh

# Zkontroluj daemon
ps aux | grep browsermcp | grep -v grep

# Zkontroluj port
lsof -i :8765

# Restart daemon
cd ~/.local/lib/browsermcp-enhanced
npm start
```

---

## 📊 Pravděpodobné Příčiny

| Příčina | Symptom | Řešení |
|---------|---------|--------|
| Firewall blokuje 8765 | `nc` selže | SSH Tunnel |
| Server není spuštěný | `curl` nereaguje | Restart daemon |
| Bad manifest | `curl` OK, ale extension neconnecta | Update manifest |
| Timeout příliš krátký | Vše OK, ale timeout | Prodloužit timeout |
| Daemon crashed | Vše bylo OK, teď není | Restart daemon |
| Port conflict | Daemon neběží, inný proces na :8765 | Kill proces, restart |

---

## 🚀 Jakmile Funguje

Uvidíš:

1. ✅ Extension icon ukazuje "Connected" status
2. ✅ Chrome DevTools Network: WebSocket s status `101`
3. ✅ Admin panel (91.99.126.53:3100): Browser MCP "running"
4. ✅ Žádné CORS/timeout errors v konzoli

---

## 💬 Jak Mi Poslat Info

Když máš problém:

```
Řekni mi:
1. Co vidíš v Test 1 (nc): connected / refused / timeout?
2. Co vrátí Test 2 (curl): HTTP status + first line?
3. Co vidíš v Test 3 (manifest): true / false?
4. Chybu z Chrome console: (copy-paste)
5. Máš SSH tunnel spuštěný: yes / no?
```

Pak mohu navrhnout přesné řešení!

---

## 📋 Checklist Procesu

- [ ] Přečetl jsem BROWSER_MCP_QUICK_REF.txt
- [ ] Spustil jsem Test 1 (nc) - výsledek: _________
- [ ] Spustil jsem Test 2 (curl) - výsledek: _________
- [ ] Spustil jsem Test 3 (manifest) - výsledek: _________
- [ ] Identifikoval jsem problém: _________
- [ ] Provádím řešení: _________
- [ ] Test: Reconnect → ✅ Connected!

---

## 📞 Soubory na Jednom Místě

Všechny soubory jsou v `/home/leos/ac-heating-web-new/`:

```
├── BROWSER_MCP_QUICK_REF.txt          ← START HERE!
├── BROWSER_MCP_TROUBLESHOOT.md        ← Detailed solutions
├── BROWSER_MCP_CONNECTION_FIX.md      ← Deep analysis
├── BROWSER_MCP_REMOTE_DIAGNOSTICS.sh  ← Server diagnostics
├── browser-mcp-monitor.sh             ← Real-time monitoring
└── BROWSER_MCP_INDEX.md              ← This file

+ existing:
├── BROWSER_MCP_SETUP.md               ← Initial setup guide
├── MAC_BROWSERMCP_DIAGNOSTICS.md      ← Mac-specific guide
└── .browsermcp-remote.config.json     ← Server configuration
```

---

## ✅ Status

- ✅ Diagnostické soubory vytvořeny
- ✅ Troubleshooting guide hotov
- ✅ Testy připraveny
- ✅ SSH tunnel instructions hotov
- ⏳ Čekám na tvé testy a zpětnou vazbu

---

**Ještě otázky? Přečti si příslušný soubor výše!** 🚀

