# 🚀 Browser MCP Connection Troubleshooting - START HERE

Máš problém: Extension na Macu se neconnectuje k serveru (91.99.126.53:8765).

**Vytvořil jsem kompletní toolkit. Začni právě zde.** ⏬

---

## ⚡ 3 Sekundy na Pochopení

```
Problem:  Extension nefunguje, ale server je aktivní
Solution: Diagnostika v 3 testech
Result:   Přesné řešení (SSH Tunnel / Restart / Config)
```

---

## 🎯 Co Dělat Hned Teď (5 minut)

### 1. Otevři Quick Reference

```bash
open ~/ac-heating-web-new/BROWSER_MCP_QUICK_REF.txt
```

### 2. Proveď 3 Testy

**Test 1** (Mac Terminal - 5 sec):
```bash
nc -zv 91.99.126.53 8765
```

**Test 2** (Mac Terminal - 10 sec):
```bash
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/
```

**Test 3** (Chrome DevTools console - background page):
```javascript
chrome.runtime.getManifest((manifest) => {
  const has91 = (manifest.host_permissions || []).some(p => p.includes('91.99.126.53'));
  console.log('✅ 91.99.126.53 allowed:', has91);
});
```

### 3. Řekni Výsledky

```
Řekni mi:
1. Test 1: [success / refused / timeout]
2. Test 2: [101 / 404 / 500 / timeout]
3. Test 3: [true / false]
```

---

## 📁 Dostupné Soubory

### 🌟 Doporučuji:

1. **BROWSER_MCP_QUICK_REF.txt** ⭐
   - Jedna stránka s vším, co potřebuješ
   - 5-10 minut na čtení
   - Copy-paste príkazy

2. **browser-mcp-cheatsheet.html**
   - Otevři v prohlížeči
   - Klikej na příkazy = kopírování
   - Vizuální přehled

### 📖 Detailnější:

3. **BROWSER_MCP_TROUBLESHOOT.md**
   - Step-by-step řešení
   - Pro každý problém zvlášť
   - Jako návod "IKEA"

4. **BROWSER_MCP_COMMANDS.md**
   - Všechny příkazy na jednom místě
   - Copy-paste ready
   - Organizované podle typu

5. **BROWSER_MCP_CONNECTION_FIX.md**
   - Hluboká analýza
   - Systémové detaily
   - Pro tech-savvy lidi

### 🔧 Nástrojové:

6. **browser-mcp-monitor.sh**
   - Real-time monitoring
   - Spusť a nech běžet
   - Vidíš status každých 5 sec

7. **BROWSER_MCP_REMOTE_DIAGNOSTICS.sh**
   - Diagnostika na serveru
   - Spusť přes SSH
   - Detailní serverové logy

### 📚 Referenční:

8. **BROWSER_MCP_INDEX.md** - Index všech dokumentů
9. **BROWSER_MCP_SETUP_COMPLETE.md** - Co je připraveno
10. **BROWSER_MCP_SETUP.md** - Původní setup guide

---

## 🎯 Podle Situace:

### Situace 1: Nevím, co je problém

```
1. Čti: BROWSER_MCP_QUICK_REF.txt (5 min)
2. Spusť: 3 testy (5 min)
3. Vyhledej: svůj scénář v Quick Ref
4. Čti: Řešení v BROWSER_MCP_TROUBLESHOOT.md
5. Proveď: Kroky (10-15 min)
6. Test: Reconnect → ✅

Čas: ~25 minut
```

### Situace 2: Chci to vidět v prohlížeči

```
1. Otevři: browser-mcp-cheatsheet.html
2. Klikej: Na příkazy = kopírování
3. Spusť: V terminálu
4. Výsledky: Pošli mi
5. Já řeknu: Řešení

Čas: ~10 minut (+ moje řešení)
```

### Situace 3: Chci real-time monitoring

```
1. Spusť: ./browser-mcp-monitor.sh
2. Nech: Běžet v terminálu
3. Vidíš: Status každých 5 sekund
4. Řešení: SSH Tunnel / Restart
5. Uvidíš: Změnu v monitoru

Čas: Průběžný
```

### Situace 4: Chci porozumět detailům

