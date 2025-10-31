# Vercel Deployment Guide

## Rychlý Start - GitHub Integration (Doporučeno)

### 1. Připojení GitHub repository k Vercel

1. **Jdi na Vercel**: https://vercel.com
2. **Přihlaš se** pomocí GitHub účtu
3. **Import projektu**:
   - Klikni na "Add New..." → "Project"
   - Vyber repository `masserfx/web-ach-new`
   - Klikni "Import"

### 2. Konfigurace Build Settings

Vercel automaticky detekuje Next.js, ale zkontroluj nastavení:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### 3. Environment Variables

V Vercel Project Settings → Environment Variables přidej:

#### Supabase (Produkce)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
```

#### App Configuration
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Optional (AI, Auth)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-random-32-char-string
ADMIN_BYPASS_AUTH=false
```

### 4. Deploy

- **Auto-deploy**: Každý push na `main` branch automaticky spustí deployment
- **Manual deploy**: V Vercel dashboardu klikni "Redeploy"

---

## Alternativa: CLI Deployment

### 1. Instalace Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Link projekt

```bash
cd ~/ac-heating-web-new
vercel link
```

### 4. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

---

## Příprava Produkčního Supabase

Aktuálně používáš **lokální Supabase Docker instance**. Pro produkci potřebuješ:

### 1. Vytvoř Supabase projekt

1. Jdi na https://supabase.com
2. Create New Project
3. Vyber region (Frankfurt pro EU)
4. Vytvoř projekt

### 2. Získej credentials

V Supabase Dashboard → Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon/public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Migrace dat

```bash
# Export local schema
cd ~/projects/supabase
npx supabase db dump > schema.sql

# Import to production
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" < schema.sql
```

---

## Custom Domain (Volitelné)

### 1. V Vercel Dashboard

- Project Settings → Domains
- Add domain: `ac-heating.cz` (příklad)

### 2. Konfigurace DNS

Přidej DNS záznamy u svého registrátora:

```
Type: CNAME
Name: @
Value: cass.vercel-dns.com

Type: CNAME
Name: www
Value: cass.vercel-dns.com
```

---

## Monitoring & Logs

### Vercel Analytics
- Automaticky dostupné v dashboardu
- Real-time traffic monitoring
- Performance metrics

### Logs
- Dashboard → Deployment → Function Logs
- Real-time error tracking

---

## Troubleshooting

### Build Failed

**Chyba: Missing environment variables**
→ Zkontroluj, že všechny required env vars jsou nastavené

**Chyba: Module not found**
→ Zkus `npm install` lokálně a commit `package-lock.json`

### Runtime Errors

**Supabase connection failed**
→ Zkontroluj NEXT_PUBLIC_SUPABASE_URL a ANON_KEY

**NextAuth error**
→ Nastav NEXTAUTH_SECRET a NEXTAUTH_URL

---

## Aktuální Stav

✅ GitHub repository: `masserfx/web-ach-new`
✅ Vercel config: `vercel.json`
✅ Security headers nakonfigurovány
⏳ **Čeká na**: Vercel account setup + GitHub integration
⏳ **Potřebuje**: Produkční Supabase projekt

---

## Next Steps

1. [ ] Přihlaš se na vercel.com s GitHub accountem
2. [ ] Import `masserfx/web-ach-new` repository
3. [ ] Vytvoř produkční Supabase projekt
4. [ ] Nastav environment variables ve Vercel
5. [ ] Deploy a otestuj

**Po dokončení**: Každý push na `main` automaticky deployuje na Vercel!
