# 🚀 AC Heating Web - Deployment Guide

Kompletní průvodce pro deployment webu na nový hardware.

## 📋 Požadavky

### Hardware
- **CPU**: 2+ cores (doporučeno 4+)
- **RAM**: 4GB+ (doporučeno 8GB+)
- **Disk**: 20GB+ volného místa
- **OS**: Linux (Ubuntu 20.04+, Debian 11+) nebo Windows

### Software
- **Node.js**: v20+ (LTS)
- **npm**: v10+
- **Git**: v2.30+
- **PostgreSQL**: v15+ (nebo Supabase cloud)

## 🔧 Instalace na novém HW

### 1. Naklonovat repositář

```bash
git clone <repository-url> ac-heating-web
cd ac-heating-web
```

### 2. Instalovat dependencies

```bash
npm install
```

### 3. Nakonfigurovat prostředí

Vytvořit `.env.local` soubor:

```bash
cp .env.example .env.local
```

Vyplnit následující proměnné:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_SITE_URL=https://ac-heating.cz
NODE_ENV=production
```

### 4. Vyčistit databázová data (DŮLEŽITÉ!)

#### Varianta A: Pomocí TypeScript scriptu (doporučeno)

```bash
# Dry run - zobrazí změny bez aplikace
npm run db:cleanup:preview

# Skutečné čištění
npm run db:cleanup
```

#### Varianta B: Přímý SQL (Supabase SQL Editor)

Spustit soubor: `scripts/db-cleanup/remove-svg-fragments.sql`

### 5. Build aplikace

```bash
npm run build
```

### 6. Spustit produkční server

```bash
npm start
```

Web běží na `http://localhost:3000`

## 🐳 Docker Deployment (doporučeno)

### 1. Build Docker image

```bash
docker build -t ac-heating-web .
```

### 2. Spustit container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=<url> \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=<key> \
  -e SUPABASE_SERVICE_ROLE_KEY=<key> \
  -e NEXT_PUBLIC_SITE_URL=https://ac-heating.cz \
  ac-heating-web
```

### 3. Docker Compose (celý stack)

```bash
docker-compose up -d
```

## ☁️ Vercel Deployment

### 1. Připojit repositář

```bash
vercel
```

### 2. Nastavit environment variables

V Vercel Dashboard → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

### 3. Deploy

```bash
vercel --prod
```

## 🔄 Update na novou verzi

```bash
# 1. Stáhnout novou verzi
git pull origin main

# 2. Aktualizovat dependencies
npm install

# 3. Rebuild
npm run build

# 4. Restart server
pm2 restart ac-heating-web
# nebo
systemctl restart ac-heating-web
```

## 🗄️ Databáze

### Supabase Cloud (doporučeno)
- Přihlásit se na [supabase.com](https://supabase.com)
- Vytvořit nový projekt
- Spustit migrace z `supabase/migrations/`

### Self-hosted PostgreSQL
```bash
# 1. Vytvořit databázi
createdb ac_heating

# 2. Spustit Supabase local
npx supabase start

# 3. Spustit migrace
npx supabase db push
```

## 📊 Monitoring & Logs

### Production Logs
```bash
# PM2
pm2 logs ac-heating-web

# Docker
docker logs -f ac-heating-web

# Systemd
journalctl -u ac-heating-web -f
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## 🔒 Security Checklist

- [ ] `.env.local` není v gitu (je v `.gitignore`)
- [ ] Supabase RLS policies jsou aktivní
- [ ] HTTPS je nakonfigurováno (Nginx/Cloudflare)
- [ ] Security headers jsou nastaveny (v `next.config.ts`)
- [ ] Rate limiting je aktivní
- [ ] CORS je správně nakonfigurován

## 🚨 Troubleshooting

### Port již používán
```bash
# Najít proces
lsof -ti :3000

# Ukončit proces
kill -9 $(lsof -ti :3000)
```

### Build chyby
```bash
# Vyčistit cache
rm -rf .next node_modules
npm install
npm run build
```

### Databázové chyby
```bash
# Zkontrolovat připojení
npm run db:test

# Vyčistit data
npm run db:cleanup
```

### SVG ikony nefungují
```bash
# Spustit cleanup script
npm run db:cleanup
```

## 📞 Podpora

Pro problémy s deploymentem kontaktujte:
- Email: dev@ac-heating.cz
- Dokumentace: `/docs/`
- Issues: GitHub Issues

---

**Poslední aktualizace**: 2025-10-25
**Verze**: 1.0.0