```
1. Čti: BROWSER_MCP_CONNECTION_FIX.md
2. Proveď: Diagnostiku z 12 kroků
3. Zkoumej: Logy, config, firewall
4. Vyvozuj: Co je příčina
5. Implementuj: Řešení

Čas: ~60 minut (detailní)
```

---

## ✅ Nejčastější Řešení

### Pokud Test 1 selže (nc):
```bash
# FIREWALL BLOKUJE - SSH TUNNEL

ssh -i ~/.ssh/hetzner_server_ed25519 -N -L 8765:localhost:8765 leos@91.99.126.53

# Pak v Extension Settings:
# Host: 127.0.0.1
# Port: 8765
# Reconnect!
```

### Pokud Test 2 vrátí 404/500:
```bash
# SERVER CONFIG - RESTART DAEMON

ssh -i ~/.ssh/hetzner_server_ed25519 leos@91.99.126.53
ps aux | grep browsermcp | grep -v grep
kill -9 <PID>
cd ~/.local/lib/browsermcp-enhanced
npm start

# Pak: Reconnect!
```

### Pokud Test 3 vrátí false:
```
# MANIFEST ISSUE - UPDATE PERMISSIONS

1. Otevři: ~/browsermcp-extension/manifest.json
2. Přidej: "http://91.99.126.53:*/*" a "ws://91.99.126.53:*/*"
3. Chrome: chrome://extensions → Reload
4. Pak: Reconnect!
```

---

## 💬 Jak Mi Poslat Informace

Když máš výsledky testů:

**IDEÁLNÍ ZPRÁVA PRO CLAUDU:**
```
Provedu diagnostiku Browser MCP:

Test 1 (nc): Connection successful ✅
Test 2 (curl): HTTP/1.1 101 Switching Protocols ✅
Test 3 (manifest): ✅ 91.99.126.53 allowed: false ❌

SSH tunnel: Nemám spuštěný
Server diagnostika: Neběžela

Řešení: ???
```

Pak řeknu přesně co dělat! 🎯

---

## 📊 Orientace v Souborech

```
~/ac-heating-web-new/

🌟 ZAČNI TADY:
├── START_HERE_BROWSER_MCP.md          ← Právě čteš!
├── BROWSER_MCP_QUICK_REF.txt          ← 5-10 minut
└── browser-mcp-cheatsheet.html        ← Visual guide

📖 POKYNY:
├── BROWSER_MCP_TROUBLESHOOT.md        ← Step-by-step
├── BROWSER_MCP_COMMANDS.md            ← Všechny příkazy
└── BROWSER_MCP_CONNECTION_FIX.md      ← Deep dive

🔍 REFERENCE:
├── BROWSER_MCP_INDEX.md               ← Index
├── BROWSER_MCP_SETUP_COMPLETE.md      ← Status
└── BROWSER_MCP_SETUP.md               ← Původní setup

🔧 NÁSTROJE:
├── browser-mcp-monitor.sh             ← Real-time
└── BROWSER_MCP_REMOTE_DIAGNOSTICS.sh  ← Server diag

📝 KONFIGURACE:
└── .browsermcp-remote.config.json     ← Settings
```

---

## 🏃 Quickest Path to Solution

### Jen 3 Příkazy (5 minut):

```bash
# 1. Test connectivity
nc -zv 91.99.126.53 8765

# 2. Test WebSocket (Ctrl+C po 3 sec)
timeout 3 curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
  -H "Sec-WebSocket-Version: 13" \
  http://91.99.126.53:8765/

# 3. Pošli mi výsledky
```

---

## 🚀 Hotovo!

Máš teď všechno, co potřebuješ:

- ✅ 3 jednoduché testy (5 min)
- ✅ 3 konkrétní řešení (5-30 min)
- ✅ Real-time monitoring
- ✅ Kompletní dokumentace
- ✅ Všechny příkazy ready-to-paste

**Teď je řada na tobě! Spusť testy a řekni výsledky.** 🎯

---

**Všechny soubory jsou v:** `~/ac-heating-web-new/`

**Otázky?** Přečti si relevantní soubor z výšeuvedené tabulky! 📚

Začni s **BROWSER_MCP_QUICK_REF.txt** - máš vše tam! ⬇️

