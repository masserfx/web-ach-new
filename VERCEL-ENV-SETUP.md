# Vercel Environment Variables Setup

## 🔧 Nastavení pro připojení k lokální Supabase

Vercel deployment používá **sdílenou lokální Supabase instanci** z serveru `91.99.126.53`.

### Postup nastavení

1. **Jdi do Vercel Dashboardu**
   - https://vercel.com/dashboard
   - Vyber projekt `web-ach-new`

2. **Nastav Environment Variables**
   - Settings → Environment Variables
   - Přidej následující proměnné pro **Production** i **Preview**:

```env
NEXT_PUBLIC_SUPABASE_URL=http://91.99.126.53:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://web-ach-new.vercel.app
OLD_SITE_URL=http://91.99.126.53:8080
```

3. **Redeploy**
   - Po přidání env vars klikni **"Redeploy"**
   - Vercel automaticky použije nové proměnné

---

## ⚠️ Důležité poznámky

### Supabase dostupnost
- Lokální Supabase běží na `91.99.126.53:54321`
- Port **54321 je otevřený** pro external přístup
- Používá **demo JWT keys** (standardní Supabase local)

### Bezpečnost
- ⚠️ Toto je **DEMO/DEV setup**, ne produkce!
- Pro produkci použij **cloud Supabase** (https://supabase.com)
- Demo keys jsou veřejné a bezpečné jen pro testování

### Firewall
Pokud Vercel nemůže dosáhnout Supabase:
1. Zkontroluj firewall: `sudo ufw status`
2. Otevři port: `sudo ufw allow 54321/tcp`
3. Test připojení: `curl http://91.99.126.53:54321`

---

## 🚀 Ověření nastavení

Po deployu zkontroluj:

1. **Produkty**: `https://web-ach-new.vercel.app/produkty`
   - Měly by se zobrazit produkty z databáze

2. **Vercel Logs**:
   - Dashboard → Deployment → Function Logs
   - Hledej případné Supabase connection errors

3. **Test připojení** z Vercel:
   ```bash
   # V Vercel Function logs by mělo být:
   # "Connected to Supabase at http://91.99.126.53:54321"
   ```

---

## 📋 Checklist

- [ ] Environment variables nastaveny ve Vercel
- [ ] Production i Preview environments
- [ ] Redeploy spuštěn
- [ ] Produkty se zobrazují na `/produkty`
- [ ] Supabase běží na serveru (port 54321)

---

## 🔄 Pro pozdější migraci na Cloud Supabase

1. Vytvoř projekt na https://supabase.com
2. Exportuj data: `pg_dump` z lokální DB
3. Importuj do cloud DB
4. Updatuj env vars ve Vercel na cloud URL
5. Redeploy

**Výhody cloud Supabase:**
- ✅ Vyšší dostupnost (SLA 99.9%)
- ✅ Automatické backupy
- ✅ CDN pro rychlý přístup
- ✅ Built-in security

Pro teď je lokální Supabase OK pro **UI/UX testování**!
