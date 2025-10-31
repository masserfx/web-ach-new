# PM2 Development Workflow

## 🎯 Current Setup (Option A)

```
Production Server:  PM2 (always running)
Development Server: Manual npm run dev
```

## 🚀 Quick Start

### Production Server (PM2)
```bash
# Status
pm2 status

# Restart (po build změnách)
npm run build
pm2 restart ac-heating-web

# Logs
pm2 logs ac-heating-web

# Stop (pokud potřebuješ)
pm2 stop ac-heating-web

# Start znovu
pm2 start ac-heating-web
```

### Development Server (Manual)
```bash
# Start dev server
npm run dev

# Server běží na: http://91.99.126.53:3100
# Hot reload aktivní
# Ctrl+C pro stop
```

## 🌐 URL Adresy

| Server | Port | URL | Použití |
|--------|------|-----|---------|
| **Production** | 3000 | http://91.99.126.53:3000 | Pro uživatele, stable |
| **Development** | 3100 | http://91.99.126.53:3100 | Pro vývoj, hot reload |

## 📊 Admin Monitoring

```bash
# Production admin
http://91.99.126.53:3000/admin/server

# Development admin (když běží npm run dev)
http://91.99.126.53:3100/admin/server
```

## 🔄 Typický Workflow

### 1. Každodenní vývoj
```bash
# Production běží pořád v pozadí (port 3000)
pm2 status  # Zkontroluj, že běží

# Start development
cd ~/ac-heating-web-new
npm run dev  # Port 3100

# Vyvíjej... hot reload funguje
# Ctrl+C když jsi hotový
```

### 2. Deploy do production
```bash
# 1. Build nové verze
npm run build

# 2. Restart production serveru
pm2 restart ac-heating-web

# 3. Verify
pm2 logs ac-heating-web
# nebo otevři http://91.99.126.53:3000
```

### 3. Troubleshooting
```bash
# Port 3100 už je obsazený?
lsof -ti :3100 | xargs kill -9

# Production nefunguje?
pm2 restart ac-heating-web
pm2 logs ac-heating-web --lines 50

# Kompletní restart PM2
pm2 restart all

# PM2 status po reboot serveru
pm2 resurrect  # Obnoví uložený stav
```

## 🎮 PM2 Control z Admin UI

V production admin UI (http://91.99.126.53:3000/admin/server) můžeš:
- ✅ Restartovat production server
- ✅ Zobrazit logy
- ✅ Sledovat CPU/Memory
- ✅ Kontrolovat uptime

## 💡 Pro Tips

### Background development
Pokud chceš mít dev server v pozadí bez Claude session:
```bash
# Start v PM2 (dočasně)
pm2 start ecosystem.config.js --only ac-heating-dev

# Když jsi hotový
pm2 stop ac-heating-dev
```

### Quick restart production
```bash
# One-liner pro rebuild + restart
npm run build && pm2 restart ac-heating-web && pm2 logs ac-heating-web --lines 20
```

### Auto-start po server reboot
```bash
# One-time setup (vyžaduje sudo)
sudo pm2 startup systemd -u leos --hp /home/leos
pm2 save
```

## 🔍 Diagnostika

### Production nereaguje
```bash
# 1. Check PM2 status
pm2 status

# 2. Check port
ss -tlnp | grep :3000

# 3. Check logs
pm2 logs ac-heating-web --err

# 4. Hard restart
pm2 delete ac-heating-web
pm2 start ecosystem.config.js --only ac-heating-web
```

### Dev server konflikt
```bash
# Port 3100 obsazený
lsof -ti :3100 | xargs kill -9

# Nebo restart PM2 dev (pokud běží)
pm2 stop ac-heating-dev
```

## 📝 Environment Variables

Production (.env.local):
```bash
PORT=3000
NODE_ENV=production
ADMIN_BYPASS_AUTH=true  # Pro lokální Supabase
```

Development (default):
```bash
PORT=3100
NODE_ENV=development
```

## ✅ Checklist po server reboot

```bash
# 1. Verify Supabase Docker
docker ps | grep supabase

# 2. Restore PM2 processes
pm2 resurrect

# 3. Check production
curl http://localhost:3000

# 4. Start dev pokud potřebuješ
npm run dev
```

## 🚨 Emergency Commands

```bash
# Kill vše na portu 3000
lsof -ti :3000 | xargs kill -9

# Kill vše na portu 3100
lsof -ti :3100 | xargs kill -9

# Restart PM2 daemon
pm2 kill
pm2 resurrect

# Clean restart
pm2 delete all
pm2 start ecosystem.config.js --only ac-heating-web
pm2 save
```

---

**Current Configuration:**
- Production: PM2 managed (auto-restart, monitoring)
- Development: Manual npm run dev (flexibility, hot reload)
- No port conflicts
- Independent operation
