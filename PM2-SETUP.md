# PM2 Process Manager Setup Guide

## 🎯 Overview

PM2 (Process Manager 2) je produkční process manager pro Node.js aplikace s vestavěným load balancerem. Řeší problém **circular dependency** v monitoringu - umožňuje monitorovat a restartovat aplikaci bez ovlivnění monitorovacího rozhraní.

## 🔧 Architecture

### Před PM2 (Problém)
```
┌─────────────────────────────────┐
│   Next.js Dev (port 3100)       │
│   ├── Web Application            │
│   └── Admin Monitoring UI        │  ← Problém: Restart aplikace
└─────────────────────────────────┘      shodit i monitoring
```

### Po PM2 (Řešení)
```
┌──────────────────────────────────────┐
│   PM2 Process Manager                │
│   ├── ac-heating-web (production)    │
│   │   └── Port 3100                  │
│   └── ac-heating-dev (development)   │
│       └── Port 3100                  │
└──────────────────────────────────────┘
         ↑
         │ Independent control
         │
┌────────────────────────────────┐
│   Admin UI (běží v aplikaci)   │
│   ├── Start/Stop/Restart        │
│   ├── View Logs                 │
│   └── Monitor Metrics           │
└────────────────────────────────┘
```

**Klíčová výhoda**: Restart aplikace přes PM2 nepřeruší monitoring - PM2 běží nezávisle!

## 📦 Prerequisites

- ✅ **PM2 již nainstalován**: Verze 6.0.13
- ✅ **Node.js**: 20.x nebo vyšší
- ✅ **npm**: Funkční package manager
- ✅ **User permissions**: Běžná uživatelská práva (ne sudo)

## 🚀 Quick Start

### 1. Build produkční aplikace

```bash
cd ~/ac-heating-web-new
npm run build
```

### 2. Spusť setup script

```bash
./scripts/setup-pm2.sh
```

**Setup script provede:**
- ✅ Zastaví existující PM2 procesy
- ✅ Build aplikace (`npm run build`)
- ✅ Spustí `ac-heating-web` proces (production)
- ✅ Uloží PM2 konfiguraci
- ⚠️ Nabídne setup PM2 startup (vyžaduje sudo - volitelné)

### 3. Ověř, že proces běží

```bash
pm2 status
```

Očekávaný výstup:
```
┌─────┬─────────────────────┬─────────┬─────────┬──────────┬────────┬──────┬──────────┐
│ id  │ name                │ mode    │ ↺       │ status   │ cpu    │ mem  │ uptime   │
├─────┼─────────────────────┼─────────┼─────────┼──────────┼────────┼──────┼──────────┤
│ 0   │ ac-heating-web      │ fork    │ 0       │ online   │ 0%     │ 120M │ 10s      │
└─────┴─────────────────────┴─────────┴─────────┴──────────┴────────┴──────┴──────────┘
```

## 🎮 PM2 Commands

### Základní příkazy

```bash
# Status všech procesů
pm2 status

# Restart konkrétního procesu
pm2 restart ac-heating-web

# Stop procesu
pm2 stop ac-heating-web

# Start procesu
pm2 start ecosystem.config.js --only ac-heating-web

# Smazání procesu
pm2 delete ac-heating-web

# Logy (real-time)
pm2 logs ac-heating-web

# Logy (posledních 100 řádků)
pm2 logs ac-heating-web --lines 100

# Real-time monitoring dashboard
pm2 monit

# Detail procesu
pm2 describe ac-heating-web
```

### Přepínání mezi dev a production

```bash
# Switch to development
pm2 stop ac-heating-web
pm2 start ecosystem.config.js --only ac-heating-dev

# Switch to production
pm2 stop ac-heating-dev
pm2 start ecosystem.config.js --only ac-heating-web
```

### Uložení konfigurace

```bash
# Uložit aktuální stav PM2 (automatický restart po reboot)
pm2 save

# Obnovit uložený stav
pm2 resurrect
```

## 🔐 Permissions

### User-level operace (bez sudo)
- ✅ `pm2 start` - Start procesů
- ✅ `pm2 stop` - Stop procesů
- ✅ `pm2 restart` - Restart procesů
- ✅ `pm2 delete` - Smazání procesů
- ✅ `pm2 logs` - Zobrazení logů
- ✅ `pm2 status` - Status procesů
- ✅ `pm2 save` - Uložení konfigurace

### System-level operace (vyžaduje sudo - VOLITELNÉ)
- ⚠️ `pm2 startup` - Auto-start PM2 po system reboot

**Poznámka**: Auto-start je volitelný! Aplikaci můžeš spouštět manuálně po každém rebootu pomocí `pm2 start ecosystem.config.js`.

### Setup Auto-start (volitelné)

Pokud chceš, aby se PM2 automaticky spouštělo po rebootu serveru:

```bash
# 1. Vygeneruj systemd startup script (vyžaduje sudo)
sudo pm2 startup systemd -u leos --hp /home/leos

# 2. Ulož aktuální procesy
pm2 save
```

**Když NE použít auto-start:**
- Nemáš sudo přístup
- Chceš manuální kontrolu nad spouštěním
- Testovací prostředí

