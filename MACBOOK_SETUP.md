# 💻 MacBook Development Setup - AC Heating Web Vision

Tento průvodce ti pomůže nastavit development prostředí na MacBooku pro vývoj aplikace.

---

## ✅ Co jsme hotovo na Remote Serveru:

- ✅ Vercel login & link projektu
- ✅ TypeScript chyby opraveny
- ✅ Resend optional initialization
- ✅ **První úspěšný Vercel deployment!** 🎉
- ✅ Preview URL: https://ac-heating-web-vision-n5wlhtchr-masserfxs-projects.vercel.app

---

## 🚀 MacBook Setup - Krok za Krokem

### Krok 1: Clone Repository 📦

```bash
# Přejdi do složky pro projekty
cd ~/Projects  # nebo kde chceš mít projekt

# Clone repository
git clone git@github.com:masserfx/ac-heating-web-vision.git
# nebo
git clone https://github.com/masserfx/ac-heating-web-vision.git

# Vstup do složky
cd ac-heating-web-vision
```

---

### Krok 2: Install Dependencies 📚

```bash
# Install Node.js packages
npm install

# Ověř instalaci
npm list --depth=0
```

**Expected output:**
```
ac-heating-web-new@1.0.0
├── @anthropic-ai/sdk@0.67.0
├── @supabase/supabase-js@2.76.1
├── next@16.0.0
├── react@19.2.0
└── ... (další balíčky)
```

---

### Krok 3: Setup Docker Supabase 🐳

#### A) Install Docker Desktop (pokud ještě nemáš)

1. Stáhni Docker Desktop: https://www.docker.com/products/docker-desktop
2. Nainstaluj a spusť Docker Desktop
3. Ověř instalaci:

```bash
docker --version
# Mělo by vrátit: Docker version 24.x.x
```

#### B) Clone Supabase projekt

```bash
# Vytvoř složku pro Supabase
mkdir -p ~/Projects/supabase
cd ~/Projects/supabase

# Nebo použij existující Supabase setup z remote serveru
# (můžeš zkopírovat docker-compose.yml a .env z remote)
```

#### C) Start Supabase v Dockeru

**Option 1: Supabase CLI (doporučeno)**

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Naviguj do projektu
cd ~/Projects/ac-heating-web-vision

# Init Supabase (pokud není)
supabase init

# Start Supabase services
supabase start

# Výsledek:
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
```

**Option 2: Docker Compose (alternativa)**

```bash
# Zkopíruj docker-compose.yml z remote serveru
scp user@91.99.126.53:~/projects/supabase/docker-compose.yml ~/Projects/supabase/

# Start services
cd ~/Projects/supabase
docker-compose up -d

# Ověř běžící kontejnery
docker ps | grep supabase
```

#### D) Ověř Supabase connection

```bash
# Test connection
curl http://localhost:54321

# Mělo by vrátit Supabase version info

# Nebo otevři Studio v prohlížeči:
open http://localhost:54323
```

---

### Krok 4: Environment Variables 🔐

#### A) Vytvoř .env.local

```bash
cd ~/Projects/ac-heating-web-vision

# Copy example
cp .env.example .env.local

# Nebo vytvoř nový soubor
cat > .env.local << 'EOF'
# Supabase Local (Docker)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Database Direct Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Server Configuration
PORT=3102
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3102

# AI (Optional)
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Tvůj API key

# Email (Optional)
RESEND_API_KEY=re_xxxxx  # Tvůj API key
ADMIN_EMAIL=lhradek@ac-heating.cz

# Backend API (Optional)
BACKEND_URL=http://localhost:8000
EOF

# Edit soubor s tvými API keys
nano .env.local  # nebo code .env.local
```

**DŮLEŽITÉ:**
- `.env.local` je v `.gitignore` - **NIKDY ho necommituj!**
- Supabase keys jsou defaultní Docker keys (OK pro local dev)
- Doplň své vlastní ANTHROPIC_API_KEY a RESEND_API_KEY

---

### Krok 5: Apply Database Migrations 📊

```bash
cd ~/Projects/ac-heating-web-vision

# Option 1: Supabase CLI (doporučeno)
supabase db reset  # Aplikuje všechny migrace

