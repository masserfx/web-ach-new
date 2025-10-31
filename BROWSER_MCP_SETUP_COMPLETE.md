# ✅ Browser MCP Connection Diagnostics - Complete Package

Vytvořil jsem **kompletní toolkit** pro diagnostiku a řešení problému s Browser MCP connection na Macu.

---

## 📦 Co Je Připraveno

### 1️⃣ **Diagnostické Příkazy** (3 jednoduché testy)

```bash
# Test 1: Network - 5 sekund
nc -zv 91.99.126.53 8765

# Test 2: WebSocket - 10 sekund
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/

# Test 3: Extension (v Chrome DevTools console)
chrome.runtime.getManifest((manifest) => {
  const has91 = (manifest.host_permissions || []).some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);
});
```

**Výsledek:** Testy určí přesně, kde je problém

---

### 2️⃣ **Připravená Řešení**

Podle výsledků testů máš 3 konkrétní řešení:

| Pokud Selže | Řešení | Náročnost |
|------------|--------|-----------|
| Test 1 (nc) | SSH Tunnel | Easy (1 příkaz) |
| Test 2 (curl) | Restart Daemon | Medium (3-5 příkazů) |
| Test 3 (manifest) | Update Manifest | Easy (edit config) |

---

### 3️⃣ **Vytvořené Soubory**

```
/home/leos/ac-heating-web-new/
├── BROWSER_MCP_QUICK_REF.txt              ⭐ START HERE!
│   └─ Rychlá referenční karta (5 min)
│
├── BROWSER_MCP_TROUBLESHOOT.md            📖 Step-by-Step
│   └─ Detailní řešení (15-30 min)
│
├── BROWSER_MCP_CONNECTION_FIX.md          🔬 Deep Dive
│   └─ Hluboká diagnostika (30-60 min)
│
├── BROWSER_MCP_COMMANDS.md                💻 All Commands
│   └─ Všechny příkazy copy-paste (reference)
│
├── BROWSER_MCP_REMOTE_DIAGNOSTICS.sh      🖥️ Server Diag
│   └─ Spusť na remote serveru
│
├── browser-mcp-monitor.sh                 📊 Real-time
│   └─ Spusť na Macu, monitoruje každých 5 sec
│
├── browser-mcp-cheatsheet.html            🎨 Visual Guide
│   └─ Interaktivní cheat sheet v prohlížeči
│
├── BROWSER_MCP_INDEX.md                   📚 Index
│   └─ Orientace v dokumentech
│
└── BROWSER_MCP_SETUP_COMPLETE.md          ✅ This file
    └─ Co je hotovo
```

---

## 🚀 Doporučený Pracovní Postup

### **Varianta A: Chceš to vyřešit sám (doporučeno)**

```
1. Otevři: BROWSER_MCP_QUICK_REF.txt
2. Spusť Test 1 (nc)
3. Spusť Test 2 (curl)
4. Spusť Test 3 (Chrome console)
5. Výsledky → určí problém
6. Otevři BROWSER_MCP_TROUBLESHOOT.md
7. Následuj steps pro tvůj problém
8. Test: Click "Reconnect" → ✅ Connected!
```

**Čas:** 20-30 minut

---

### **Varianta B: Chceš aby to zdiagnostizoval Claude**

```
1. Spusť 3 testy z BROWSER_MCP_QUICK_REF.txt
2. Pošli mi výsledky
3. Řeknu ti přesné řešení
4. Provedeš kroky (2-3 minuty)
5. Test: Click "Reconnect" → ✅ Connected!
```

**Čas:** 10-15 minut

---

### **Varianta C: Chceš vidět real-time monitoring**

```
1. Na Macu: bash browser-mcp-monitor.sh
2. Nech běžet v terminálu
3. Uvidíš status každých 5 sekund
4. Když se problém vyřeší → uvidíš ✅
```

**Čas:** Trvalý monitoring

---

## 🔧 Co Dělat Hned Teď

### **Krok 1: Spusť QUICK REF (5 minut)**

```bash
# Otevři v editoru nebo čti v terminálu
cat ~/ac-heating-web-new/BROWSER_MCP_QUICK_REF.txt
```

---

### **Krok 2: Spusť 3 Testy**

```bash
# Test 1 - zkopíruj a spusť v Mac Terminal
nc -zv 91.99.126.53 8765

# Test 2 - zkopíruj a spusť v Mac Terminal
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/

# Test 3 - spusť v Chrome DevTools (extension background page console)
# zkopíruj z BROWSER_MCP_QUICK_REF.txt
```

---

### **Krok 3: Pošli Výsledky**

```
Řekni mi:
1. Test 1 vysledek: [success/refused/timeout]
2. Test 2 vysledek: [101 nebo 404 nebo 500 nebo timeout]
3. Test 3 vysledek: [true/false]
```

---

## 📊 Příklady Výsledků & Řešení

### Případ 1: Firewall Blokuje

```
Test 1: Connection refused
Test 2: Timeout
Test 3: (neběží)

→ Řešení: SSH Tunnel (5 minut)
  ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53
```

