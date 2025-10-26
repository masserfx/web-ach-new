# AC Heating Web - Development Status Report
**Datum**: 2025-10-26 08:00  
**Status**: 🟡 Částečně funkční - Kritické opravy provedeny, další práce potřebná

---

## 🎯 Přehled

Tento dokument sleduje stav vývoje nového Next.js webu AC Heating ve srovnání s požadavky z MIGRATION-README.md a strategického plánu.

---

## ✅ Dokončené kritické opravy (2025-10-26)

### 1. Centralizace konfigurace ✅
**Problém**: Hardkodované kontakty, URLs a konstanty v celém kódu  
**Řešení**: Vytvořen `/src/lib/site.config.ts`

```typescript
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100',
  contact: {
    email: 'info@ac-heating.cz',
    phone: '+420 731 402 055',
    address: { ... }
  },
  social: { facebook, linkedin, instagram, youtube },
  nav: { main, products, footer },
  api: { quote, contact, newsletter },
  pagination: { blogPostsPerPage: 12, ... }
}
```

**Impact**: Single source of truth pro veškeré site-wide konstanty

---

### 2. Oprava ProductCard routing ✅
**Problém**: ProductCard linky používaly `/produkty/{category}/{slug}` ale routing je jen `/produkty/{slug}`  
**Řešení**: Opraveny všechny 3 linky v ProductCard.tsx

**Před**:
```tsx
href={`/produkty/${product.category}/${product.slug}`}  // 404 error!
```

**Po**:
```tsx
href={`/produkty/${product.slug}`}  // ✅ Funguje
```

**Impact**: Produkty na homepage nyní fungují správně

---

### 3. Implementace Quote API ✅
**Problém**: Formulář `/pripravit-rozpocet` volal neexistující `/api/quote`  
**Řešení**: Vytvořen `/src/app/api/quote/route.ts`

**Funkce**:
- ✅ Validace povinných polí (name, email, phone, service)
- ✅ Email regex validace
- ✅ Czech phone number validace
- ✅ Error handling
- 🔄 TODO: Email odeslání (Resend/SendGrid)
- 🔄 TODO: Uložení do Supabase quotes table

**Impact**: Formulář nyní funguje (validation passes, TODO: email sending)

---

### 4. Oprava hardkodovaných IP adres ✅
**Problém**: Share buttony používaly `http://91.99.126.53:3100` místo production URL  
**Řešení**: Nahrazeno `siteConfig.url` v:
- `/src/app/blog/[slug]/page.tsx` (3 místa)
- `/src/app/produkty/[slug]/page.tsx` (1 místo)

**Před**:
```tsx
url={`http://91.99.126.53:3100/blog/${post.slug}`}
```

**Po**:
```tsx
url={`${siteConfig.url}/blog/${post.slug}`}
```

**Impact**: Share linky nyní respektují environment (localhost vs production)

---

## 🔴 Kritické problémy (BREAKING) - ZBÝVÁ

### 1. FAQ Metadata Issue
**Problém**: FAQ page má `'use client'` ale exportuje `Metadata` (server-only)
**Soubor**: `/src/app/faq/page.tsx:3`
**Dopad**: Metadata se nevyexportuje správně, SEO problém
**Priorita**: 🔴 HIGH

### 2. Chybějící stránky v Footeru
**Problém**: Footer linky vedou na neexistující stránky
**Chybí**:
- `/privacy` - Privacy Policy
- `/terms` - Terms & Conditions

**Priorita**: 🔴 HIGH

---

## 🟠 Vysoká priorita (UX Breaking) - ZBÝVÁ

### 1. Hardkodované kontakty v komponentách
**Soubory s problémem**:
- `/src/app/kontakt/page.tsx`
- `/src/components/Navigation.tsx`
- `/src/components/Footer.tsx`

**Řešení**: Nahradit `siteConfig.contact.*`

### 2. Sociální media linky
**Problém**: Footer linky vedou na generické domény
```tsx
href="https://facebook.com"  // ❌
// Mělo by:
href={siteConfig.social.facebook}  // ✅
```

### 3. Contact API endpoint
**Problém**: Kontaktní formulář pravděpodobně nefunguje
**Řešení**: Vytvořit `/api/contact` endpoint podobně jako Quote API

---

## 🟡 Střední priorita (Design/UX) - ZBÝVÁ

### 1. Nekonzistentní design patterns

**Button styling** - Různé přístupy:
```tsx
// Homepage
className="px-10 py-5 bg-gradient-to-r from-brand-accent..."

// Blog
className="px-8 py-3 bg-brand-primary text-white rounded-lg..."

// FAQ
className="px-10 py-5 bg-white text-brand-primary border-2..."
```

**Řešení**: Vytvořit Button komponentu s variants (primary, secondary, outline)

**Card components** - Různé implementace:
```tsx
// Home cards
border-2 border-gray-100

