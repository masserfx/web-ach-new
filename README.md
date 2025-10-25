# 🚀 AC Heating - Modern Web

Enterprise-grade website built with **Next.js 15**, **AgentKit**, and **AI-powered CMS**.

---

## ✅ Setup Complete!

Project is ready for development on **port 3100**.

### 🌐 URLs:

- **New Next.js site:** http://localhost:3100
- **Old PHP site (unchanged):** http://91.99.126.53:8080
- **Supabase Studio:** http://localhost:54323

---

## 🏗️ Tech Stack

### Core:
- **Next.js 15** (App Router, RSC, Turbopack)
- **React 19** + **TypeScript**
- **TailwindCSS v4** with @tailwindcss/postcss
- **Framer Motion** (animations)

### Database & Backend:
- **Supabase** (self-hosted Docker)
  - PostgreSQL 17
  - Real-time subscriptions
  - Storage
  - Auth
- **tRPC** (type-safe API)
- **Zod** (validation)

### UI Components:
- **Lucide React** (icons)
- **React Hook Form** (forms)
- **Aceternity UI** (coming soon)

### AI Integration:
- **AgentKit** by Anthropic
- **Claude Sonnet 4.5**
- **MCP Servers**:
  - laskobot (browser automation) ✅
  - content-manager
  - seo-analyzer
  - image-optimizer

---

## 🚀 Getting Started

### Development Server:

```bash
npm run dev
```

Běží na: **http://localhost:3100**

### Other Commands:

```bash
npm run build       # Production build
npm run start       # Start production server
npm run lint        # Lint code
npm run type-check  # TypeScript check
```

---

## 📂 Project Structure

```
ac-heating-web-new/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   ├── layout/             # Layout components
│   │   ├── sections/           # Page sections
│   │   ├── content/            # Content components
│   │   ├── forms/              # Forms
│   │   └── admin/              # Admin components
│   │
│   ├── lib/                    # Utilities & configs
│   │   ├── db/                 # Database (Supabase)
│   │   ├── ai/                 # AI agents & MCP
│   │   ├── utils.ts            # Helper functions
│   │   └── ...
│   │
│   ├── styles/                 # Global styles
│   │   └── globals.css         # Tailwind imports
│   │
│   └── types/                  # TypeScript types
│
├── public/                     # Static assets
│   ├── images/
│   └── fonts/
│
├── .env.local                  # Environment variables (DO NOT COMMIT)
├── .env.example                # Example env vars
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase (already configured for local Docker)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_key>
SUPABASE_SERVICE_ROLE_KEY=<your_key>

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Old PHP Site (for migration)
OLD_SITE_URL=http://91.99.126.53:8080

# Server
PORT=3100

# AI (optional - add when ready)
ANTHROPIC_API_KEY=<your_key>
```

---

## 🎯 Development Roadmap

### ✅ Week 1: Foundation + Homepage
- [x] Project setup
- [x] Tailwind CSS v4 configuration
- [x] Supabase connection
- [x] Basic homepage layout
- [ ] Complete homepage sections
- [ ] Animations polish

### 📋 Week 2: Level 1 Pages
- [ ] /produkty/ (Products overview)
- [ ] /blog/ (Blog listing)
- [ ] /o-nas/ (About us)
- [ ] /kontakt/ (Contact + map)
- [ ] /faq/ (FAQ accordion)
- [ ] /bytove-domy/ (Apartment buildings)
- [ ] /pripravit-rozpocet/ (Quote form)
- [ ] /regulace-xcc-new/ (xCC Regulation)

### 📋 Week 3: Content Migration
- [ ] Database schema
- [ ] Migration script (scrape PHP site)
- [ ] Content import
- [ ] SEO setup (sitemap, meta tags)

### 📋 Week 4: AI Integration
- [ ] AgentKit setup
- [ ] MCP servers integration
- [ ] Admin CMS interface

### 📋 Week 5: Polish & Launch
- [ ] Performance optimization
- [ ] Mobile optimization
- [ ] Final testing
- [ ] 🚀 Launch!

---

## 🎨 Design System

### Brand Colors:
```typescript
{
  primary: '#7A4200',    // Hnědá
  secondary: '#4CAF50',  // Zelená
  accent: '#FF6B35',     // Oranžová
  dark: '#1A1A1A',
  light: '#F5F5F5'
}
```

### Typography:
- **Headings:** Inter (variable)
- **Body:** Inter (variable)

### Animations:
- **Entrance:** Fade + slide up
- **Hover:** Scale + glow
- **Scroll:** Parallax + stagger
- **Target:** 60 FPS always

---

## 🔧 Supabase (Local Docker)

### Services:
```bash
# PostgreSQL
Port: 54322
URL: postgresql://postgres:postgres@localhost:54322/postgres

# API Gateway (Kong)
Port: 54321
URL: http://localhost:54321

# Studio (Admin UI)
Port: 54323
URL: http://localhost:54323

# Realtime
WebSocket: ws://localhost:54321/realtime/v1
```

### Management:
```bash
# Check status
docker ps | grep supabase

# Restart services
cd ~/projects/supabase
supabase stop
supabase start

# View logs
docker logs supabase_db_leos
docker logs supabase_kong_leos
```

---

## 📊 Performance Targets

```typescript
{
  lighthouse: {
    performance: 95,
    accessibility: 100,
    seo: 100,
    best_practices: 100
  },

  core_web_vitals: {
    LCP: "< 1.5s",
    FID: "< 100ms",
    CLS: "< 0.1"
  }
}
```

---

## 🚨 Important Notes

### Port Configuration:
- **3100** - New Next.js site (THIS PROJECT)
- **8080** - Old PHP site (UNTOUCHED)
- **54321** - Supabase API
- **54322** - PostgreSQL
- **54323** - Supabase Studio

### DO NOT:
- ❌ Change port 8080 (PHP site must stay untouched)
- ❌ Commit `.env.local` (contains secrets)
- ❌ Push to public repo (proprietary code)

### DO:
- ✅ Use port 3100 for development
- ✅ Test changes locally before deploy
- ✅ Commit frequently with good messages
- ✅ Follow TypeScript strict mode

---

## 📖 Documentation

- **Architecture:** `~/ac-heating-modern-web-architecture.md`
- **Deployment:** `~/ac-heating-deployment-strategy.md`
- **Fast Track Plan:** `~/ac-heating-fast-track-plan.md`

---

## 🆘 Troubleshooting

### Server won't start:
```bash
# Check if port is available
netstat -tlnp | grep 3100

# Kill existing process
pkill -f "next dev"

# Restart
npm run dev
```

### Supabase connection issues:
```bash
# Check Supabase is running
docker ps | grep supabase

# Restart Supabase
cd ~/projects/supabase
supabase restart
```

### Build errors:
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

---

## 📞 Support

**Developer:** Leo
**Project:** AC Heating Modern Web
**Timeline:** 4-5 weeks (Fast Track)
**Status:** ✅ Setup complete - Ready for development!

---

## 🎉 Next Steps

1. **Start development server:** `npm run dev`
2. **Open browser:** http://localhost:3100
3. **Begin Homepage hero section development**
4. **Reference:** Fast Track Plan (Week 1, Day 2-3)

**Let's build something amazing! 🚀**
