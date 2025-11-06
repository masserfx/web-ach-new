# 🚀 Deployment Guide - AC Heating Web Vision

Tento průvodce popisuje kompletní deployment workflow pro vývoj na **MacBooku** a deployment na **Vercel** + **Remote Server**.

---

## 🏗️ Architektura

```
MacBook (Local Dev)           Remote Server (91.99.126.53)
       │                              │
       ├─ Docker Supabase             ├─ Docker Supabase
       ├─ Next.js dev (3102)          ├─ Next.js prod (3100)
       │                              │
       └─── git push ────────► GitHub Repository
                                       │
                                       ├─ Auto-deploy → Vercel (Primary)
                                       └─ Manual deploy → Remote Server (Backup)
```

---

## 📍 ČÁST 1: REMOTE SERVER (91.99.126.53) - Initial Setup

### Předpoklady
- ✅ Vercel CLI nainstalováno: `npm i -g vercel`
- ✅ Git repository nakonfigurováno
- ✅ Docker Supabase běží na portu 54321

---

### Krok 1: Login do Vercel 🔐

```bash
# Spustit Vercel login
vercel login
```

**Co udělat:**
1. Otevře se prohlížeč s Vercel login stránkou
2. Přihlas se přes **GitHub účet** (doporučeno)
3. Potvrď autorizaci v prohlížeči
4. Vrať se do terminálu - mělo by se zobrazit: `Success! Logged in as [username]`

**Ověření:**
```bash
vercel whoami
# Mělo by vrátit: [tvoje-username]
```

---

### Krok 2: Link projekt s Vercel 🔗

```bash
cd ~/ac-heating-web-vision
vercel link
```

**Odpovědi na otázky:**

