# AC HEATING

## Strategický plán integrace

### Webové nástroje a digitální platforma

*Říjen 2025*

---

# Obsah

1. [Executive Summary](#1-executive-summary)
2. [Strategická východiska](#2-strategická-východiska)
3. [Analýza dat a projekce](#3-analýza-dat-a-projekce)
4. [Webová architektura a strategie](#4-webová-architektura-a-strategie)
5. [UX/UI design strategie](#5-uxui-design-strategie)
6. [Databázový design](#6-databázový-design)
7. [Content strategie](#7-content-strategie)
8. [Produktové sekce webu](#8-produktové-sekce-webu)
9. [Technická implementace](#9-technická-implementace)
10. [Udržitelnost a škálovatelnost](#10-udržitelnost-a-škálovatelnost)
11. [Implementační roadmap](#11-implementační-roadmap)
12. [Závěr](#12-závěr)

---

# 1. Executive Summary

Tento strategický dokument definuje komplexní přístup k integraci strategických informací AC Heating do vývoje moderní webové platformy. Cílem je vytvořit udržitelný, škálovatelný a uživatelsky přívětivý digitální ekosystém, který podpoří růst společnosti a její pozici leadera v oblasti komplexních energetických služeb v ČR.

## Klíčové cíle

- Vybudovat webovou platformu reflektující vizi a mise společnosti
- Implementovat datově řízený přístup k obsahu a produktovému portfoliu
- Zajistit škálovatelnost pro plánovaný růst z 108 zaměstnanců (2025) na 129 (2027)
- Podporovat tržby rostoucí z 353 mil. Kč (2023) na 522 mil. Kč (2027)
- Optimalizovat UX pro různé segmenty: RD, BD, B2B/developery, obce

---

# 2. Strategická východiska

## 2.1 Vize a mise

**Vize:**

Značka AC Heating je leadrem v oblasti komplexních energetických služeb pro rodinné domy, bytové domy a firemní objekty v ČR

**Mise:**

Pomáháme lidem a firmám snižovat energetickou náročnost a zvyšovat komfort prostřednictvím inteligentních, udržitelných a kompletních řešení na míru

## 2.2 SWOT analýza

| Silné stránky | Slabé stránky |
|---------------|---------------|
| • Vlastní výroba TČ Convert NG ONE<br>• Dlouholeté zkušenosti<br>• Silné reference v RD a BD<br>• Vysoká technická odbornost | • Nižší rozpoznatelnost značky<br>• Závislost na sezónnosti<br>• Nedostatečný digital marketing |

| Příležitosti | Hrozby |
|--------------|--------|
| • Státní a EU dotace na OZE<br>• Poptávka po soběstačnosti<br>• Tlak firem na ESG<br>• Expanze do BD a komerce | • Zahraniční konkurence v RD<br>• Kolísání cen energií<br>• Nedostatek instalačních partnerů<br>• Stabilita dodavatelů FVE |

---

# 3. Analýza dat a projekce

## 3.1 Tržby a růstový potenciál

| Kategorie | 2023 | 2024 | 2025 | 2026 | 2027 |
|-----------|------|------|------|------|------|
| RD TČ | 157M | 162M | 150M | 155M | 170M |
| BD TČ | 112M | 99M | 110M | 130M | 156M |
| **CELKEM** | **353M** | **365M** | **373M** | **432M** | **522M** |

**Klíčové poznatky:**

- Růst tržeb o 48% mezi 2023-2027 (353M → 522M Kč)
- Významný potenciál v segmentu BD (růst 40%)
- Nové produktové linie: Developer, Partner, Tepelná hospodářství

## 3.2 Personální růst a kapacity

Plánovaný růst z 108 zaměstnanců (2025) na 129 (2027) s důrazem na:

- Obchod: 19 → 34 zaměstnanců (+79%)
- Marketing: 10 → 13 zaměstnanců (+30%)
- Snížení fluktuace z 15% (2025) na 7% (2027)

## 3.3 Analýza trhu

Klíčové statistiky bytové výstavby a energetických zdrojů v ČR:

- Rodinné domy: ~19 000 dokončených bytů ročně (2020-2023)
- Bytové domy: ~11 000-14 000 dokončených bytů ročně
- Tepelná čerpadla v RD: 32 420 (2015) → 89 140 (2021) → projekce 250 000 (2025)
- Růst TČ o 275% mezi 2015-2021
- Pokles zemního plynu v RD: 1,04M (2021) → odhad 800 000 (2025)

---

# 4. Webová architektura a strategie

## 4.1 Technologický stack

### Frontend:
- Framework: Next.js 14+ (React 18+)
- TypeScript pro type safety
- Styling: Tailwind CSS + shadcn/ui komponenty
- State management: Zustand / React Query

### Backend:
- API: Next.js API routes / tRPC
- Database: PostgreSQL
- ORM: Prisma / Drizzle
- CMS: Headless CMS (Sanity / Strapi / Payload)

### Infrastructure:
- Hosting: Vercel / AWS / DigitalOcean
- CDN: Cloudflare
- Media storage: AWS S3 / Cloudinary
- Monitoring: Sentry + Google Analytics 4

## 4.2 Informační architektura

Web bude strukturován podle cílových segmentů a zákaznické journey:

1. **Úvodní stránka**
   - Vize, mise, segmentace, hlavní CTA

2. **Řešení podle typu objektu**
   - Pro rodinné domy / Pro bytové domy / Pro firmy a developery / Pro obce

3. **Produktové sekce**
   - 8 produktových linií s kalkulačkami úspor a ROI

4. **Reference a případové studie**
   - Filtrované podle segmentu, technologie, regionu

5. **O nás**
   - Mise, vize, hodnoty, tým, technologie Convert NG ONE

6. **Znalostní centrum**
   - Blog, průvodci, kalkulačky, dotační poradna

7. **Kontakt a poptávka**
   - Smart formulář podle typu projektu, live chat

---

# 5. UX/UI design strategie

## 5.1 Design systém

### Barevná paleta:
- Primární: Modrá (#1F4E78) - důvěra, technologie
- Sekundární: Zelená (#2E7D32) - udržitelnost, ekologie
- Akcent: Oranžová (#FF6B35) - energie, teplo
- Neutrální: Šedá škála pro profesionalitu

### Typografie:
- Nadpisy: Inter / Montserrat (bold, moderní, čitelné)
- Tělo textu: Inter / Open Sans (optimální pro web)
- Responzivní škála: 14-18px tělo, 24-48px nadpisy

## 5.2 Klíčové UX komponenty

### Hero sekce s inteligentní segmentací:
- 'Jaký typ objektu chcete vytápět?' → dynamické přesměrování
- Vizuální ikony pro RD / BD / Firmy / Obce

### Interaktivní kalkulačky:
- Kalkulačka úspor (vstup: typ objektu, plocha, současný zdroj)
- ROI kalkulátor (výstup: úspora Kč/rok, návratnost)
- Dotační kalkulátor (integrace aktuálních programů)

### Produktové konfigurace:
- Vizuální srovnání 8 produktových linií
- Interaktivní rozhodovací strom (Doporučovač řešení)
- Dynamické cenové tabulky s filtry

### Reference a social proof:
- Interaktivní mapa referencí s filtry
- Video testimonials zákazníků
- Před/po srovnání (náklady, emise, komfort)

## 5.3 Responzivita a accessibility

- Mobile-first přístup (60%+ mobilního provozu)
- WCAG 2.1 AA compliance
- Optimalizace rychlosti: Core Web Vitals score 90+
- PWA možnosti pro offline přístup ke kalkulačkám

---

# 6. Databázový design

## 6.1 Hlavní entity a vztahy

### Produkty (products):
- 8 produktových linií s kompletními parametry
- Cenové modely, požadavky, výhody/nevýhody
- Vztahy k cílovým segmentům

### Segmenty (segments):
- RD, BD, Developery, Obce, Tepelná hospodářství
- Specifické požadavky a pain points
- Personalizovaný content a CTA

### Reference (references):
- 150+ dokončených projektů
- Kategorizace podle typu, regionu, technologie
- Metriky: úspory, ROI, spokojenos zákazníků

### Poptávky (inquiries):
- Smart formuláře s dynamickými poli
- Automatická kvalifikace leadů
- Integrace s CRM systémem

### Obsah (content):
- Blog články, případové studie, průvodci
- SEO optimalizace, tagging, kategorieizace
- Vícejazyčnost (CZ/EN pro B2B)

## 6.2 Datová struktura produktů

Schéma tabulky products:

| Pole | Typ | Popis |
|------|-----|-------|
| id | UUID | Primární klíč |
| name | VARCHAR(255) | Název produktu |
| slug | VARCHAR(255) | URL-friendly název |
| segments | ARRAY | Cílové segmenty (RD/BD/etc.) |
| price_range | JSONB | Min/max ceny komponent |
| advantages | TEXT[] | Seznam výhod |
| disadvantages | TEXT[] | Seznam nevýhod |
| min_heat_price | INTEGER | Min. cena tepla pro využití (Kč/GJ) |

---

# 7. Content strategie

## 7.1 SEO a content marketing

### Klíčová témata:
- Tepelná čerpadla pro rodinné domy / bytové domy
- Fotovoltaika a komunitní energetika
- Dotace na obnovitelné zdroje 2025-2027
- ROI kalkulace energetických úspor
- ESG reporting a udržitelná energetika

### Content formáty:
- Měsíční blog (min. 4 články)
- Quarterly case studies (rozsáhlé analýzy projektů)
- Průvodci ke stažení (PDF lead magnets)
- Video obsahy (instalace, zákaznické příběhy)
- Webináře a online konzultace

## 7.2 Personalizovaný content podle segmentů

| Segment | Content fokus |
|---------|---------------|
| **Rodinné domy** | Návratnost investice, dotace, energetická nezávislost, komfort bydlení |
| **Bytové domy** | Snížení nákladů SVJ, legislativa, komunitní energetika, dlouhodobá úspora |
| **Developery/Firmy** | ESG, nízká uhlíková stopa, B2B partnerství, hromadné projekty |
| **Obce** | Ekologická zodpovědnost, legislativní podpora, finanční úlevy, modernizace |

---

# 8. Produktové sekce webu

Každá z 8 produktových linií bude mít dedikovanou landing page s:

1. **Přehled řešení**
   - Co zahrnuje, pro koho je vhodné, klíčové výhody

2. **Interaktivní ceník**
   - Dynamická kalkulace podle parametrů projektu

3. **ROI kalkulátor**
   - Vstup: současné náklady, typ objektu → Výstup: roční úspora, návratnost

4. **Reference**
   - Filtrované případové studie pro daný produkt

5. **FAQ**
   - Nejčastější otázky specifické pro produkt

6. **CTA a poptávkový formulář**
   - Předvyplněné pole s produktem, smart questions

## 8.1 Příklad: Produkt 1 - TČ + FVE pro vytápění a TUV

### Struktura stránky:

- Hero: 'Maximální úspora energie s tepelným čerpadlem a fotovoltaikou'
- Benefit section: Grafická vizualizace úspor (energie z ovzduší + slunce)
- Cílový segment: Pro objekty s cenou tepla nad 900 Kč/GJ
- Cenový modul: TČ 2,8M Kč + FVE 1,5M Kč = 4,3M Kč bez DPH
- Dotační info: Aktuální programy NZÚ, Opravdu zelená energie
- ROI viz: Interactive slider s parametry objektu
- Case studies: 3 nejrelevantnější reference
- Smart CTA: 'Zjistit úsporu pro váš objekt' → formulář

---

# 9. Technická implementace

## 9.1 Fáze 1: Foundation (0-3 měsíce)

- Setup infrastruktury: Next.js projekt, PostgreSQL DB, hosting
- Design systém: Komponenty, barevná paleta, typografie
- Databázové schéma: Produkty, segmenty, reference
- Headless CMS setup: Sanity/Strapi konfigurace
- Core pages: Domů, O nás, Kontakt

## 9.2 Fáze 2: Produkty a kalkulátory (3-6 měsíců)

- 8 produktových landing pages
- Interaktivní kalkulačky: ROI, úspory, dotace
- Produktový konfigurátor a doporučovač
- Smart formuláře s lead qualification
- Email automatizace (welcome sequence, follow-ups)

## 9.3 Fáze 3: Content a reference (6-9 měsíců)

- Blog platforma s CMS
- Reference database: 150+ projektů s filtry
- Interaktivní mapa referencí
- Video galerie a testimonials
- Knowledge base a průvodci

## 9.4 Fáze 4: Optimalizace a pokročilé funkce (9-12 měsíců)

- A/B testing klíčových landing pages
- Personalizace podle segmentu (cookies, behavioral tracking)
- Live chat a chatbot integrace
- CRM integrace (propojení s interním systémem)
- Analytics dashboard pro management
- PWA optimalizace

---

# 10. Udržitelnost a škálovatelnost

## 10.1 Technická udržitelnost

- Component-driven development: Reusable React komponenty
- Type-safe database operations (Prisma / Drizzle)
- Automated testing: Unit, integration, E2E testy
- CI/CD pipeline: Automated deployments
- Documentation: Storybook pro UI, API docs

## 10.2 Content udržitelnost

- Headless CMS: Non-tech uživatelé mohou spravovat obsah
- Content templates: Předpřipravené šablony pro konzistenci
- Asset management: Centralizovaná správa médií
- Version control: Historie změn a rollback možnosti
- Editorial workflow: Draft → Review → Publish proces

## 10.3 Škálovatelnost pro růst

### Produktová škálovatelnost:
- Flexibilní databázové schéma pro nové produkty
- Dynamické landing page generování
- API-first přístup pro budoucí integrace

### Personální škálovatelnost:
- Role-based access control (RBAC)
- Team collaboration features v CMS
- Onboarding dokumentace pro nové členy týmu

### Výkonnostní škálovatelnost:
- Edge computing: CDN distribuce statického contentu
- Database indexing a query optimization
- Caching strategie: Redis pro session a často používaná data
- Image optimization: Next.js Image + Cloudinary
- Lazy loading a code splitting

---

# 11. Implementační roadmap

## 11.1 Timeline a milestones

| Časové období | Fáze | Klíčové deliverables |
|---------------|------|---------------------|
| Q1 2025 | Discovery & Design | Design systém, wireframes, databázové schéma, tech stack setup |
| Q2 2025 | MVP Development | Core pages, CMS, základní produktové sekce, formuláře |
| Q3 2025 | Launch & Iterate | Soft launch, user testing, kalkulátory, A/B testing |
| Q4 2025 | Content & SEO | Blog, reference, SEO optimalizace, backlink building |
| Q1 2026 | Advanced Features | CRM integrace, personalizace, live chat, analytics dashboard |

## 11.2 KPI a měření úspěchu

### Provozní metriky:
- Page load time < 2s
- Core Web Vitals score > 90
- Mobile responsiveness 100%
- Uptime > 99.9%

### Business metriky:
- Conversion rate (visit → lead): 3-5%
- Lead quality score: monitoring kvalifikovaných leadů
- Cost per lead: benchmark a optimalizace
- Organic traffic growth: +50% YoY

### Uživatelské metriky:
- Average session duration > 3 min
- Bounce rate < 40%
- Pages per session > 4
- Calculator engagement rate > 15%

---

# 12. Závěr

Tento strategický dokument poskytuje komplexní roadmap pro integraci strategických informací AC Heating do moderní webové platformy. Klíčem k úspěchu je:

- **Datově řízený přístup** - všechny informace o produktech, trzích a referencích centralizované v databázi
- **Segmentovaná UX** - personalizovaný obsah pro RD, BD, B2B a obce
- **Škálovatelná architektura** - připravená na růst z 108 na 129 zaměstnanců a z 353M na 522M Kč tržeb
- **Měřitelná hodnota** - jasné KPI a continuous optimization
- **Udržitelný vývoj** - dokumentace, best practices, přístupné pro celý tým

## Doporučené další kroky:

1. Stakeholder approval a finalizace tech stacku
2. Assembly development týmu (frontend, backend, UX/UI designer)
3. Kick-off workshop s klíčovými stakeholdery
4. Sprint 0: Setup infrastruktury a design systému
5. Kontinuální feedback loop s obchodním a marketingovým týmem

---

*——— Konec dokumentu ———*