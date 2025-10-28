# AC Heating CMS - Usage Guide
**Verze:** 1.0
**Datum:** 2025-10-27

---

## Přehled

AC Heating CMS je AI-powered content management systém postavený na Next.js 15, Supabase a Claude Sonnet 4.5. Umožňuje vytváření, editaci a publikování obsahu pomocí přirozeného jazyka.

---

## 🚀 Rychlý start

### 1. Přístup k CMS

URL: `http://localhost:3100/admin` (development) nebo `https://www.ac-heating.cz/admin` (production)

### 2. První použití

```bash
# 1. Aplikuj databázovou migraci
cd ~/ac-heating-web-new
npx supabase db push

# 2. Zkontroluj .env.local
# Musí obsahovat:
ANTHROPIC_API_KEY=sk-ant-xxx
NEXT_PUBLIC_SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# 3. Spusť dev server
npm run dev

# 4. Otevři admin
# http://localhost:3100/admin
```

---

## 📊 Dashboard

### KPI Overview

Dashboard zobrazuje 6 klíčových metrik:
- Conversion Rate
- Lead Quality
- Cost per Lead
- Email Opt-in Rate
- Mobile Conversion
- Organic Traffic Growth

**Update KPIs:**
```sql
UPDATE kpis
SET actual_value = 4.2
WHERE metric_name = 'Conversion Rate' AND period = 'Q1 2025';
```

---

## 🤖 AI Content Generator

### Jak použít

1. **Vyber Content Type:**
   - Blog článek (novinky, technické články)
   - Statická stránka (O nás, Produkty)
   - Case study (reference)
   - Landing page (kampaně)

2. **Napiš přirozený prompt:**
   ```
   Vytvoř článek o dotacích 2025 pro rodinné domy
   ```

3. **Klikni "Vygenerovat obsah"**

4. **Zkontroluj náhled**

5. **Publikuj nebo Zahoď**

### Příklady promptů

#### Blog článek
```
Vytvoř článek o dotacích 2025 pro rodinné domy s tepelnými čerpadly.
Zaměř se na:
- Nové dotační programy NZÚ
- Výše dotace na TČ
- Jak si o dotaci zažádat
- Návratnost investice s dotací
```

#### Landing page
```
Vytvoř landing page pro kampaň "TČ + FVE balíček".
Cílová skupina: majitelé RD
Benefit: maximální úspora energie
CTA: získat cenovou nabídku
```

#### Case study
```
Vytvoř case study instalace TČ + FVE v bytovém domě v Praze.
- 30 bytových jednotek
- Úspora 60% nákladů na vytápění
- ROI 7 let
- Dotace z NZÚ 2M Kč
```

### Segment Targeting

Pro personalizaci obsahu můžeš zadat cílový segment:
- **Rodinné domy** - majitelé RD
- **Bytové domy** - SVJ, bytová družstva
- **Developery/Firmy** - B2B klienti

---

## 📝 Content Structure

### Blog článek

```json
{
  "title": "Dotace na tepelná čerpadla 2025",
  "meta_title": "Dotace TČ 2025 - Kompletní průvodce | AC Heating",
  "meta_description": "Vše o dotacích na tepelná čerpadla v roce 2025...",
  "keywords": ["dotace", "tepelná čerpadla", "2025", "NZÚ"],
  "content": {
    "intro": "Úvodní text...",
    "sections": [
      {
        "heading": "Nadpis sekce",
        "text": "Obsah v markdown formátu...",
        "image": "Popis ilustrace"
      }
    ],
    "conclusion": "Závěr s CTA..."
  }
}
```

### Landing page

```json
{
  "title": "TČ + FVE Balíček",
  "content": {
    "hero": {
      "headline": "Ušetřete až 60% nákladů na vytápění",
      "subheadline": "Kompletní řešení TČ + FVE s 7 lety záruky",
      "cta_primary": "Získat cenovou nabídku",
      "cta_secondary": "Kalkulace úspor"
    },
    "benefits": [
      {"icon": "💰", "title": "Úspora", "desc": "Až 60% nižší náklady"},
      {"icon": "🌍", "title": "Ekologie", "desc": "Snížení CO2 o 80%"}
    ],
    "social_proof": {
      "stats": [
        {"value": "7500+", "label": "spokojených zákazníků"},
        {"value": "18 let", "label": "zkušeností"}
      ]
    }
  }
}
```

---

## 🔄 Content Workflow

```
1. AI Generation (draft)
   ↓
2. Preview & Review
   ↓
3. Approve or Reject
   ↓
4. Published (status = 'published')
   ↓
5. Visible on website
```

### Status states

- `draft` - AI vygenerovaný obsah čeká na schválení
- `published` - Schválený a publikovaný obsah
- `archived` - Zamítnutý nebo starý obsah

---

## 📈 Analytics & Tracking

### Recent Content

Dashboard zobrazuje 5 posledních položek:
- Titulek
- Content type
- Status (draft/published)
- AI generated flag

### Edit History

Tracking všech změn:
- AI generation
- Human edits
- Approvals
- Rejections

### Query edit history

```typescript
const { data } = await supabase
  .from('cms_edit_history')
  .select('*')
  .eq('content_id', 'xxx')
  .order('created_at', { ascending: false });
```

---

## 🔧 API Endpoints

### Generate Content

```typescript
POST /api/cms/generate

Body:
{
  "prompt": "Vytvoř článek o dotacích 2025",
  "contentType": "blog",
  "segmentTargeting": ["Rodinné domy"]
}

Response:
{
  "id": "uuid",
  "title": "...",
  "slug": "...",
  "content": {...},
  "preview_url": "/admin/preview/uuid"
}
```