**Když použít auto-start:**
- Produkční server
- Chceš minimalizovat downtime po rebootech
- Máš sudo přístup

## 📁 Configuration Files

### ecosystem.config.js

Hlavní PM2 konfigurace s dvěma aplikacemi:

```javascript
module.exports = {
  apps: [
    {
      name: 'ac-heating-web',        // Production
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3100,
      },
    },
    {
      name: 'ac-heating-dev',        // Development
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3100,
        TURBOPACK: '1',
      },
    },
  ],
};
```

### Logy

PM2 automaticky ukládá logy do:
```
~/ac-heating-web-new/logs/
├── pm2-error.log          # Production errors
├── pm2-out.log            # Production output
├── pm2-dev-error.log      # Development errors
└── pm2-dev-out.log        # Development output
```

## 🖥️ Admin UI Integration

Admin monitoring UI (`/admin/server`) nyní obsahuje **PM2 Control Panel**:

### Features:
- ✅ **Live Status** - Real-time status procesů
- ✅ **Start/Stop/Restart** - Ovládání procesů jedním kliknutím
- ✅ **View Logs** - Zobrazení logů v modalu
- ✅ **Metrics** - CPU, Memory, Uptime, Restarts
- ✅ **Auto-refresh** - 5s interval update

### Použití:

1. Otevři admin panel: `http://91.99.126.53:3100/admin/server`
2. Najdi sekci "PM2 Process Manager"
3. Použij tlačítka pro ovládání:
   - ▶️ **Play** - Start stopped procesu
   - ⏹️ **Stop** - Stop running procesu
   - 🔄 **Restart** - Restart procesu
   - 📄 **Logs** - Zobrazit logy
   - 🗑️ **Delete** - Smazat proces z PM2

## 🔍 Troubleshooting

### Problem: Process not starting

```bash
# Check PM2 logs
pm2 logs ac-heating-web --err

# Check if port 3100 is already in use
ss -tlnp | grep :3100

# If port is occupied, kill the process
pm2 delete all
# Or find PID and kill manually
lsof -ti :3100 | xargs kill -9
```

### Problem: Out of memory

```bash
# Check memory usage
pm2 status

# Restart with fresh memory
pm2 restart ac-heating-web

# Or configure max memory in ecosystem.config.js:
# max_memory_restart: '1G'
```

### Problem: PM2 command not found

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### Problem: Permission denied

```bash
# Check file permissions
ls -la ~/ac-heating-web-new/logs/

# Fix if needed
chmod -R 755 ~/ac-heating-web-new/logs/
```

## 📊 Monitoring Best Practices

### 1. Regular Log Rotation

PM2 automaticky rotuje logy, ale můžeš nastavit vlastní politiku:

```bash
# Install PM2 log rotate module
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### 2. Alert Setup

Nastavení alertů při high CPU/Memory:

```bash
# Install PM2 monitoring module
pm2 install pm2-server-monit

# Configure thresholds
pm2 set pm2-server-monit:cpu_threshold 80
pm2 set pm2-server-monit:memory_threshold 80
```

### 3. Regular Monitoring

```bash
# Rychlý check
pm2 status

# Detailní metrics
pm2 monit

# Kompletní info o procesu
pm2 describe ac-heating-web
```

## 🎯 Production Checklist

Před nasazením do produkce:

- [ ] Build aplikace: `npm run build`
- [ ] Test production build: `npm run start`
- [ ] Setup PM2: `./scripts/setup-pm2.sh`
- [ ] Verify process running: `pm2 status`
- [ ] Check logs: `pm2 logs ac-heating-web`
- [ ] Test admin UI: http://91.99.126.53:3100/admin/server
- [ ] Test restart functionality přes UI
- [ ] Setup auto-start (volitelné): `sudo pm2 startup`
- [ ] Save configuration: `pm2 save`
- [ ] Configure log rotation (doporučeno)
- [ ] Setup alerting (doporučeno)

## 🔗 Resources

- [PM2 Official Docs](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/process-management/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 Log Management](https://pm2.keymetrics.io/docs/usage/log-management/)

## 💡 Tips & Tricks

### Rychlé restart celého stacku

```bash
# One-liner pro kompletní restart
pm2 delete all && pm2 start ecosystem.config.js --only ac-heating-web
```

### Export PM2 konfigurace

```bash
# Export current configuration
pm2 save

# Configuration saved to:
# ~/.pm2/dump.pm2
```

### PM2 Dashboard (Web UI)

Pro pokročilé monitoring install PM2 Plus:

```bash
# PM2 Plus registration (optional, free tier available)
pm2 plus
```

## ✅ Summary

**PM2 Setup řeší:**
- ✅ Circular dependency problem v monitoringu
- ✅ Independent process management
- ✅ Auto-restart při crash
- ✅ Zero-downtime restarts
- ✅ Built-in load balancing
- ✅ Log management
- ✅ Metrics & monitoring

**Bez sudo potřebuješ:**
- ✅ Start/Stop/Restart procesů
- ✅ View logs
- ✅ Monitor metrics
- ✅ Save/restore configuration

**Sudo potřebuješ pouze pro:**
- ⚠️ Auto-start po system reboot (VOLITELNÉ)

**Result**: Plně funkční production-ready process management bez nutnosti root přístupu! 🚀
