# 🔐 Vercel Environment Variables Setup

Tento průvodce ti pomůže nakonfigurovat environment variables pro Vercel deployment.

---

## 📋 Co budeme potřebovat:

### 1. **Supabase Cloud Credentials**
- Project URL (staging + production)
- Anon Key (staging + production)
- Service Role Key (staging + production)

### 2. **API Keys**
- RESEND_API_KEY (pro email notifikace)
- ANTHROPIC_API_KEY (pro AI chatbot)

### 3. **Admin Email**
- Email pro příjem notifikací

---

## 🚀 Krok 1: Přístup k Vercel Dashboard

1. Otevři prohlížeč: https://vercel.com/dashboard
2. Přihlaš se (pokud nejsi)
3. Najdi projekt: **ac-heating-web-vision**
4. Klikni na projekt
5. Klikni **Settings** (horní menu)
6. Klikni **Environment Variables** (levé menu)

---

## 🔧 Krok 2: Přidat Environment Variables

### A) Pro PREVIEW Deployments (staging)

Klikni **Add New** a přidej každou proměnnou:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://localhost:54321` (DOČASNĚ - dokud není Supabase Cloud) | ✅ Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (z local Docker) | ✅ Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (z local Docker) | ✅ Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://ac-heating-web-vision.vercel.app` | ✅ Preview |
| `NODE_ENV` | `production` | ✅ Preview |
| `RESEND_API_KEY` | `re_xxxxx` (z .env.local) | ✅ Preview |
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` (z .env.local) | ✅ Preview |
| `ADMIN_EMAIL` | `lhradek@ac-heating.cz` | ✅ Preview |

**DŮLEŽITÉ:**
- Pro každou proměnnou zaškrtni pouze **Preview** checkbox
- Supabase credentials jsou z `.env.local` (local Docker - DOČASNÉ ŘEŠENÍ)

---

### B) Pro PRODUCTION Deployments

Klikni **Add New** a přidej stejné proměnné s **Production** hodnotami:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://91.99.126.53:54321` (remote server Docker) | ✅ Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (remote Docker) | ✅ Production |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (remote Docker) | ✅ Production |
| `NEXT_PUBLIC_SITE_URL` | `https://ac-heating.cz` | ✅ Production |
| `NODE_ENV` | `production` | ✅ Production |
| `RESEND_API_KEY` | `re_xxxxx` (z .env.local) | ✅ Production |
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` (z .env.local) | ✅ Production |
| `ADMIN_EMAIL` | `lhradek@ac-heating.cz` | ✅ Production |

**DŮLEŽITÉ:**
- Pro každou proměnnou zaškrtni pouze **Production** checkbox
- Použij **PRODUCTION Remote Server** Supabase credentials

---

## 📝 Kde najít Supabase credentials:

### Local Docker (MacBook):
```bash
# Otevři .env.local
cat ~/.../ac-heating-web-vision/.env.local

# Najdi:
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### Remote Server (91.99.126.53):
```bash
# SSH na remote server
ssh user@91.99.126.53

# Otevři .env.production
cat ~/ac-heating-web-vision/.env.production

# Najdi:
# NEXT_PUBLIC_SUPABASE_URL=http://91.99.126.53:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## ⚡ Krok 3: Redeploy s novými ENV variables

Po přidání všech environment variables:

### Option A: Vercel Dashboard
1. V Vercel Dashboard → projekt → **Deployments**
2. Najdi poslední deployment
3. Klikni **...** (tři tečky) → **Redeploy**
4. Vyber **Use existing Build Cache** (rychlejší)
5. Klikni **Redeploy**

### Option B: CLI (rychlejší)
```bash
# Na remote serveru
cd ~/ac-heating-web-vision
vercel --prod
```

---

## 🎯 Expected Result:

Po redeployu by měl build projít úspěšně:
- ✅ TypeScript kompilace: OK
- ✅ Next.js build: OK
- ✅ Resend client: Optional (varování, pokud není RESEND_API_KEY)
- ✅ Supabase connection: OK (dokud běží Docker na remote)

**Preview URL:** https://ac-heating-web-vision-*.vercel.app
**Production URL:** https://ac-heating-web-vision.vercel.app (později ac-heating.cz)

---

## 🚨 Důležité poznámky:

### ⚠️ Současné omezení:
**Vercel NEMŮŽE přímo přistupovat k Supabase Docker na remote serveru (91.99.126.53:54321)**

**Proč?**
- Remote server Docker Supabase běží na `http://91.99.126.53:54321`
- Vercel serverless functions běží v AWS/Cloud
- Přímý přístup z Vercel na remote server může být blokován firewallem/security

### ✅ Řešení:

**Option 1: Supabase Cloud (DOPORUČENO)**
- Vytvoř Supabase Cloud projekty (staging + production)
- URL: `https://xxxxx.supabase.co`
- Vercel může přistupovat přes HTTPS
- Managed backups, scaling, monitoring

**Option 2: Expose Remote Docker Supabase (alternativa)**
- Konfigurace Nginx reverse proxy na remote serveru
- SSL certifikát pro HTTPS
- Firewall rules pro Vercel IP ranges
- **KOMPLEXNĚJŠÍ A MÉNĚ BEZPEČNÉ**

### 🎯 Recommended Architecture:

```
┌─────────────────────────────────────────────────┐
│         DEVELOPMENT (MacBook)                   │
├─────────────────────────────────────────────────┤
│  Next.js (localhost:3102)                       │
│  Docker Supabase (localhost:54321)              │
│  .env.local                                     │
└─────────────────────────────────────────────────┘
                    │
                    │ git push
                    ▼
┌─────────────────────────────────────────────────┐
│         STAGING (Vercel Preview)                │
├─────────────────────────────────────────────────┤
│  Vercel Deployment (preview URLs)               │
│  Supabase Cloud (staging project)               │
│  https://xxxxx.supabase.co                      │
└─────────────────────────────────────────────────┘
                    │
                    │ merge to main
                    ▼
┌─────────────────────────────────────────────────┐
│         PRODUCTION (Vercel)                     │
├─────────────────────────────────────────────────┤
│  Vercel Deployment (ac-heating.cz)              │
│  Supabase Cloud (production project)            │
│  https://yyyyy.supabase.co                      │
└─────────────────────────────────────────────────┘
                    │
                    │ backup
                    ▼
┌─────────────────────────────────────────────────┐
│         BACKUP (Remote Server)                  │
├─────────────────────────────────────────────────┤
│  Next.js (91.99.126.53:3100)                    │
│  Docker Supabase (91.99.126.53:54321)           │
│  Manual deployment                              │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Next Steps (po aktuálním buildu):

1. ✅ **Přidat ENV variables do Vercel** (tento guide)
2. ✅ **Redeploy na Vercel** (měl by projít)
3. 🔜 **Vytvořit Supabase Cloud projekty** (staging + production)
4. 🔜 **Aktualizovat Vercel ENV** na Supabase Cloud URLs
5. 🔜 **Test funkčnosti** (formuláře, databáze, emaily)

---

## 📚 Reference:

- **Vercel ENV Docs:** https://vercel.com/docs/projects/environment-variables
- **Supabase Cloud:** https://supabase.com/dashboard
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Quick Reference:** `QUICK_REFERENCE.md`

---

**Poslední update:** 2025-11-06
**Status:** Ready for Vercel ENV setup
