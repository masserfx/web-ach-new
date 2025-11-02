# 📋 Admin Guide - Jak Ověřit Přijaté Leady

## 🔗 **Přístup k Admin Rozhraní**

### **URL**: 
```
https://91.99.126.53:3102/admin/leads
```

---

## 📊 **Co Admin Rozhraní Zobrazuje**

### **1. Dashboard (Přehled)**
Na hlavní stránce `/admin/leads` vidíš:

**📈 Statistiky:**
- ✅ Celkový počet leadů
- 🆕 Nové leady (status: new)
- ✓ Kvalifikované leady (status: qualified)
- 🎉 Vyhrané zakázky (status: won)

**📋 Seznam všech leadů:**
- Jméno a příjmení
- Email (klikatelný - otevře email klienta)
- Telefon (klikatelný - zavolá)
- Typ nemovitosti (rodinný dům, bytový dům, atd.)
- Status (barevné labely)
- Datum vytvoření
- Zpráva/Popis projektu (pokud je vyplněna)

---

## 🔍 **Detail Leadu**

**Klikni na libovolný lead** v seznamu a otevře se detail:

### **URL**: 
```
https://91.99.126.53:3102/admin/leads/[ID-LEADU]
```

### **Co je v detailu:**

#### **1. Kontaktní Informace**
- 👤 Jméno a příjmení
- 📧 Email (klikatelný mailto:)
- 📞 Telefon (klikatelný tel:)
- 🏙️ Město

#### **2. Informace o Nemovitosti**
- 🏠 Typ nemovitosti (rodinný dům, bytový dům, firma, developer)
- 📐 Velikost v m² (pokud vyplněno)
- 💰 Rozpočet (pokud vyplněn)
- ⏰ Urgence (okamžitě, tento měsíc, čtvrtletí, plánování)

#### **3. Popis Projektu**
- 📝 Celá zpráva z formuláře
- Všechny technické detaily
- Požadavky zákazníka

**Příklad tvého leadu:**
```
topíme starým tepelným čerpadlem, spotřeba elektřiny 6MWh, 
dodavatelem je DeltaGreen - Spotové ceny. Vytápění, ohřev 
TUV peo 2 osoby - máme 250l zásobník, 2,5 kW el. topné 
těleso, bivalence = 6 kW elektrokotel. Hydraulicky zapojené 
bez anuloidu - máme dost vody v radiátorech - 1 přímý okruh.
```

#### **4. Timeline (Pravá strana)**
- 📅 Datum vytvoření
- 🔄 Datum poslední aktualizace
- 📍 Zdroj (website, facebook, google, atd.)
- ✅ GDPR souhlas

#### **5. Quick Actions**
- 📧 **Email** button - otevře email klienta
- 📞 **Zavolat** button - zavolá klientovi

---

## 📧 **Konkrétně Pro Tvůj Lead**

### **Najdeš ho takto:**

1. **Otevři**: `https://91.99.126.53:3102/admin/leads`

2. **Najdi v seznamu:**
   - Jméno: **Leoš Hrádek**
   - Email: **lhradek@ac-heating.cz**
   - Telefon: **+420 123 456 789**
   - Status: **🆕 Nový** (modrý label)
   - Datum: **2. listopadu 2025, 14:16**

3. **Klikni na řádek** - otevře se detail

4. **V detailu vidíš:**
   ```
   📋 Popis projektu:
   topíme starým tepelným čerpadlem, spotřeba elektřiny 6MWh, 
   dodavatelem je DeltaGreen - Spotové ceny...
   (celá tvoje zpráva)
   
   🏠 Typ nemovitosti: Rodinný dům
   📐 Velikost: 160 m²
   ```

---

## 🎨 **Barevné Statusy**

