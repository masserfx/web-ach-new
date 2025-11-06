# 📋 Setup Summary - Co máme hotovo a co zbývá

## ✅ Hotovo (Remote Server - 91.99.126.53)

### Infrastruktura
- ✅ Next.js aplikace běží na portu 3102 (dev)
- ✅ Docker Supabase běží (porty 54321, 54322, 54323)
- ✅ GitHub repository synchronizováno (40 commits pushed)
- ✅ Vercel CLI nainstalováno
- ✅ Deployment skripty vytvořeny

### Dokumentace
- ✅ **DEPLOYMENT_GUIDE.md** - Kompletní průvodce deploymentem
- ✅ **QUICK_REFERENCE.md** - Rychlé příkazy
- ✅ **scripts/deploy-remote.sh** - Automatický deployment script

---

## 🔄 Další kroky (podle lokace)

### 📍 REMOTE SERVER (kde jsme TEĎ)

#### Krok 1: Vercel Login & Link (5 minut)

```bash
# 1. Login
vercel login
# → Otevře prohlížeč, přihlas se přes GitHub

# 2. Link projekt
cd ~/ac-heating-web-vision
vercel link
# → Odpověz na otázky (viz DEPLOYMENT_GUIDE.md)

# 3. Přidat .vercel do gitignore
echo ".vercel" >> .gitignore
git add .gitignore
git commit -m "chore: Add .vercel to gitignore"
git push origin main
```

**Status:** ⏳ Čeká na provedení

---

### 📍 MACBOOK (později - po Vercel setupu)

#### Krok 2: Supabase Cloud Setup (15 minut)

**A) Vytvoř projekty v Supabase Dashboard:**
1. Otevři: https://supabase.com/dashboard
2. Vytvoř **staging** projekt: `ac-heating-staging`
3. Vytvoř **production** projekt: `ac-heating-production`
4. Zkopíruj API credentials (Project URL, anon key, service_role key)

**B) Aplikuj migrations:**
```bash
# Na MacBooku
cd ~/ac-heating-web-vision

# Link & push staging
supabase link --project-ref [staging-ref]
supabase db push

# Link & push production
supabase link --project-ref [production-ref]
supabase db push
```

**Status:** ⏳ Čeká na Vercel setup

---

#### Krok 3: Vercel Environment Variables (10 minut)

**V Vercel Dashboard:**
1. Otevři: https://vercel.com/dashboard
2. Projekt: `ac-heating-web-vision` → Settings → Environment Variables
3. Přidat variables pro **Preview** (staging Supabase)
4. Přidat variables pro **Production** (production Supabase)
5. Redeploy aplikaci

**Detaily:** Viz `DEPLOYMENT_GUIDE.md` sekce "ČÁST 3"

**Status:** ⏳ Čeká na Supabase Cloud setup

---

## 🎯 Workflow po setupu

### Daily Development (MacBook)

```bash
# 1. Start dev
npm run dev  # localhost:3102

# 2. Vývoj
# ... editace kódu ...

# 3. Commit & push
git add .
git commit -m "feat: your feature"
git push origin main

# ✨ Vercel automaticky deployne na production!
```

### Feature Branch (MacBook)

```bash
# 1. Create branch
git checkout -b feature/name

# 2. Push
git push origin feature/name

# ✨ Vercel vytvoří preview URL!

# 3. Merge to main
# ✨ Vercel deployne na production!
```

### Manual Remote Deploy (Remote Server)

```bash
# Kdykoli chceš deploynout na remote backup:
ssh user@91.99.126.53
cd ~/ac-heating-web-vision
./scripts/deploy-remote.sh
```

---

## 📊 Architektura po setupu

```
┌─────────────────────────────────────────────────────┐
│              DEPLOYMENT ARCHITECTURE                │
└─────────────────────────────────────────────────────┘

MacBook (Local Dev)
  ├─ Docker Supabase (localhost:54321)
  ├─ Next.js dev (localhost:3102)
  │
  └─ git push origin main
          │
          ▼
     GitHub Repository
          │
          ├─ Auto → Vercel Preview (feature branches)
          │         └─ Supabase Cloud (staging)
          │
          ├─ Auto → Vercel Production (main)
          │         └─ Supabase Cloud (production)
          │
          └─ Manual → Remote Server (backup)
                     └─ Docker Supabase (self-hosted)
```

---

## 💰 Costs Estimate

| Service | Plan | Cost/měsíc |
|---------|------|------------|
| **Vercel** | Hobby (free) | $0 |
| **Supabase Cloud** | Free tier | $0 |
| **Remote VPS** | Already owned | $0 (fixed) |
| **Total** | | **$0/měsíc** |

**Optional upgrades:**
- Vercel Pro: $20/měsíc (1TB bandwidth)
- Supabase Pro: $25/měsíc (8GB DB, backups)

---

## ⏱️ Time Estimate

| Task | Time | Status |
|------|------|--------|
| Vercel login & link | 5 min | ⏳ Pending |
| Supabase Cloud setup | 15 min | ⏳ Pending |
| Vercel ENV variables | 10 min | ⏳ Pending |
| Test deployment | 5 min | ⏳ Pending |
| **Total** | **35 min** | **0% complete** |

---

## 🚨 Důležité poznámky

### ⚠️ Security
- **NIKDY** necommituj `.env.local` do Gitu
- `.vercel/` složka obsahuje credentials → musí být v `.gitignore`
- Používej rozdílné Supabase credentials pro staging a production

### 📝 Best Practices
- Vždy commituj migrations samostatně (snadnější rollback)
- Testuj migrations lokálně před push na Supabase Cloud
- Používej feature branches pro větší změny
- Preview URL posílej klientům na review před merge do main

### 🔄 Backup Strategy
- Remote server je backup (kdyby Vercel měl outage)
- Supabase Cloud má automatic backups (Pro plan)
- Lokální Docker Supabase je pro development

---

## 📚 Reference

- **Kompletní guide:** `DEPLOYMENT_GUIDE.md`
- **Rychlé příkazy:** `QUICK_REFERENCE.md`
- **Deploy script:** `scripts/deploy-remote.sh`

---

## ✅ Next Steps Checklist

### Remote Server (TEĎ)
- [ ] Spustit `vercel login`
- [ ] Spustit `vercel link`
- [ ] Commitnout `.gitignore` změnu

### MacBook (později)
- [ ] Vytvořit Supabase Cloud projekty (staging + production)
- [ ] Aplikovat migrations na Supabase Cloud
- [ ] Nakonfigurovat Vercel environment variables
- [ ] Test deployment

### Final Test
- [ ] Push změny na GitHub
- [ ] Ověřit auto-deployment na Vercel
- [ ] Otestovat preview URLs
- [ ] Otestovat production URL
- [ ] Otestovat remote server backup

---

**Poslední update:** 2025-11-06
**Status:** Setup připraven, čeká na provedení kroků
