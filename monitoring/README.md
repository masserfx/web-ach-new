# AC Heating Website Monitoring System

Automatizovaný monitoring systém postavený na **Claude Agent SDK** pro sledování výkonu, SEO a změn obsahu webu AC Heating.

## Funkce

- **🚀 Lighthouse Performance Monitoring** - Automatické kontroly výkonu, dostupnosti, SEO
- **📊 Content Change Detection** - Detekce změn obsahu pomocí hashování
- **🔔 Smart Notifications** - Upozornění při porušení prahových hodnot
- **📈 Trend Analysis** - Sledování trendů v čase
- **🤖 AI-Powered Analysis** - Inteligentní analýza a doporučení pomocí Claude

## Instalace

```bash
cd monitoring
npm install
```

## Použití

### Kontinuální monitoring (běží neustále)

```bash
npm run monitor
```

Spustí monitoring v intervalu 30 minut (konfigurovatelné).

### Jednorázová kontrola

```bash
npm run check
```

Provede jednu kontrolu a ukončí se.

### Zobrazení posledního reportu

```bash
npm run report
```

### Development režim (auto-reload)

```bash
npm run dev
```

## Konfigurace

### Environment Variables

```bash
# Webhook pro notifikace (Slack, Discord, Teams, etc.)
export MONITORING_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Interval kontroly v minutách (default: 30)
export MONITORING_INTERVAL=30
```

### Config v kódu

Upravte `DEFAULT_CONFIG` v `website-monitor.ts`:

```typescript
const DEFAULT_CONFIG: MonitorConfig = {
  baseUrl: 'http://91.99.126.53:3100',
  pages: [
    '/',
    '/produkty',
    '/produkty/convert-ng-one-l',
    // Přidejte další stránky
  ],
  checkInterval: 30,
  lighthouseThresholds: {
    performance: 95,
    accessibility: 95,
    bestPractices: 95,
    seo: 100,
  },
  reportPath: './monitoring/reports',
};
```

## Architektura

### MCP Tools

Systém používá **Model Context Protocol (MCP)** server s custom tools:

1. **`lighthouse_check`** - Spouští Lighthouse audit
2. **`page_content_hash`** - Generuje hash obsahu stránky
3. **`save_report`** - Ukládá report do filesystému
4. **`send_notification`** - Posílá notifikace přes webhook

### Claude Agent SDK

```typescript
const results = query({
  prompt: '...', // Monitoring úkol
  options: {
    model: 'sonnet',
    mcpServers: {
      monitoring: monitoringServer, // Custom MCP server
    },
    allowedTools: [
      'lighthouse_check',
      'page_content_hash',
      'save_report',
      'send_notification',
    ],
    permissionMode: 'bypassPermissions', // Pro CI/CD
    systemPrompt: {
      type: 'preset',
      preset: 'claude_code',
      append: '...', // Přidání monitoring expertise
    },
  },
});
```

## Formát reportu

Reporty jsou ukládány jako JSON:

```json
{
  "timestamp": "2025-10-31T10:30:00Z",
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
        "cumulativeLayoutShift": 0.02
      },
      "contentHash": "abc123...",
      "contentChanged": false
    }
  ],
  "alerts": [],
  "recommendations": [
    "Vynikající výkon! Všechny metriky jsou nad prahovými hodnotami."
  ]
}
```

## Integrace do CI/CD

### GitHub Actions

```yaml
name: Website Monitoring

on:
  schedule:
    - cron: '0 */2 * * *' # Každé 2 hodiny
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd monitoring
          npm install

      - name: Run monitoring check
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          MONITORING_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        run: |
          cd monitoring
          npm run check

      - name: Upload reports
        uses: actions/upload-artifact@v3
        with:
          name: monitoring-reports
          path: monitoring/reports/
```

### GitLab CI

```yaml
website-monitoring:
  image: node:20
  script:
    - cd monitoring
    - npm install
    - npm run check
  artifacts:
    paths:
      - monitoring/reports/
  schedule:
    - cron: "0 */2 * * *"
```

## Příklad notifikace (Slack)

```json
{
  "message": "⚠️ Performance degradation detected on /produkty",
  "severity": "warning",
  "timestamp": "2025-10-31T10:30:00Z",
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

## Troubleshooting

### Lighthouse fails to run

```bash
# Nainstalujte Chrome/Chromium
sudo apt-get install chromium-browser

# Nebo použijte Docker
docker run --rm -v $(pwd):/app node:20 bash -c "cd /app/monitoring && npm run check"
```

### MCP server connection issues

```bash
# Zkontrolujte log
DEBUG=* npm run check

# Ověřte dostupnost tools
npx @modelcontextprotocol/inspector
```

### Permission denied errors

```bash
# Ujistěte se, že máte práva pro zápis reportů
chmod +x website-monitor.ts
mkdir -p monitoring/reports
chmod 755 monitoring/reports
```

## Příklady použití

### Jednoduchý check před deploymentem

```bash
#!/bin/bash
echo "Running pre-deployment checks..."
cd monitoring && npm run check

if [ $? -eq 0 ]; then
  echo "✅ All checks passed - proceeding with deployment"
  # Deploy commands...
else
  echo "❌ Monitoring check failed - aborting deployment"
  exit 1
fi
```

### Sledování výkonu po deploymentu

```bash
# Deploy
npm run build && pm2 restart ac-heating-web

# Počkej 30s na stabilizaci
sleep 30

# Spusť monitoring
cd monitoring && npm run check

# Pokud je performance < 95, rollback
```

## Rozšíření

### Přidání vlastního MCP tool

```typescript
const customTool = tool(
  'custom_check',
  'Your custom monitoring check',
  {
    param: z.string().describe('Description'),
  },
  async (args) => {
    // Your logic here
    return {
      content: [
        {
          type: 'text',
          text: 'Result',
        },
      ],
    };
  }
);

// Přidat do monitoringServer
const monitoringServer = createSdkMcpServer({
  name: 'website-monitoring',
  version: '1.0.0',
  tools: [
    lighthouseCheckTool,
    pageContentHashTool,
    saveReportTool,
    sendNotificationTool,
    customTool, // <-- Nový tool
  ],
});
```

## Licence

MIT

## Podpora

Pro otázky a problémy vytvořte issue na GitHubu.
