# ✅ AC Heating - Úspěšné nasazení obou aplikací

## 🎉 Stav: HOTOVO

Obě aplikace běží vedle sebe a jsou dostupné přes web (IP + port).

---

## 🌐 Přístupové URL

### Původní aplikace (Main)
```
http://91.99.126.53:3100
```
- **Port**: 3100
- **Adresář**: `/home/leos/ac-heating-web-new`
- **Branch**: `main`
- **Proces**: Node.js (PID 111417) - `node server.js`
- **Popis**: Původní produkční verze

### Nová Vision aplikace ⭐
```
http://91.99.126.53:3102
```
- **Port**: 3102  
- **Adresář**: `/home/leos/ac-heating-web-vision`
- **Branch**: `dev-new-vision`
- **Proces**: PM2 `ac-heating-vision-dev`
- **Popis**: Nová verze s 8 produkty, kalkulačkou, AI backend

---

## 🧪 Testované URL (Vision)

### Homepage
```
http://91.99.126.53:3102
```

### Produkty (listing)
```
http://91.99.126.53:3102/produkty
```

### Produkty detail (příklady)
```
http://91.99.126.53:3102/produkty/rd-tepelne-cerpadlo
http://91.99.126.53:3102/produkty/rd-fotovoltaika
http://91.99.126.53:3102/produkty/bd-tepelne-cerpadlo
http://91.99.126.53:3102/produkty/bd-fotovoltaika
http://91.99.126.53:3102/produkty/developer-reseni
http://91.99.126.53:3102/produkty/klimatizace
http://91.99.126.53:3102/produkty/retrofit-modernizace
http://91.99.126.53:3102/produkty/bd-komunitni-energetika
```

---

## 📊 Implementované featury (Vision)

### ✅ Produktový katalog
- **8 produktů** úspěšně seednuto do Supabase
- Ceny: 200k - 2.6M CZK
- Kompletní data: pros/cons, specs, subsidies, financing

### ✅ Dynamic pages
- `/produkty` - Listing grouped by market (RD/BD/Developer)
- `/produkty/[slug]` - Detail pages s bohatým obsahem
- SEO: JSON-LD schemas

### ✅ Database
- Supabase local běží na portu 54321
- Migration 005 aplikována
- Leads pipeline system ready

### ✅ Python Backend (připraveno)
- `backend/main.py` - FastAPI
- POST `/api/calculate-savings` - Pokročilá kalkulačka
- POST `/api/ai-chat` - AI chatbot endpoint
- Backend není zatím nasazený (čeká na další krok)

---

## 🔧 Management příkazy

### PM2 (Vision app)

```bash
# Status
pm2 list

# Logy (real-time)
pm2 logs ac-heating-vision-dev

# Restart
pm2 restart ac-heating-vision-dev

# Stop
pm2 stop ac-heating-vision-dev

# Start
pm2 start ac-heating-vision-dev

# Info
pm2 info ac-heating-vision-dev
```

### Supabase

```bash
# Status
cd ~/ac-heating-web-vision
supabase status

# Logy
supabase logs

# Stop
supabase stop

# Start
supabase start

# Migrace
docker exec -i supabase_db_ac-heating-web-new psql -U postgres -d postgres < supabase/seed_products.sql
```

---

## 📁 Struktura serverů

```
/home/leos/
├── ac-heating-web-new/        # Původní app (port 3100)
│   ├── .env.local
│   ├── package.json (port 3100)
│   ├── server.js              # HTTPS server
│   └── ecosystem.config.js
│
└── ac-heating-web-vision/     # Vision app (port 3102)
    ├── .env.local
    ├── package.json (port 3102)
    ├── ecosystem.vision.config.js
    ├── backend/
    │   ├── main.py           # FastAPI (port 8000)
    │   └── requirements.txt
    └── supabase/
        ├── migrations/
        └── seed_products.sql
```

---

## 🚀 Next Steps (volitelné)

### 1. Nasadit Python backend
```bash
cd ~/ac-heating-web-vision/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name ac-heating-api
```

### 2. Nginx reverse proxy (doporučeno pro produkci)
```nginx
server {
    listen 80;
    server_name ac-heating-vision.example.com;
    
    location / {
        proxy_pass http://localhost:3102;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL certifikát (Let's Encrypt)
```bash
sudo certbot --nginx -d ac-heating-vision.example.com
```

### 4. Firewall nastavení
```bash
# Povolit pouze potřebné porty
sudo ufw allow 3100/tcp
sudo ufw allow 3102/tcp
sudo ufw allow 8000/tcp  # API
sudo ufw enable
```

---

## ✅ Checklist dokončených úkolů

- [x] Vytvoření GitHub repository `masserfx/ac-heating-web-vision`
- [x] Database migrace (005_enhanced_products_leads.sql)
- [x] Seeding 8 produktů do Supabase
- [x] Dynamic product pages (listing + detail)
- [x] Python FastAPI backend s kalkulačkou
- [x] Separátní instance pro Vision app
- [x] Port configuration (3102)
- [x] PM2 setup pro auto-restart
- [x] Externí přístup přes IP:port
- [x] Dokumentace a access info

---

## 📞 Support

**Server**: Hetzner (91.99.126.53)  
**SSH**: `ssh dev-server`  
**GitHub**: https://github.com/masserfx/ac-heating-web-vision  
**Branch**: dev-new-vision  

**Datum nasazení**: 2025-11-02  
**Status**: ✅ LIVE & RUNNING
