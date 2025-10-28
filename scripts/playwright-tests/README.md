# Playwright MCP Testing Suite pro AC Heating Web

## 📁 Obsah

Tento adresář obsahuje testovací dokumentaci a skripty pro Playwright MCP.

### Soubory

1. **`test-produkty-page.md`** - Kompletní testovací scénáře pro stránku /produkty
2. **`quick-test-commands.md`** - Ready-to-use příkazy (copy & paste)
3. **`README.md`** - Tento soubor

---

## 🚀 Quick Start

### 1. Instalace (HOTOVO ✅)
```bash
npm install -g @playwright/mcp
```

### 2. Konfigurace (HOTOVO ✅)
Playwright MCP je nakonfigurován v `~/.claude/mcp_servers.json`:
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp", "--browser", "chromium"]
  }
}
```

### 3. Restart Claude CLI (⚠️ NUTNÉ)
```bash
# Ukončit současnou session
exit

# Spustit znovu
claude
```

### 4. První Test
Po restartu zkopíruj a vlož:
```
Použij Playwright MCP a naviguj na http://91.99.126.53:3100/produkty.
Pořiď screenshot a řekni mi, kolik produktů je na stránce.
```

---

## 📚 Dokumentace

### Test Scénáře
Otevři `test-produkty-page.md` pro kompletní seznam testovacích scénářů:
- ✅ Základní navigace a struktura
- ✅ SEO a meta tags
- ✅ Výkonové metriky
- ✅ Interaktivní elementy
- ✅ Responzivní design
- ✅ Accessibility (A11y)
- ✅ Loading states

### Rychlé Příkazy
Otevři `quick-test-commands.md` pro ready-to-use příkazy:
- 🎯 10 předpřipravených testů
- 📋 Copy & paste do Claude CLI
- 🔍 Základní analýza → Bug detection

---

## 🛠️ Playwright MCP Tools

Po restartu Claude CLI budou dostupné:

| Tool | Popis | Příklad |
|------|-------|---------|
| `playwright_navigate` | Navigace na URL | `navigate("http://...")` |
| `playwright_screenshot` | Screenshot | `screenshot(fullPage: true)` |
| `playwright_click` | Kliknutí | `click("button")` |
| `playwright_fill` | Vyplnění | `fill("input", "text")` |
| `playwright_extract` | Extrakce dat | `extract(".product-card")` |
| `playwright_evaluate` | JS eval | `evaluate("window.innerWidth")` |
| `playwright_wait` | Čekání | `wait(".product-card")` |

---

## 📊 Testované URL

- **Produkce**: http://91.99.126.53:3100/produkty
- **Localhost**: http://localhost:3100/produkty

---

## 🎯 Co Testujeme

### Performance
- ⚡ Page load time < 2s
- ⚡ FCP < 1.8s
- ⚡ LCP < 2.5s
- ⚡ TTI < 3.8s
- ⚡ CLS < 0.1

### SEO
- 📝 Title tag (60 chars max)
- 📝 Meta description (160 chars max)
- 📝 Canonical URL
- 📝 Open Graph tags
- 📝 Schema.org markup

### Accessibility
- ♿ Semantic HTML
- ♿ ARIA labels
- ♿ Alt texts
- ♿ Keyboard navigation
- ♿ Color contrast (WCAG AA)

### UX
- 🎨 Responsive design (mobile, tablet, desktop)
- 🎨 Loading states (skeletons)
- 🎨 Hover effects
- 🎨 Interactive elements
- 🎨 Error handling

---

## 🐛 Známé Problémy k Ověření

Z předchozí analýzy víme o těchto potenciálních problémech:

1. ⚠️ **Canonical URL** možná odkazuje na homepage místo `/produkty`
2. ⚠️ **Meta description** je možná generická
3. ⚠️ **Chybí Product Schema.org** markup
4. ⚠️ **JavaScript bundle** je 216 KB (Framer Motion)
5. ⚠️ **SEO score** ~75/100 (prostor pro zlepšení)

Playwright MCP nám pomůže tyto problémy ověřit a změřit.

---

## 📈 Očekávané Výsledky

Po provedení testů získáme:

### Automatické Reporty
- ✅ SEO Audit Report
- ✅ Performance Report
- ✅ Accessibility Report
- ✅ Bug Detection Report
- ✅ Competitive Analysis

### Metriky
- 📊 Loading times
- 📊 Bundle sizes
- 📊 Lighthouse scores
- 📊 Web Vitals
- 📊 User experience metrics

### Doporučení
- 💡 Top 10 optimalizací
- 💡 SEO improvements
- 💡 Performance tweaks
- 💡 A11y fixes
- 💡 UX enhancements

---

## 🔄 Workflow

1. **Restart Claude CLI** (nutné po instalaci)
2. **Vyber test** z `quick-test-commands.md`
3. **Zkopíruj příkaz** do Claude CLI
4. **Dostaneš report** s výsledky
5. **Implementuj změny** podle doporučení
6. **Re-test** pro ověření zlepšení

---

## 💾 Výstupy

Testy můžeme ukládat do:
```
~/ac-heating-web-new/
├── test-results/
│   ├── screenshots/
│   ├── performance/
│   ├── seo/
│   └── accessibility/
└── reports/
    ├── produkty-audit-2025-10-27.md
    └── performance-baseline.json
```

---

## 🚨 Troubleshooting

### Playwright MCP se nespustí?
```bash
# Zkontroluj instalaci
npm list -g @playwright/mcp

# Manuální test
npx @playwright/mcp --browser chromium
```

### Browser se neotevře?
```bash
# Nainstaluj Chromium
npx playwright install chromium
```

### Claude nevidí MCP tools?
1. ⚠️ **RESTART Claude CLI** (nejčastější příčina)
2. Zkontroluj JSON syntax: `cat ~/.claude/mcp_servers.json | jq .`
3. Zkontroluj logy: `tail -f ~/.claude/debug/*.log`

---

## 📖 Další Zdroje

- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Playwright Docs](https://playwright.dev/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎓 Learning Path

1. **Začínáme** - `quick-test-commands.md` → Příkaz #1
2. **SEO** - `quick-test-commands.md` → Příkaz #2
3. **Performance** - `quick-test-commands.md` → Příkaz #3
4. **Pokročilé** - `test-produkty-page.md` → Všechny scénáře
5. **Automatizace** - Vytvoř vlastní test suite

---

## ✅ Checklist

- [x] Playwright MCP nainstalován
- [x] Konfigurace v `mcp_servers.json`
- [x] Testovací dokumentace vytvořena
- [ ] **Claude CLI restartován** ⚠️ DŮLEŽITÉ
- [ ] První test proveden
- [ ] Report analyzován
- [ ] Optimalizace implementovány

---

**Vytvořeno**: 2025-10-27
**Projekt**: AC Heating Web New
**Účel**: Quality assurance & optimization
**Maintainer**: Claude Code