// Blog cards  
border border-gray-100
```

**Řešení**: Sjednotit na `border` (1px) nebo `border-2` (2px) konzistentně

### 2. Chybějící content sekce

**Homepage chybí**:
- Testimonials/Reference sekce
- Certifikace (ISO, kvalifikace)
- Instalační proces (step-by-step)
- Porovnání vs konkurence
- Mapa pokrytí (vizualizace)

**Produkty page chybí**:
- Detailní filtry (kategorie, cena, parametry)
- Porovnání produktů (comparison tool)
- Technické specifikace v přehledu
- Dostupnost/skladové info

**Blog chybí**:
- Kategorie sidebar
- Related posts na detailu
- Newsletter signup CTA
- Search funkcionalita

### 3. Loading states a Error handling
- Mají základní `loading.tsx` ale bez UI implementace
- Chybí skeleton loaders
- Error messages jsou generické
- Žádný error tracking

---

## 🟢 Nízká priorita (Enhancement) - ZBÝVÁ

### 1. Analytics & Tracking
- ❌ Google Analytics tag
- ❌ Event tracking
- ❌ Conversion tracking

### 2. Performance optimizations
- ⚠️ Chybí pagination (hardkodované limity)
- ⚠️ Žádný lazy loading
- ⚠️ Někdy chybí `sizes` prop u Next.js Image

### 3. Accessibility improvements
- ⚠️ Některé alt texty nekonzistentní
- ❌ ARIA labels chybí na mobile menu toggle
- ❌ ARIA labels chybí na share buttons

### 4. TypeScript & Code quality
- ⚠️ Loose typing (`images?: any`)
- ⚠️ Magic strings místo konstant
- ⚠️ Žádné unit testy

---

## 📊 Checklist dle MIGRATION-README.md

### Database
- ✅ Schema migrated to Supabase
- ✅ Tables created successfully
- ✅ Indexes optimized
- ✅ RLS policies configured
- ✅ Full-text search working

### Content
- ✅ Blog posts migrated (358 articles)
- ✅ Featured images fixed (100% coverage)
- ✅ Structured content (JSONB blocks)
- 🔄 Products migrated (částečně)
- 🔄 Categories created (částečně)
- ❌ Media optimization (WebP conversion TODO)
- ⚠️ Tags assigned (partial)

### SEO
- ✅ Meta tags complete (blog, products)
- ✅ Structured data added (homepage)
- ⚠️ Structured data chybí na detailních stránkách
- ❌ Redirects NOT configured
- ✅ Sitemap generated
- ❌ Search Console NOT verified

### Testing
- ✅ Content displays correctly
- ✅ Images load properly
- ❌ Search NOT implemented
- ✅ Mobile responsive
- ⚠️ Performance NOT optimized (Lighthouse TODO)

### Deployment
- 🔄 Production build testováno lokálně
- ❌ Database backup TODO
- ❌ Monitoring NOT active
- ❌ Analytics NOT configured

---

## 🚀 Doporučený akční plán

### Fáze 1: Kritické opravy (1-2 dny)
1. ✅ ~~Centralizace konfigurace~~
2. ✅ ~~ProductCard routing~~
3. ✅ ~~Quote API~~
4. ✅ ~~Hardkodované IP adresy~~
5. ⏳ Opravit FAQ metadata
6. ⏳ Vytvořit Privacy & Terms stránky
7. ⏳ Nahradit všude hardkodované kontakty za siteConfig
8. ⏳ Opravit sociální media linky

### Fáze 2: Design konzistence (2-3 dny)
1. Vytvořit Button komponentu s variants
2. Sjednotit Card komponenty
3. Přidat Testimonials sekci
4. Implementovat skeleton loaders
5. Zlepšit error states

### Fáze 3: Funkce & Content (3-5 dní)
1. Implementovat search (blog + produkty)
2. Přidat filtrování produktů
3. Přidat related posts na blog detail
4. Vytvořit instalační proces sekci
5. Přidat certifikace sekci

### Fáze 4: Optimization & Testing (2-3 dny)
1. Lighthouse optimization (cíl 95+)
2. WebP konverze obrázků
3. Implementovat pagination
4. Přidat Google Analytics
5. Unit testy pro kritické komponenty
6. E2E testy formulářů

---

## 📈 Metrics

| Metrika | Současný stav | Cíl |
|---------|---------------|-----|
| Lighthouse Performance | ❓ Netestováno | 95+ |
| Lighthouse SEO | ❓ Netestováno | 100 |
| Blog posts migrated | 358 ✅ | 400+ |
| Products migrated | ~10 ⚠️ | 30+ |
| Featured images | 358/358 ✅ | 358/358 |
| Critical bugs | 5 ⏳ | 0 |
| Design consistency | 60% ⚠️ | 95% |
| Missing features | 12 ⏳ | 0 |

---

**Poslední aktualizace**: 2025-10-26 08:00  
**Autor**: Claude Code Development Tool