- 🔵 **Nový** (new) - modrý - čerstvý lead
- 🟣 **Kontaktován** (contacted) - fialový - už jste ho kontaktovali
- 🟢 **Kvalifikován** (qualified) - zelený - validní lead
- 🟡 **Nabídka** (proposal) - žlutý - poslána nabídka
- 🟠 **Jednání** (negotiation) - oranžový - probíhá jednání
- 🟢 **Vyhrán** (won) - smaragdový - uzavřená zakázka
- 🔴 **Ztracen** (lost) - červený - lead nevyšel
- ⚫ **Archivován** (archived) - šedý

---

## 📱 **Quick Actions**

### **Z detail stránky můžeš:**

1. **Poslat email**
   - Klikni na email adresu
   - Otevře se tvůj email klient s předvyplněnou adresou

2. **Zavolat**
   - Klikni na telefonní číslo
   - Na mobilu se spustí hovor
   - Na desktopu se otevře výchozí aplikace

3. **Exportovat** (coming soon)
   - CSV export všech leadů

---

## 🔔 **Email Notifikace**

**Aktuální stav:**
- ⏳ Email notifikace zatím NENÍ nastavená
- 📧 Musíš zkontrolovat admin manuálně

**Plánováno:**
- ✉️ Email při každém novém leadu
- 📊 Denní souhrn (8:00 AM)
- 🔔 Push notifikace (optional)

---

## 🗂️ **Filtry a Vyhledávání** (Coming Soon)

**Plánované funkce:**
- 🔍 Vyhledávání podle jména, emailu, telefonu
- 🗂️ Filtrování podle statusu
- 📅 Filtrování podle data
- 🏠 Filtrování podle typu nemovitosti
- ⭐ Řazení podle kvality (quality_score)

---

## 📊 **Database Query (Pro Kontrolu)**

Pokud chceš zkontrolovat v databázi přímo:

```bash
ssh dev-server "docker exec -i supabase_db_ac-heating-web-new psql -U postgres -d postgres -c \"
SELECT 
  id, 
  first_name, 
  last_name, 
  email, 
  phone, 
  property_type,
  LEFT(project_description, 50) as description_preview,
  status,
  created_at 
FROM leads 
ORDER BY created_at DESC 
LIMIT 10;
\""
```

---

## ✅ **Checklist Po Přijetí Leadu**

1. ☑️ Otevři `/admin/leads`
2. ☑️ Najdi nový lead (modrý status "Nový")
3. ☑️ Klikni na řádek pro detail
4. ☑️ Přečti popis projektu
5. ☑️ Zkontroluj kontaktní údaje
6. ☑️ Klikni "Email" nebo "Zavolat"
7. ☑️ Změň status na "Kontaktován" (coming soon)

---

## 🚀 **Next Steps (Budoucí Funkce)**

### **Phase 6 - CRM Features:**
- [ ] Status update dropdown přímo v listu
- [ ] Bulk actions (označit více leadů)
- [ ] Email templates (quick reply)
- [ ] Lead assignment (přiřadit obchodníkovi)
- [ ] Poznámky k leadům
- [ ] History log (kdo co změnil)
- [ ] Export do Excel/CSV
- [ ] Import leadů
- [ ] Automatické notifikace

### **Phase 7 - Analytics:**
- [ ] Lead scoring (AI hodnocení kvality)
- [ ] Conversion tracking
- [ ] Source attribution (odkud přišel)
- [ ] Response time tracking
- [ ] Win rate analysis

---

## 📞 **Kontakt Pro Support**

Pokud máš problém s admin rozhraním:
1. Zkontroluj že jsi přihlášen
2. Zkontroluj URL: `https://91.99.126.53:3102/admin/leads`
3. Zkontroluj PM2 logy: `pm2 logs ac-heating-vision-dev`

---

**Status**: ✅ Admin rozhraní FUNGUJE  
**URL**: https://91.99.126.53:3102/admin/leads  
**Tvůj poslední lead**: Leoš Hrádek (2. 11. 2025, 14:16)
