# ✅ SSL/HTTPS Issue VYŘEŠEN

## 🔧 Problém
Vision aplikace běžela na HTTP (port 3102), ale prohlížeč očekával HTTPS.
Chyba: `ERR_SSL_PROTOCOL_ERROR`

## ✅ Řešení
Vytvořen HTTPS server s self-signed certifikáty (stejně jako původní app).

---

## 🌐 NOVÉ Přístupové URL

### Původní aplikace
```
https://91.99.126.53:3100
```

### Vision aplikace ⭐ (FIXED)
```
https://91.99.126.53:3102
```

**DŮLEŽITÉ**: Obě aplikace nyní běží přes **HTTPS** (ne HTTP)!

---

## 🔒 Self-signed certifikát

Při prvním přístupu prohlížeč zobrazí varování:
- **Chrome/Edge**: "Vaše připojení není soukromé"
- **Firefox**: "Upozornění: Možné bezpečnostní riziko"

**Jak pokračovat**:
1. Klikněte na "Pokročilé" / "Advanced"
2. Klikněte na "Pokračovat na 91.99.126.53 (nebezpečné)" / "Proceed to..."
3. Aplikace se načte

To je normální u self-signed certifikátů pro vývoj.

---

## 📁 Změny

### Nový soubor: `server.js`
```javascript
const { createServer } = require('https');
const hostname = '91.99.126.53';
const port = 3102;

const httpsOptions = {
  key: fs.readFileSync('certificates/localhost.key'),
  cert: fs.readFileSync('certificates/localhost.crt'),
};
```

### PM2 konfigurace
```bash
# Nyní běží:
pm2 start npm --name 'ac-heating-vision-dev' -- run dev:https

# Místo původního:
pm2 start npm --name 'ac-heating-vision-dev' -- run dev
```

---

## 🧪 Test

```bash
# HTTPS test
curl -sk https://91.99.126.53:3102

# Produkty
curl -sk https://91.99.126.53:3102/produkty

# Port status
netstat -tulpn | grep 3102
```

---

## 🎯 Status

- ✅ HTTPS server běží na portu 3102
- ✅ Self-signed certifikáty aktivní
- ✅ PM2 proces saved a auto-restart nakonfigurován
- ✅ Aplikace odpovídá na HTTPS requesty

**Otevřete v prohlížeči:**
```
https://91.99.126.53:3102
```

A přijměte self-signed certifikát.