### Publish Content

```typescript
POST /api/cms/publish

Body:
{
  "content_id": "uuid",
  "approved": true,
  "editor_notes": "Looks good!"
}

Response:
{
  "success": true,
  "content_id": "uuid",
  "status": "published",
  "published_url": "/blog/slug"
}
```

### Get Content

```typescript
GET /api/cms/publish?content_id=uuid

Response:
{
  "content": {...},
  "history": [...]
}
```

---

## 🎨 Customization

### Upravit AI prompt

Edituj `/src/app/api/cms/generate/route.ts`:

```typescript
function buildSystemPrompt(contentType: string): string {
  const baseContext = `
Jsi AI asistent pro AC Heating...

KLÍČOVÉ INFORMACE:
- Přidej své vlastní instrukce
- Brand tone
- Competitive advantages
`;
  // ...
}
```

### Přidat nový Content Type

1. **Aktualizuj SQL check constraint:**
```sql
ALTER TABLE cms_content
DROP CONSTRAINT cms_content_content_type_check;

ALTER TABLE cms_content
ADD CONSTRAINT cms_content_content_type_check
CHECK (content_type IN ('page', 'blog', 'case_study', 'landing_page', 'product_detail'));
```

2. **Přidej do `buildSystemPrompt()`:**
```typescript
const contentTypeInstructions = {
  // ...
  product_detail: `STRUKTURA PRO PRODUKT...`,
};
```

3. **Aktualizuj Admin dashboard select:**
```tsx
<option value="product_detail">Produktový detail</option>
```

---

## 📚 Database Schema

### cms_content

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| content_type | TEXT | 'page', 'blog', 'case_study', 'landing_page' |
| slug | TEXT | URL slug |
| title | TEXT | Titulek |
| content | JSONB | Strukturovaný obsah |
| meta_title | TEXT | SEO titulek |
| meta_description | TEXT | SEO popis |
| keywords | TEXT[] | Keywords |
| segment_targeting | TEXT[] | ['RD', 'BD', 'Developery'] |
| status | TEXT | 'draft', 'published', 'archived' |
| ai_generated | BOOLEAN | AI flag |
| ai_model | TEXT | 'claude-sonnet-4.5' |
| ai_prompt | TEXT | Original prompt |
| published_at | TIMESTAMP | Publish timestamp |

### cms_edit_history

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| content_id | UUID | FK to cms_content |
| edit_type | TEXT | 'ai_generated', 'human_edited', 'approved', 'rejected' |
| changes | JSONB | Diff of changes |
| ai_model | TEXT | AI model used |
| prompt_used | TEXT | User prompt |
| editor_name | TEXT | Editor name |
| notes | TEXT | Additional notes |

---

## 🚨 Troubleshooting

### AI nefunguje

**Problém:** "ANTHROPIC_API_KEY není nakonfigurován"

**Řešení:**
```bash
# Zkontroluj .env.local
cat .env.local | grep ANTHROPIC

# Přidej API key
echo "ANTHROPIC_API_KEY=sk-ant-xxx" >> .env.local

# Restart dev serveru
npm run dev
```

### Content se neuloží

**Problém:** Database error při ukládání

**Řešení:**
```bash
# Zkontroluj Supabase connection
psql $DATABASE_URL

# Aplikuj migraci
npx supabase db push

# Zkontroluj RLS policies
SELECT * FROM cms_content LIMIT 1;
```

### AI vrací neplatný JSON

**Problém:** "AI odpověď není validní JSON"

**Řešení:**
1. Zkus upravit prompt (specifičtější instrukce)
2. Zkontroluj `buildSystemPrompt()` - jasné instrukce pro JSON output
3. Zkus jiný AI model

---

## 📊 Business Data

### Revenue Projections

```sql
SELECT year, category, amount, units
FROM revenue_projections
WHERE year >= 2025
ORDER BY year, amount DESC;
```

### Personnel Planning

```sql
SELECT year, department, COUNT(*) as total
FROM personnel_planning
GROUP BY year, department
ORDER BY year, total DESC;
```

### Target Segments

```sql
SELECT name, revenue_percentage, content_focus
FROM target_segments
ORDER BY revenue_percentage DESC;
```

---

## 🎯 Best Practices

### AI Prompts

✅ **Dobré:**
```
Vytvoř článek o dotacích 2025 pro rodinné domy.
Zaměř se na NZÚ program, výši dotace, proces žádosti.
Cílová skupina: majitelé RD 100-150m².
```

❌ **Špatné:**
```
článek o dotacích
```

### Content Review

1. **Zkontroluj fakta** - AI může halucinovat
2. **Ověř čísla** - ceny, úspory, dotace
3. **Kontrola pravopisu** - diacritika, formátování
4. **SEO optimalizace** - meta tags, keywords
5. **Brand consistency** - tone, messaging

### Segment Targeting

- **Rodinné domy**: Focus na ROI, úspory, komfort
- **Bytové domy**: Focus na legislativu, SVJ rozhodování, dlouhodobé úspory
- **Developery/Firmy**: Focus na ESG, certifikace, hromadné projekty

---

## 📞 Support

**Tech Support:**
- Email: dev@ac-heating.cz
- Slack: #cms-support

**Dokumentace:**
- `/docs/CMS_USAGE_GUIDE.md` (tento soubor)
- `/docs/PHASE4_QUERIES.md` (database queries)
- `/docs/PHASE4_QUICK_START.md` (setup guide)

---

**Last updated:** 2025-10-27
**Version:** 1.0
