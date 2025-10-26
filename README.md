# 🌐 AC Heating Web - Modern Next.js Application

Modern, přenositelný web pro AC Heating s.r.o. postavený na Next.js 16, Supabase a TailwindCSS.

## 📋 Přehled

- **Framework**: Next.js 16 (App Router)
- **Databáze**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Deployment**: Vercel / Docker / VPS

## 🚀 Rychlý start

### 1. Instalace

\`\`\`bash
# Klonovat repositář
git clone <repository-url> ac-heating-web
cd ac-heating-web

# Instalovat dependencies
npm install
\`\`\`

### 2. Konfigurace prostředí

Vytvořit \`.env.local\`:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3100
\`\`\`

### 3. Vyčistit databázová data (při první instalaci)

\`\`\`bash
# Preview změn
npm run db:cleanup:preview

# Aplikovat změny
npm run db:cleanup
\`\`\`

### 4. Spustit development server

\`\`\`bash
npm run dev
\`\`\`

Web běží na: \`http://localhost:3100\`

## 📁 Struktura projektu

\`\`\`
ac-heating-web/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React komponenty
│   ├── lib/              # Utilities & helpers
│   └── styles/           # Global CSS
├── public/               # Static assets
├── scripts/              # Utility scripts
│   └── db-cleanup/       # Database cleanup tools
├── supabase/             # Supabase migrations
└── DEPLOYMENT.md         # Deployment guide
\`\`\`

## 🛠️ Dostupné příkazy

| Příkaz                     | Popis                                  |
|----------------------------|----------------------------------------|
| \`npm run dev\`              | Spustit development server             |
| \`npm run build\`            | Build produkční verze                  |
| \`npm start\`                | Spustit produkční server               |
| \`npm run lint\`             | Spustit ESLint                         |
| \`npm run type-check\`       | Type-checking s TypeScript             |
| \`npm run db:cleanup\`       | Vyčistit databázová data (#icon fix)   |
| \`npm run db:cleanup:preview\` | Preview cleanup změn                 |

## 🎨 Klíčové funkce

### ✅ SEO Optimalizováno
- ✅ Dynamické robots.txt
- ✅ XML Sitemap (blog + produkty)
- ✅ Schema.org structured data
- ✅ Security headers
- ✅ Meta tags & Open Graph

### 🚀 Performance
- Server-side rendering (SSR)
- Image optimization (Next.js Image)
- Code splitting
- Turbopack v development

### 🎯 Moderní UX/UI
- Responsive design
- Gradient akcenty
- Smooth animations
- Accessible (WCAG 2.1)

## 🚢 Deployment

Detailní deployment průvodce najdete v [DEPLOYMENT.md](./DEPLOYMENT.md)

### Vercel (doporučeno)
\`\`\`bash
vercel --prod
\`\`\`

### Docker
\`\`\`bash
docker build -t ac-heating-web .
docker run -p 3000:3000 ac-heating-web
\`\`\`

## 🔧 Troubleshooting

### SVG ikony s #icon fragmenty
\`\`\`bash
npm run db:cleanup
\`\`\`

### Port již používán
\`\`\`bash
lsof -ti :3100 | xargs kill -9
\`\`\`

### Build chyby
\`\`\`bash
rm -rf .next node_modules
npm install
npm run build
\`\`\`

## 📝 License

© 2025 AC Heating s.r.o. All rights reserved.

---

**Vytvořeno s ❤️ pro AC Heating s.r.o.**