| Otázka | Odpověď |
|--------|---------|
| `Set up and deploy "~/ac-heating-web-vision"?` | **Y** (Yes) |
| `Which scope do you want to deploy to?` | Vyber svůj **team/personal account** |
| `Link to existing project?` | **N** (No - vytvoříme nový) |
| `What's your project's name?` | **ac-heating-web-vision** |
| `In which directory is your code located?` | **./** (stiskni Enter) |

**Výsledek:**
- Vytvoří se `.vercel/` složka s project ID a org ID
- Projekt je linknutý k Vercel

---

### Krok 3: Přidat .vercel do .gitignore 📝

```bash
# Přidat .vercel do .gitignore (obsahuje credentials)
echo ".vercel" >> .gitignore

# Commit změny
git add .gitignore
git commit -m "chore: Add .vercel to gitignore"
git push origin main
```

**Proč:**
- `.vercel/` obsahuje project credentials (nesmí být v Gitu)
- Každý vývojář si udělá vlastní `vercel link`

---

### Krok 4: První test deployment 🎯

```bash
# Test deployment do Vercel (preview)
vercel

# nebo pro production deployment
vercel --prod
```

**Co se stane:**
- Vercel nahraje kód
- Spustí `npm install`
- Spustí `npm run build`
- Deployne na Vercel CDN
- Vrátí deployment URL: `https://ac-heating-web-vision-xxxxx.vercel.app`

**První deployment selže kvůli chybějícím ENV variables** - to je OK! Opravíme v dalším kroku.

---

### Krok 5: Konfigurace Vercel Environment Variables 🔐

Nyní musíme přejít na **MacBook** a nastavit Supabase Cloud projekty.

---

## 📍 ČÁST 2: MACBOOK - Supabase Cloud Setup

### Krok 1: Vytvoř Supabase Cloud projekty 🌐

#### A) Staging projekt

1. Otevři prohlížeč: https://supabase.com/dashboard
2. Klikni **New Project**
3. Vyplň:
   - **Name**: `ac-heating-staging`
   - **Database Password**: (vygeneruj silné heslo)
   - **Region**: `Europe (Frankfurt)` (nejblíž k ČR)
   - **Pricing Plan**: **Free** (pro start)
4. Klikni **Create new project**
5. Počkej ~2 minuty na vytvoření databáze

#### B) Production projekt

1. Repeat stejné kroky:
   - **Name**: `ac-heating-production`
   - **Database Password**: (jiné heslo než staging!)
   - **Region**: `Europe (Frankfurt)`
   - **Pricing Plan**: **Free** (později upgrade na Pro)
2. Klikni **Create new project**
3. Počkej ~2 minuty

---

### Krok 2: Zkopíruj API credentials 🔑

#### Pro **STAGING** projekt:

1. V Supabase Dashboard → `ac-heating-staging`
2. Klikni **Settings** (levé menu) → **API**
3. Zkopíruj:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (klikni "Reveal")

#### Pro **PRODUCTION** projekt:

1. V Supabase Dashboard → `ac-heating-production`
2. Klikni **Settings** → **API**
3. Zkopíruj stejné hodnoty (budou jiné než staging)

**💾 Ulož si tyto hodnoty někam bezpečně (1Password, Bitwarden, atd.)**

---

### Krok 3: Aplikuj database migrations na Supabase Cloud 📊

#### A) Link local projekt se Supabase Cloud

```bash
# Na MacBooku
cd ~/ac-heating-web-vision

# Install Supabase CLI (pokud ještě nemáš)
brew install supabase/tap/supabase

# Link se STAGING projektem
supabase link --project-ref xxxxx

# Najdi project ref v Supabase Dashboard → Settings → General → Reference ID
```

#### B) Push migrations na Supabase Cloud

```bash
# Push všechny migrace na staging
supabase db push

# Ověř, že migrace proběhly
supabase db pull  # Mělo by říct "Already up to date"
```

#### C) Repeat pro PRODUCTION

```bash
# Link s production projektem
supabase link --project-ref yyyyy

# Push migrations
supabase db push
```

---

### Krok 4: Seed data do Supabase Cloud (optional) 🌱

Pokud máš seed skripty:

```bash
# Spusť seed na staging
npm run seed:business

# Nebo SQL dump z lokální databáze
supabase db dump > local_dump.sql
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres" < local_dump.sql
```

---

## 📍 ČÁST 3: VERCEL DASHBOARD - Environment Variables

### Krok 1: Otevři Vercel Dashboard 🌐

1. Otevři prohlížeč: https://vercel.com/dashboard
2. Najdi projekt: `ac-heating-web-vision`
3. Klikni na projekt
4. Klikni **Settings** (horní menu)
5. Klikni **Environment Variables** (levé menu)

---

### Krok 2: Přidat environment variables pro PREVIEW deployments 🧪

Klikni **Add New** a přidej každou proměnnou:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` (staging) | **Preview** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (staging anon) | **Preview** |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (staging service) | **Preview** |
| `NEXT_PUBLIC_SITE_URL` | `https://ac-heating-web-vision.vercel.app` | **Preview** |
| `NODE_ENV` | `production` | **Preview** |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | **Preview** |
| `RESEND_API_KEY` | `re_...` | **Preview** |
| `ADMIN_EMAIL` | `lhradek@ac-heating.cz` | **Preview** |

**Důležité:**
- Pro každou proměnnou zaškrtni pouze **Preview** checkbox
- **NE Production** (to přidáme v dalším kroku)

---

### Krok 3: Přidat environment variables pro PRODUCTION deployments 🚀

Klikni **Add New** a přidej každou proměnnou s **PRODUCTION** credentials:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yyyyy.supabase.co` (production) | **Production** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (production anon) | **Production** |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (production service) | **Production** |
| `NEXT_PUBLIC_SITE_URL` | `https://ac-heating.cz` | **Production** |
| `NODE_ENV` | `production` | **Production** |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | **Production** |
| `RESEND_API_KEY` | `re_...` | **Production** |
| `ADMIN_EMAIL` | `lhradek@ac-heating.cz` | **Production** |

**Důležité:**
- Pro každou proměnnou zaškrtni pouze **Production** checkbox
- Použij **PRODUCTION Supabase credentials** (ne staging!)

---

### Krok 4: Redeploy s novými ENV variables ♻️

Vercel musí redeploy, aby použil nové ENV variables:

1. V Vercel Dashboard → projekt → **Deployments**
2. Najdi poslední deployment (top of list)
3. Klikni **...** (tři tečky) → **Redeploy**
4. Vyber **Use existing Build Cache** (rychlejší)
5. Klikni **Redeploy**

**Výsledek:**
- Deployment proběhne znovu
- Tentokrát s Supabase Cloud ENV variables
- Měl by úspěšně dokončit ✅

---

## 📍 ČÁST 4: REMOTE SERVER - Optimalizace jako Backup

### Krok 1: Vytvořit deployment script 📜

Na **Remote Serveru** (91.99.126.53):

```bash
cd ~/ac-heating-web-vision

# Vytvořit deployment script
cat > scripts/deploy-remote.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying to Remote Server..."

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "♻️  Restarting PM2..."
pm2 restart ac-heating-web || pm2 start npm --name "ac-heating-web" -- start

echo "✅ Deployment complete!"
echo "🌐 Application running on: https://91.99.126.53:3100"
EOF

# Make executable
chmod +x scripts/deploy-remote.sh
```

---

### Krok 2: Test deployment script 🧪

```bash
# Spustit deployment
./scripts/deploy-remote.sh
```

**Co se stane:**
1. Pull latest code z GitHubu
2. Instaluje npm dependencies
3. Buildne Next.js aplikaci
4. Restartne PM2 proces

---

### Krok 3: Setup PM2 pro auto-restart 🔄

```bash
# PM2 startup (automatické spuštění po restartu serveru)
pm2 startup

# Spustit příkaz, který PM2 vypíše (bude obsahovat sudo)
# Příklad: sudo env PATH=$PATH:/usr/bin pm2 startup...

# Save PM2 proces list
pm2 save

# Ověř status
pm2 list
```

---

## 📍 ČÁST 5: MACBOOK - Local Development Workflow

### Daily workflow 💼

```bash
# 1. Start Docker Supabase (pokud ještě neběží)
docker ps | grep supabase  # Zkontrolovat

# 2. Start Next.js dev server
cd ~/path/to/ac-heating-web-vision
npm run dev  # Běží na http://localhost:3102

# 3. Vývoj kódu
# ... editace souborů ...

# 4. Test
npm run type-check  # TypeScript check
npm run lint        # ESLint
npm run build       # Test production build

# 5. Commit & push
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys to production! 🚀
```

---

### Feature branch workflow 🌿

```bash
# 1. Create feature branch
git checkout -b feature/new-contact-form

# 2. Develop
npm run dev
# ... code changes ...

# 3. Commit & push
git add .
git commit -m "feat: add contact form"
git push origin feature/new-contact-form

# 4. Create Pull Request on GitHub
# Vercel automatically creates PREVIEW deployment
# URL: https://ac-heating-web-vision-git-feature-new-contact-form.vercel.app

# 5. Review → Merge to main
# Vercel automatically deploys to PRODUCTION
```

---

### Database migration workflow 📊

```bash
# 1. Create migration locally
supabase migration new add_contact_form_table

# 2. Edit SQL file
# supabase/migrations/XXXXXX_add_contact_form_table.sql

# 3. Test locally
supabase db reset  # Apply all migrations

# 4. Test app
npm run dev

# 5. Commit & push
git add supabase/migrations/
git commit -m "feat: add contact form table migration"
git push origin main

# 6. Apply to Supabase Cloud (manually)
supabase link --project-ref [staging-ref]
supabase db push

supabase link --project-ref [production-ref]
supabase db push

# 7. Vercel redeploys automatically with new schema
```

---

## 🔄 Deployment Flow Summary

```
┌─────────────────────────────────────────────────────────┐
│                  DEPLOYMENT FLOW                        │
└─────────────────────────────────────────────────────────┘

MacBook (Local Dev)
  ├─ Docker Supabase (localhost:54321)
  ├─ Next.js dev (localhost:3102)
  │
  └─ git push origin main
          │
          ▼
     GitHub Repository
          │
          ├─ Auto-deploy ──► Vercel Preview (feature branches)
          │                  ├─ Supabase Cloud (staging)
          │                  └─ URL: *.vercel.app
          │
          ├─ Auto-deploy ──► Vercel Production (main branch)
          │                  ├─ Supabase Cloud (production)
          │                  └─ URL: ac-heating.cz
          │
          └─ Manual deploy ─► Remote Server (91.99.126.53)
                              ├─ Docker Supabase (local)
                              ├─ Script: ./scripts/deploy-remote.sh
                              └─ URL: 91.99.126.53:3100
```

---

## 🚨 Troubleshooting

### Vercel deployment selhává

```bash
# Check Vercel build logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls

# Redeploy
vercel --prod
```

### Supabase migrations selhávají

```bash
# Check migration status
supabase migration list

# Reset local DB
supabase db reset

# Manual SQL execution
psql "[connection-string]" < supabase/migrations/XXXXX.sql
```

### Remote server deployment selhává

```bash
# SSH to server
ssh user@91.99.126.53

# Check PM2 logs
pm2 logs ac-heating-web

# Restart PM2
pm2 restart ac-heating-web

# Manual build
cd ~/ac-heating-web-vision
npm run build
```

---

## 📊 Environment Variables Reference

### Local Development (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[local-docker-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3102
```

### Vercel Preview
```bash
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
NEXT_PUBLIC_SITE_URL=https://preview.vercel.app
```

### Vercel Production
```bash
NEXT_PUBLIC_SUPABASE_URL=https://production.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
NEXT_PUBLIC_SITE_URL=https://ac-heating.cz
```

### Remote Server (.env.production)
```bash
NEXT_PUBLIC_SUPABASE_URL=http://91.99.126.53:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[remote-docker-key]
NEXT_PUBLIC_SITE_URL=https://91.99.126.53:3100
```

---

## ✅ Checklist

### Initial Setup (jednorázově)
- [ ] Remote: `vercel login`
- [ ] Remote: `vercel link`
- [ ] MacBook: Create Supabase Cloud projects (staging + production)
- [ ] MacBook: Apply migrations to Supabase Cloud
- [ ] Vercel Dashboard: Configure environment variables (Preview + Production)
- [ ] Remote: Create `scripts/deploy-remote.sh`
- [ ] Remote: Setup PM2 auto-restart

### Daily Workflow (MacBook)
- [ ] `npm run dev` (local development)
- [ ] `git add . && git commit -m "message"`
- [ ] `git push origin main` (auto-deploys to Vercel)

### Feature Workflow (MacBook)
- [ ] `git checkout -b feature/name`
- [ ] Develop & test locally
- [ ] `git push origin feature/name`
- [ ] Create Pull Request (auto-creates Vercel preview)
- [ ] Review → Merge to main (auto-deploys to production)

### Manual Remote Deployment (Remote Server)
- [ ] `ssh user@91.99.126.53`
- [ ] `cd ~/ac-heating-web-vision`
- [ ] `./scripts/deploy-remote.sh`

---

## 🎯 Next Steps

1. **Vercel Custom Domain**: Přidat `ac-heating.cz` do Vercel
2. **Supabase Upgrade**: Upgrade na Pro plan pro production
3. **CI/CD Pipeline**: GitHub Actions pro automatizaci
4. **Monitoring**: Vercel Analytics + Sentry error tracking
5. **Backups**: Automatické database backups

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **PM2 Docs**: https://pm2.keymetrics.io/docs

---

**Poslední update:** 2025-11-06
**Autor:** Leo (with Claude Code assistance)
