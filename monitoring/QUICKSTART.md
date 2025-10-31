# Quick Start Guide - Website Monitoring System

## 5-minutová instalace a spuštění

### Krok 1: Instalace závislostí

```bash
cd monitoring
npm install
```

### Krok 2: Konfigurace

```bash
# Vytvoř .env soubor
cp .env.example .env

# Edituj .env a přidej svůj API klíč
nano .env  # nebo vim/code
```

V `.env` souboru nastav:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
```

### Krok 3: První spuštění

```bash
# Jednorázová kontrola
npm run check
```

Nebo použij pomocný script:

```bash
./run-check.sh
```

## Co se stane při spuštění?

1. **🔍 Claude AI agent se spustí** a začne analyzovat váš web
2. **🚀 Lighthouse audit** pro každou stránku (/, /produkty, atd.)
3. **📊 Content hash** pro detekci změn
4. **🤖 AI analýza** - Claude vyhodnotí výsledky
5. **💾 Report** se uloží do `reports/report-YYYY-MM-DD-HH-mm.json`
6. **📧 Notifikace** (pokud je nastavený webhook)

## Výstup

```
╔═══════════════════════════════════════════════════════════════╗
║         AC Heating Website Monitoring System                  ║
║                                                               ║
║  Base URL: http://91.99.126.53:3100                          ║
║  Check Interval: 30 minutes                                   ║
║  Pages Monitored: 5                                          ║
╚═══════════════════════════════════════════════════════════════╝

🚀 Starting website monitoring cycle...

🤖 Agent: Running Lighthouse check for /...
🤖 Agent: Performance: 98, SEO: 100, Accessibility: 100
🤖 Agent: Checking /produkty...
🤖 Agent: Performance: 95, SEO: 100, Accessibility: 100

✅ Monitoring cycle completed successfully
📊 Total cost: $0.0234
⏱️  Duration: 45.23s
```

## Formát reportu

Report je uložen jako JSON v `reports/`:

```json
{
  "timestamp": "2025-10-31T15:30:00Z",
  "overallStatus": "GREEN",
  "pages": [
    {
      "url": "http://91.99.126.53:3100/",
      "lighthouse": {
        "performance": 98,
        "accessibility": 100,
        "bestPractices": 100,
        "seo": 100
      },
      "metrics": {
        "firstContentfulPaint": 850,
        "largestContentfulPaint": 1200,
        "totalBlockingTime": 45,
        "cumulativeLayoutShift": 0.02,
        "speedIndex": 1450
      },
      "contentHash": "abc123def456...",
      "contentChanged": false
    }
  ],
  "alerts": [],
  "recommendations": [
    "Vynikající výkon! Všechny metriky jsou nad prahovými hodnotami.",
    "Homepage dosahuje 100/100 v SEO - zachovat současný stav."
  ],
  "summary": {
    "totalPages": 5,
    "pagesGreen": 5,
    "pagesYellow": 0,
    "pagesRed": 0,
    "avgPerformance": 97.2,
    "avgSEO": 100
  }
}
```

## Pokročilé použití

### Kontinuální monitoring (běží pořád)

```bash
npm run monitor
```

Systém poběží na pozadí a checkuje každých 30 minut.

### Vlastní interval

```bash
export MONITORING_INTERVAL=60  # 60 minut
npm run monitor
```

### Nastavení webhooků (Slack, Discord, Teams)

V `.env`:

```bash
# Slack webhook
MONITORING_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Discord webhook
MONITORING_WEBHOOK=https://discord.com/api/webhooks/YOUR_WEBHOOK

# Microsoft Teams webhook
MONITORING_WEBHOOK=https://outlook.office.com/webhook/YOUR_WEBHOOK
```

Když performance klesne pod threshold (95), dostanete notifikaci:

```json
{
  "message": "⚠️ Performance degradation detected on /produkty",
  "severity": "warning",
  "timestamp": "2025-10-31T15:30:00Z",
  "source": "AC Heating Website Monitor",
  "details": {
    "page": "/produkty",
    "metric": "performance",
    "current": 88,
    "threshold": 95,
    "previous": 98
  }
}
```

## Zobrazení posledního reportu

```bash
npm run report
```

## Development režim (auto-reload)

```bash
npm run dev
```

Automaticky restartuje při změně kódu.

## GitHub Actions (CI/CD)

Monitoring je automaticky nastavený v GitHub Actions:

- **Scheduled**: Běží každé 2 hodiny
- **Manual**: Můžete spustit ručně z Actions tab
- **PR Comments**: Přidá performance report do PR

### Potřebné secrets v GitHub:

```
Settings → Secrets and variables → Actions → New repository secret

- ANTHROPIC_API_KEY: sk-ant-api03-...
- SLACK_WEBHOOK: https://hooks.slack.com/...
- MONITORING_BASE_URL: http://your-url (optional)
```

## Troubleshooting

### "Lighthouse command not found"

```bash
npm install -g lighthouse
# nebo
npx lighthouse --version
```

### "ANTHROPIC_API_KEY not set"

```bash
# Zkontroluj .env
cat .env | grep ANTHROPIC_API_KEY

# Nebo nastav jako environment variable
export ANTHROPIC_API_KEY=sk-ant-api03-...
```

### "Permission denied: run-check.sh"

```bash
chmod +x run-check.sh
```

### Reports se neukládají

```bash
# Vytvoř reports adresář
mkdir -p reports
chmod 755 reports
```

## FAQ

**Q: Kolik to stojí?**
A: Jeden complete check (~5 stránek) stojí $0.02-0.05 pomocí Claude Sonnet. Pro Haiku (rychlejší check) ~$0.002-0.005.

**Q: Můžu změnit monitored pages?**
A: Ano, edituj `DEFAULT_CONFIG.pages` v `website-monitor.ts`:

```typescript
pages: [
  '/',
  '/produkty',
  '/produkty/convert-ng-one-l',
  '/blog',           // Přidat
  '/reference',      // Přidat
],
```

**Q: Můžu přidat vlastní metriky?**
A: Ano! Viz [ADVANCED.md](./ADVANCED.md) - sekce "Custom MCP Tools".

**Q: Funguje to na Windows?**
A: Ano, ale doporučujeme WSL2 nebo Docker.

**Q: Můžu to hostovat na vlastním serveru?**
A: Ano! Stačí dát do crontab:

```bash
# Každou hodinu
0 * * * * cd /path/to/monitoring && npm run check
```

## Co dál?

- 📖 Přečti [README.md](./README.md) pro detailní dokumentaci
- 🚀 Prozkoumej [ADVANCED.md](./ADVANCED.md) pro pokročilé features
- 🔧 Customizuj MCP tools pro vlastní potřeby
- 📊 Integruj do CI/CD pipeline

## Podpora

- 🐛 Problém? Vytvoř [GitHub Issue](https://github.com/your-repo/issues)
- 💬 Otázky? Kontaktuj tým
- 📧 Email: info@ac-heating.cz