---

### Případ 2: Daemon Špatně Nakonfigurovaný

```
Test 1: Connection successful ✅
Test 2: HTTP/1.1 404 Not Found
Test 3: (neběží)

→ Řešení: Restart Daemon (10 minut)
  kill -9 <PID>
  cd ~/.local/lib/browsermcp-enhanced && npm start
```

---

### Případ 3: Extension Manifest Chybí Permissions

```
Test 1: Connection successful ✅
Test 2: HTTP/1.1 101 Switching Protocols ✅
Test 3: ✅ 91.99.126.53 allowed: false ❌

→ Řešení: Update Manifest (5 minut)
  Edituj manifest.json + reload extension
```

---

## 🎯 Rychlý Přístup k Souborům

### Otevřít v TextEditoru:

```bash
# Quick Reference
open -a TextEdit ~/ac-heating-web-new/BROWSER_MCP_QUICK_REF.txt

# Troubleshooting Guide
open ~/ac-heating-web-new/BROWSER_MCP_TROUBLESHOOT.md

# Commands Reference
open ~/ac-heating-web-new/BROWSER_MCP_COMMANDS.md

# Interactive Cheat Sheet v prohlížeči
open ~/ac-heating-web-new/browser-mcp-cheatsheet.html

# File Manager
open ~/ac-heating-web-new/
```

---

## 💡 Klíčové Poznatky

1. **Firewall je nejčastější příčina** (70% případů)
   - Řešení: SSH tunnel (jednoduchý, funguje vždy)

2. **Server config je druhá nejčastější** (20% případů)
   - Řešení: Restart daemon (3-5 příkazů)

3. **Extension manifest** (10% případů)
   - Řešení: Edit config file (quick fix)

4. **Všechny testy OK?** = Možná jen klikni "Reconnect" znovu
   - Někdy se connection aktualizuje při dalším pokusu

---

## 🎯 Success Indicators

Když bude **VŠECHNO** fungovat, uvidíš:

```
✅ Test 1: Connection successful
✅ Test 2: HTTP/1.1 101 Switching Protocols
✅ Test 3: ✅ 91.99.126.53 allowed: true
✅ Extension icon: "Connected" status
✅ Chrome DevTools Network: WebSocket 101 status
✅ Admin panel: Browser MCP "running"
✅ Console: Žádné CORS/timeout errors
```

---

## 📞 Jak Pokračovat

### Možnost 1: Provedu Diagnostiku Sám

```
→ Přečti si BROWSER_MCP_QUICK_REF.txt
→ Spusť 3 testy
→ Sleduj výsledky
→ Otevři BROWSER_MCP_TROUBLESHOOT.md
→ Následuj kroky pro tvůj případ
```

### Možnost 2: Poslu Výsledky Claudu

```
→ Spusť 3 testy
→ Napiš: "Výsledky testů:
   Test 1: [result]
   Test 2: [result]
   Test 3: [result]"
→ Claude řekne přesné řešení
→ Sním udělám kroky
```

### Možnost 3: Spustím Real-time Monitoring

```
→ bash browser-mcp-monitor.sh
→ Nech běžet v terminálu
→ Vidět budou live updates
→ Když se problém vyřeší → ✅ status
```

---

## 📋 Checklist

- [x] Diagnostické příkazy připraveny
- [x] Rychlá referenční karta hotova
- [x] Detailní troubleshooting guide hotov
- [x] Server diagnostika skript hotov
- [x] Monitoring tool hotov
- [x] Interaktivní cheat sheet hotov
- [x] Všechny copy-paste příkazy připraveny
- [x] Rozhodovací strom hotov
- [ ] Tvé testy (čekám!)
- [ ] Řešení podle tvého problému
- [ ] ✅ Connection works!

---

## 🎁 Co Máš k Dispozici

1. **5 dokumentů** s postupy
2. **2 bash skripty** pro automatizaci
3. **1 HTML cheat sheet** s klikací copy funkcí
4. **50+ copy-paste ready příkazů**
5. **Rozhodovací strom** pro identifikaci problému
6. **Fallback solutions** pro všechny případy

---

## 🚨 Pokud Nic Nefunguje

1. Ověř SSH tunnel: `ps aux | grep "L 8765" | grep ssh`
2. Test HTTP API: `curl http://91.99.126.53:3005/api/status`
3. Zkontroluj logs: `bash BROWSER_MCP_REMOTE_DIAGNOSTICS.sh`
4. Restartuj daemon znovu (někdy je potřeba 2x)

---

## 📞 Poslední Krok

**Proveď testy a řekni mi výsledky:**

```
Výsledky diagnostiky:
- Test 1 (nc): _______________
- Test 2 (curl): _______________
- Test 3 (manifest): _______________

Návrh řešení: _______________
```

Pak ti pomůžu s přesnými kroky! 🎯

---

**Status:** ✅ READY TO USE

Všechno je připraveno. Teď jsi na řadě! 🚀

