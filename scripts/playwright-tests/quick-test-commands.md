# Rychlé Testovací Příkazy pro Playwright MCP

## 🚀 Okamžité Testy (Copy & Paste)

Po restartu Claude CLI zkopírujte tyto příkazy:

---

## 1️⃣ Základní Analýza Stránky

```
Použij Playwright MCP a proveď kompletní analýzu stránky http://91.99.126.53:3100/produkty:

1. Naviguj na URL
2. Pořiď fullpage screenshot
3. Extrahuj a spočítej:
   - Počet produktových karet
   - Názvy všech kategorií
   - Ceny produktů (pokud jsou zobrazené)
4. Zkontroluj meta tags:
   - <title>
   - meta description
   - canonical URL
5. Změř loading time
6. Zkontroluj, zda jsou všechny obrázky načtené

Výstup formátuj jako strukturovaný report.
```

---

## 2️⃣ SEO Audit

```
Použij Playwright MCP a udělej SEO audit stránky http://91.99.126.53:3100/produkty:

Zkontroluj:
- Title tag (max 60 znaků)
- Meta description (max 160 znaků)
- Canonical URL (správná URL)
- Open Graph tags (og:title, og:description, og:image)
- Schema.org structured data (zkontroluj JSON-LD)
- H1 heading (pouze jeden?)
- Alt texty u obrázků
- Internal links

Vytvoř SEO score (0-100) a seznam doporučení.
```

---

## 3️⃣ Performance Test

```
Použij Playwright MCP a změř výkon stránky http://91.99.126.53:3100/produkty:

Změř:
1. Page load time (celkový čas načtení)
2. Time to First Byte (TTFB)
3. First Contentful Paint (FCP)
4. Largest Contentful Paint (LCP)
5. Time to Interactive (TTI)
6. Total page size (HTML + assets)
7. Number of requests
8. JavaScript bundle sizes

Porovnej s Web Vitals thresholds a dej doporučení.
```

---

## 4️⃣ Accessibility Check

```
Použij Playwright MCP a zkontroluj přístupnost na http://91.99.126.53:3100/produkty:

Zkontroluj:
1. Semantic HTML (používá správné tagy?)
2. ARIA labels u interaktivních elementů
3. Keyboard navigation (Tab order)
4. Focus indicators
5. Alt texty u všech obrázků
6. Color contrast ratio (WCAG AA standard)
7. Form labels
8. Button labels

Vytvoř A11y score a seznam problémů k opravě.
```

---

## 5️⃣ Interaktivní Test

```
Použij Playwright MCP a otestuj interaktivitu na http://91.99.126.53:3100/produkty:

1. Klikni na první produktovou kartu
2. Zkontroluj, zda se URL změnila
3. Vrať se zpět na /produkty
4. Hover nad druhou produktovou kartou
5. Zkontroluj hover efekt (změna stylu?)
6. Klikni na tlačítko "Poptávka" u třetího produktu
7. Zkontroluj, kam vede

Report: Co funguje, co nefunguje, návrhy zlepšení.
```

---

## 6️⃣ Responsive Design Test

```
Použij Playwright MCP a otestuj responzivní design na http://91.99.126.53:3100/produkty:

Otestuj na třech viewportech:
1. Desktop: 1920x1080
2. Tablet: 768x1024
3. Mobile: 375x667

Pro každý viewport:
- Pořiď screenshot
- Zkontroluj layout (grid columns)
- Zkontroluj čitelnost textu
- Zkontroluj touch targets (min 44x44px na mobile)
- Zkontroluj, zda se vše vejde na obrazovku

Vytvoř side-by-side porovnání a doporuč úpravy.
```

---

## 7️⃣ Lighthouse Audit Simulation

```
Použij Playwright MCP a simuluj Lighthouse audit na http://91.99.126.53:3100/produkty:

Zkontroluj klíčové Lighthouse metriky:

Performance:
- FCP < 1.8s
- LCP < 2.5s
- TTI < 3.8s
- CLS < 0.1

SEO:
- Meta tags přítomné
- Crawlable content
- Mobile friendly

Accessibility:
- Color contrast
- ARIA labels
- Alt texts

Best Practices:
- HTTPS
- No console errors
- Proper image formats

Vytvoř Lighthouse-style report s scores (0-100).
```

---

## 8️⃣ Porovnání s Competitors

```
Použij Playwright MCP a porovnej http://91.99.126.53:3100/produkty s konkurencí:

Naviguj postupně na:
1. http://91.99.126.53:3100/produkty (náš web)
2. [URL konkurenta 1]
3. [URL konkurenta 2]

Pro každou stránku změř:
- Loading time
- Number of products displayed
- Image quality
- CTA buttons prominence
- Mobile friendliness

Vytvoř srovnávací tabulku a competitive analysis report.
```

---

## 9️⃣ Content Extraction

```
Použij Playwright MCP a extrahuj veškerý obsah ze http://91.99.126.53:3100/produkty:

Extrahuj:
1. Všechny názvy produktů
2. Všechny ceny (pokud zobrazené)
3. Všechny kategorie
4. Všechny popisy produktů
5. Všechny URL obrázků
6. Všechny CTA button texty
7. Footer content
8. Navigation menu items

Výstup jako strukturovaný JSON.
```

---

## 🔟 Bug Detection

```
Použij Playwright MCP a hledej bugy na http://91.99.126.53:3100/produkty:

Zkontroluj:
1. Console errors (JavaScript)
2. Network errors (404, 500)
3. Broken images (alt text ale bez src)
4. Broken links (href="#" nebo prázdné)
5. FOUC (Flash of Unstyled Content)
6. Layout shifts during loading
7. Missing fallbacks (co když není produkt?)
8. Form validation issues

Vytvoř bug report s prioritami (Critical, High, Medium, Low).
```

---

## 📝 Jak Použít

1. **Restartuj Claude CLI**:
   ```bash
   # Ukončit současnou session
   exit

   # Spustit znovu
   claude
   ```

2. **Zkopíruj jakýkoliv příkaz výše**

3. **Vlož do Claude CLI promptu**

4. **Claude automaticky použije Playwright MCP**

5. **Dostaneš detailní report**

---

## 💡 Tips & Tricks

### Kombinace testů
```
Použij Playwright MCP a udělaj komplexní audit http://91.99.126.53:3100/produkty:
- SEO audit (příkaz #2)
- Performance test (příkaz #3)
- Accessibility check (příkaz #4)

Vytvoř jeden unified report s overall score a top 10 doporučení.
```

### Monitoring v čase
```
Použij Playwright MCP a udělej performance baseline pro http://91.99.126.53:3100/produkty:
- Změř všechny metriky
- Ulož do souboru ~/ac-heating-web-new/performance-baseline.json
- Tento baseline použijeme pro budoucí srovnání
```

### Automatizované testy
```
Vytvoř Playwright test suite pro /produkty, který:
1. Zkontroluje, že stránka se načte
2. Zkontroluje, že je alespoň 1 produkt
3. Zkontroluje, že všechny obrázky mají alt text
4. Zkontroluje, že CTA buttony fungují

Ulož jako ~/ac-heating-web-new/tests/e2e/produkty.spec.ts
```

---

**Note**: Tyto příkazy budou fungovat pouze po restartu Claude CLI!