# Option 2: Manual SQL
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/migrations/*.sql

# Ověř tabulky
psql postgresql://postgres:postgres@localhost:54322/postgres -c "\dt"

# Měl bys vidět:
# - leads
# - products
# - categories
# - articles
# atd.
```

---

### Krok 6: Start Development Server 🚀

```bash
cd ~/Projects/ac-heating-web-vision

# Start dev server
npm run dev

# Měl bys vidět:
# ▲ Next.js 16.0.0 (Turbopack)
# - Local:   http://localhost:3102
# - Network: http://192.168.x.x:3102
```

**Otevři v prohlížeči:**
```
http://localhost:3102
```

---

### Krok 7: Verify Setup ✅

#### A) Test homepage
```
http://localhost:3102
```
- Měl by se načíst homepage s produkty

#### B) Test Supabase connection
```
http://localhost:3102/produkty
```
- Měly by se načíst produkty z databáze

#### C) Test API routes
```bash
curl http://localhost:3102/api/health
# Mělo by vrátit: {"status":"ok"}
```

#### D) Test Supabase Studio
```
http://localhost:54323
```
- Měl by se otevřít Supabase Studio dashboard

---

## 📁 Project Structure

```
ac-heating-web-vision/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (pages)/        # Route groups
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/             # UI primitives
│   │   └── sections/       # Page sections
│   ├── lib/                # Utilities
│   │   ├── supabase/       # Supabase client
│   │   └── utils.ts        # Helper functions
│   └── styles/             # Global CSS
├── public/                 # Static assets
├── supabase/               # Supabase migrations
│   └── migrations/         # SQL migration files
├── .env.local             # Local environment (DON'T COMMIT!)
├── .env.example           # Example environment
└── package.json           # Dependencies
```

---

## 🔄 Daily Development Workflow

### 1. Start of Day

```bash
# 1. Check Supabase is running
docker ps | grep supabase
# Pokud neběží:
supabase start
# nebo
cd ~/Projects/supabase && docker-compose up -d

# 2. Pull latest changes
cd ~/Projects/ac-heating-web-vision
git pull origin main

# 3. Install new dependencies (if any)
npm install

# 4. Start dev server
npm run dev
```

### 2. During Development

```bash
# Make code changes in src/

# Type check (optional, ale doporučeno)
npm run type-check

# Lint (optional)
npm run lint

# Test build (před commitováním)
npm run build
```

### 3. Database Changes

```bash
# Create new migration
supabase migration new add_new_feature

# Edit SQL file
# supabase/migrations/XXXXXX_add_new_feature.sql

# Apply migration locally
supabase db reset

# Test v aplikaci
npm run dev
```

### 4. Commit & Push

```bash
# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main

# Vercel automatically deploys! 🚀
```

---

## 🎯 Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-contact-form

# 2. Make changes
# ... code, code, code ...

# 3. Test locally
npm run type-check
npm run build
npm run dev

# 4. Commit & push
git add .
git commit -m "feat: add new contact form"
git push origin feature/new-contact-form

# 5. Create Pull Request on GitHub
# Vercel creates automatic preview deployment!
# Preview URL: https://ac-heating-web-vision-git-feature-*.vercel.app

# 6. After review, merge to main
git checkout main
git merge feature/new-contact-form
git push origin main

# Production deployment happens automatically! 🎉
```

---

## 🔧 Useful Commands

### Development
```bash
npm run dev              # Start dev server (port 3102)
npm run build            # Build for production
npm start                # Start production server
npm run type-check       # TypeScript validation
npm run lint             # ESLint
```

### Database
```bash
supabase start           # Start Supabase services
supabase stop            # Stop Supabase services
supabase status          # Check services status
supabase db reset        # Apply all migrations
supabase migration new   # Create new migration
```

### Git
```bash
git status               # Check working tree
git log --oneline -10    # Recent commits
git diff                 # Show changes
git checkout -b feature  # Create new branch
git push origin main     # Push to GitHub
```

### Vercel (optional)
```bash
vercel                   # Deploy preview
vercel --prod            # Deploy to production
vercel logs              # View deployment logs
```

---

## 🚨 Troubleshooting

### Problem: Port 3102 je již používán
```bash
# Najdi proces
lsof -ti :3102

# Ukonči proces
lsof -ti :3102 | xargs kill -9

# Nebo změň port v package.json
"dev": "next dev -p 3103"
```

### Problem: Supabase neběží
```bash
# Check Docker Desktop is running
docker ps

# Restart Supabase
supabase stop
supabase start

# Nebo Docker Compose
docker-compose restart
```

### Problem: Module not found
```bash
# Clear cache a reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Problem: Database connection error
```bash
# Check Supabase is running
curl http://localhost:54321

# Check .env.local has correct DATABASE_URL
cat .env.local | grep DATABASE_URL

# Recreate database
supabase db reset
```

---

## 📚 Resources

### Documentation
- **Next.js 16:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **React 19:** https://react.dev/

### Project Docs
- `DEPLOYMENT_GUIDE.md` - Kompletní deployment průvodce
- `VERCEL_ENV_SETUP.md` - Vercel ENV variables
- `QUICK_REFERENCE.md` - Rychlé příkazy
- `CLAUDE.md` - Project context pro Claude

### URLs
- **Local App:** http://localhost:3102
- **Supabase Studio:** http://localhost:54323
- **Vercel Preview:** https://ac-heating-web-vision-*.vercel.app
- **Vercel Production:** https://ac-heating-web-vision.vercel.app

---

## 🎉 Next Steps

1. ✅ **Clone repository** na MacBook
2. ✅ **Install dependencies** (npm install)
3. ✅ **Setup Docker Supabase** (supabase start)
4. ✅ **Create .env.local** s credentials
5. ✅ **Apply migrations** (supabase db reset)
6. ✅ **Start dev server** (npm run dev)
7. 🔜 **Make first change** a push na GitHub
8. 🔜 **Watch automatic Vercel deployment** 🚀

---

## 💡 Pro Tips

### VS Code Extensions (doporučeno)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- TypeScript Error Translator

### Keyboard Shortcuts
- `⌘ + S` - Save (auto-refresh in browser)
- `⌘ + Shift + P` - Command palette
- `⌘ + `` ` `` - Toggle terminal
- `⌘ + T` - Quick file open

### Hot Reload
Next.js má automatický hot reload - změny se projeví okamžitě v prohlížeči!

---

**Poslední update:** 2025-11-06
**Status:** Ready for MacBook development setup
**First successful Vercel deploy:** ✅ DONE!
