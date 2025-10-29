# Strategy Implementation System - Setup Guide

## Přehled

Tento systém automatizuje implementaci AC Heating strategie pomocí AI agentů. Skládá se z:

1. **Supabase PostgreSQL database** - Ukládání tasků, schválení, logů
2. **Python orchestrator** - Spouštění AI agentů
3. **Next.js admin dashboard** - `/admin/strategy` pro správu a monitoring
4. **REST API** - Integrace a automatizace

## Instalace Python prostředí

```bash
cd scripts/strategy
uv sync  # Instalace všech závislostí
```

## Konfigurace

Vytvořte `.env` soubor v `scripts/strategy/`:

```env
# Anthropic API
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-5-20250929

# Database
DB_HOST=91.99.126.53
DB_PORT=54321
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password-here
DB_SSL=true

# Application
LOG_LEVEL=INFO
DRY_RUN=false
```

## Spouštění skriptů

### 1. Import strategie (jednorázové)

```bash
uv run import_strategy.py
```

### 2. Generování tasků z strategie

```bash
# Dry run (bez uložení do DB)
uv run generate_tasks.py --dry-run

# Vytvoří tasks v databázi
uv run generate_tasks.py
```

### 3. Spuštění orchestratoru

```bash
# Jednoúkol v dávce
uv run run_orchestrator.py --limit 5

# Dry run
uv run run_orchestrator.py --dry-run --limit 3

# Kontinuální mód (každých 60 sekund)
uv run run_orchestrator.py --continuous --interval 60
```

### 4. Generování reportu

```bash
# JSON report
uv run generate_report.py --output report.json

# HTML report
uv run generate_report.py --output report.html --format html

# Tisknout na stdout
uv run generate_report.py
```

## Cron Job Setup (Linux/macOS)

### 1. Každých 6 hodin - Spusť orchestrator

```bash
crontab -e
# Přidej řádek:
0 */6 * * * cd /tmp/web-ach-new-temp/scripts/strategy && /home/user/.local/bin/uv run run_orchestrator.py --limit 10 >> /var/log/ac-heating-orchestrator.log 2>&1
```

### 2. Denně v 8 AM - Generuj report

```bash
0 8 * * * cd /tmp/web-ach-new-temp/scripts/strategy && /home/user/.local/bin/uv run generate_report.py --output /tmp/reports/report-$(date +\%Y-\%m-\%d).html --format html
```

### 3. Pravidelně - Kontroluj zdraví tasků

```bash
*/15 * * * * curl -X GET http://localhost:3100/api/strategy/stats -H "Authorization: Bearer $(cat /etc/ac-heating/api-key)" > /dev/null 2>&1
```

## Windows Task Scheduler

### PowerShell script: `run_orchestrator.ps1`

```powershell
$python = "C:\Users\User\.local\bin\uv"
$script = "C:\path\to\scripts\strategy\run_orchestrator.py"
$logfile = "C:\logs\orchestrator.log"

& $python run $script --limit 10 | Out-File -Append $logfile
```

Pak vytvořit task v Task Scheduleru:
- Program: `powershell.exe`
- Argumenty: `-ExecutionPolicy Bypass -File "C:\path\to\run_orchestrator.ps1"`
- Spuštění: Každých 6 hodin

## API Integration

### REST API pro trigger spouštění

```bash
# Spuštění orchestratoru přes API
curl -X POST http://localhost:3100/api/strategy/execute \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"limit": 5, "dryRun": false}'

# Kontrola statusu
curl http://localhost:3100/api/strategy/execute

# Statistiky
curl http://localhost:3100/api/strategy/stats

# Shrnutí
curl http://localhost:3100/api/strategy/summary
```

### Webhook trigger (GitHub Actions)

```yaml
# .github/workflows/run-orchestrator.yml
name: Run Strategy Orchestrator

on:
  schedule:
    - cron: '0 */6 * * *'  # Každých 6 hodin

jobs:
  orchestrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd scripts/strategy && pip install uv && uv sync
      - run: |
          cd scripts/strategy
          uv run run_orchestrator.py --limit 10 \
            --report /tmp/orchestrator-report.json
      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: orchestrator-report
          path: /tmp/orchestrator-report.json
```

## Monitoring

### Logging

Všechny skrypty logují do stdout. Pro production:

```bash
# Redirect do souboru
uv run run_orchestrator.py > /var/log/orchestrator.log 2>&1 &
```

### Health Check

```bash
# Kontrola posledního spuštění
SELECT MAX(created_at) as last_run FROM execution_logs;
```

### Alerts

```bash
# Pokud se za 8 hodin nespustil orchestrator
SELECT COUNT(*) as recent_runs
FROM execution_logs
WHERE created_at > NOW() - INTERVAL '8 hours'
  AND status = 'success';
```

## Production Checklist

- [ ] Database backups nakonfigurované
- [ ] `.env` soubor bezpečně uložen
- [ ] Cron jobs nakonfigurované
- [ ] Logging nastaveno
- [ ] Monitoring aktivní
- [ ] API klíče zabezpečeny
- [ ] Admin dashboard otestován
- [ ] Disaster recovery plán

## Troubleshooting

### Chyba: "Failed to connect to database"

```bash
# Testuj připojení
psql -h 91.99.126.53 -U postgres -d postgres
```

### Chyba: "Anthropic API error"

```bash
# Ověř API klíč v .env
# Zkontroluj kredity v Anthropic account
```

### Tasks nejdou do review

Ujisti se, že:
1. Agent je v databázi a `active=true`
2. Task má přiřazený `agent_name`
3. Nincí chyby v execution_logs

## Další informace

- Admin dashboard: `http://localhost:3100/admin/strategy`
- API dokumentace: `/api/strategy/*` endpoints
- Database schema: `supabase/migrations/004_strategy_implementation.sql`
