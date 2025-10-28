# Test stránky /produkty pomocí Playwright MCP

## Přehled
Tento dokument obsahuje instrukce pro testování stránky produktů pomocí Playwright MCP v Claude CLI.

## Předpoklady
- ✅ Playwright MCP je nainstalován globálně (`@playwright/mcp@0.0.44`)
- ✅ Konfigurace v `~/.claude/mcp_servers.json` je hotová
- ⚠️ **DŮLEŽITÉ**: Restart Claude CLI je nutný pro načtení nové konfigurace

## URL k testování
- **Produkce**: http://91.99.126.53:3100/produkty
- **Localhost**: http://localhost:3100/produkty

---

## Test Scénáře

### 1. Základní Navigace a Struktura
```
Úkol pro Claude (po restartu):
"Použij Playwright MCP a naviguj na http://91.99.126.53:3100/produkty.
Prozkoumej strukturu stránky a řekni mi:
1. Jaké hlavní elementy jsou na stránce
2. Kolik produktových karet je zobrazeno
3. Jaké kategorie produktů existují
4. Zda jsou všechny obrázky načteny"
```

### 2. SEO a Meta Tags
```
Úkol pro Claude:
"Použij Playwright MCP a zkontroluj SEO elementy na /produkty:
1. <title> tag
2. Meta description
3. Canonical URL
4. Open Graph tags
5. Schema.org structured data"
```

### 3. Výkonová Metriky
```
Úkol pro Claude:
"Použij Playwright MCP a změř výkonové metriky na /produkty:
1. Time to First Byte (TTFB)
2. First Contentful Paint (FCP)
3. Largest Contentful Paint (LCP)
4. Cumulative Layout Shift (CLS)
5. Time to Interactive (TTI)"
```

### 4. Interaktivní Elementy
```
Úkol pro Claude:
"Použij Playwright MCP a otestuj interaktivitu na /produkty:
1. Klikni na první produktovou kartu
2. Zkontroluj, zda se otevře detail produktu
3. Zkontroluj, zda tlačítko 'Poptávka' funguje
4. Otestuj hover efekty na kartách"
```

### 5. Responzivní Design
```
Úkol pro Claude:
"Použij Playwright MCP a otestuj responzivní design na /produkty:
1. Desktop (1920x1080)
2. Tablet (768x1024)
3. Mobile (375x667)
Zkontroluj layout, navigaci a čitelnost na každém rozlišení."
```

### 6. Accessibility (A11y)
```
Úkol pro Claude:
"Použij Playwright MCP a zkontroluj přístupnost na /produkty:
1. Semantic HTML struktura
2. ARIA labels
3. Keyboard navigation
4. Alt texty u obrázků
5. Kontrast barev"
```

### 7. Loading States
```
Úkol pro Claude:
"Použij Playwright MCP a zkontroluj loading states na /produkty:
1. Počet skeleton loaderů
2. Jak dlouho trvá zobrazení obsahu
3. Zda nejsou žádné flash of unstyled content (FOUC)"
```

---

## Očekávané Výstupy

### ✅ Co by mělo fungovat:
- Stránka se načte do 2 sekund
- Všechny produktové karty jsou zobrazeny
- Obrázky jsou optimalizované (AVIF/WebP)
- Skeleton loading states před načtením dat
- Smooth hover animace (Framer Motion)
- Všechny linky fungují
- Meta tags jsou správně nastavené

### ⚠️ Známé problémy k ověření:
- Canonical URL možná odkazuje na homepage místo /produkty
- Meta description je možná generická
- Chybí Product Schema.org markup
- JavaScript bundle je 216 KB (možná optimalizace)

---

## Příklad Použití v Claude CLI

Po restartu Claude CLI:

```bash
# 1. Spusť Claude CLI
claude

# 2. Zadej prompt s Playwright MCP
> Použij Playwright MCP a naviguj na http://91.99.126.53:3100/produkty.
  Udělej screenshot celé stránky a prozkoumej její strukturu.

# 3. Claude automaticky použije Playwright MCP tools:
# - playwright_navigate(url)
# - playwright_screenshot()
# - playwright_extract_content()
```

---

## Dostupné Playwright MCP Tools

Po restartu budou dostupné tyto nástroje:

| Tool | Popis |
|------|-------|
| `playwright_navigate` | Navigace na URL |
| `playwright_click` | Kliknutí na element |
| `playwright_fill` | Vyplnění formuláře |
| `playwright_screenshot` | Screenshot stránky/elementu |
| `playwright_extract` | Extrakce dat pomocí selektorů |
| `playwright_evaluate` | Spuštění JavaScript v browseru |
| `playwright_wait` | Čekání na element/stav |

---

## Troubleshooting

### Playwright MCP se nespustí?
```bash
# Zkontroluj instalaci
npm list -g @playwright/mcp

# Zkontroluj konfiguraci
cat ~/.claude/mcp_servers.json | jq .mcpServers.playwright

# Manuální spuštění pro test
npx @playwright/mcp --browser chromium
```

### Browser se neotevře?
```bash
# Nainstaluj Chromium pro Playwright
npx playwright install chromium
```

### Claude nevidí MCP tools?
- ⚠️ **Restartuj Claude CLI kompletně**
- Zkontroluj, že `mcp_servers.json` je validní JSON
- Zkontroluj logy v `~/.claude/debug/`

---

## Další Kroky

Po úspěšném testu můžeme:
1. Automatizovat testy v CI/CD
2. Vytvořit performance monitoring
3. Implementovat E2E testy
4. Nastavit regression testing

---

**Vytvořeno**: 2025-10-27
**Poslední update**: 2025-10-27
**Autor**: Claude Code
**Projekt**: AC Heating Web New
