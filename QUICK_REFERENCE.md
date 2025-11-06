# ⚡ Quick Reference - Deployment Commands

## 📍 Lokace: REMOTE SERVER (91.99.126.53)

### První setup (jednorázově)
```bash
# 1. Login do Vercel
vercel login

# 2. Link projekt
cd ~/ac-heating-web-vision
vercel link

# 3. Přidat .vercel do gitignore
echo ".vercel" >> .gitignore
git add .gitignore
git commit -m "chore: Add .vercel to gitignore"
git push origin main
```

### Deployment script
```bash
# Vytvořit deploy script
chmod +x scripts/deploy-remote.sh

# Deploy
./scripts/deploy-remote.sh
```

---

## 📍 Lokace: MACBOOK (Local Dev)

### Daily development
```bash
# Start dev
npm run dev  # http://localhost:3102

# Commit & push (auto-deploys Vercel)
git add .
git commit -m "feat: your message"
git push origin main
```

### Feature branch
```bash
# Create branch
git checkout -b feature/name

# Push (creates Vercel preview)
git push origin feature/name

# Merge (deploys to production)
git checkout main
git merge feature/name
git push origin main
```

### Database migration
```bash
# Create migration
supabase migration new table_name

# Test locally
supabase db reset

# Push to Supabase Cloud
supabase link --project-ref [ref-id]
supabase db push
```

---

## 🌐 URLs

| Environment | URL | Database |
|-------------|-----|----------|
| **MacBook Dev** | http://localhost:3102 | Docker Supabase (localhost:54321) |
| **Vercel Preview** | https://*.vercel.app | Supabase Cloud (staging) |
| **Vercel Production** | https://ac-heating.cz | Supabase Cloud (production) |
| **Remote Backup** | https://91.99.126.53:3100 | Docker Supabase (remote) |

---

## 🔑 Environment Variables

### Najít Supabase credentials
```
Supabase Dashboard → Project → Settings → API
- Project URL
- anon/public key
- service_role key
```

### Najít Vercel project ID
```
Vercel Dashboard → Project → Settings → General
- Project ID
- Team ID
```

---

## 🚨 Emergency Commands

### Vercel rollback
```bash
# Dashboard: Deployments → Previous → Redeploy
# CLI:
vercel rollback
```

### Remote server restart
```bash
ssh user@91.99.126.53
pm2 restart ac-heating-web
pm2 logs ac-heating-web  # Check logs
```

### Database restore
```bash
# From backup
psql "[db-url]" < backups/backup.sql
```

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
