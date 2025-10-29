# AC Heating - Strategy Orchestrator

Automatizovaný systém pro implementaci AC Heating strategie pomocí AI agentů.

## 📋 Co je v balíčku?

### Python Scripts
- `config.py` - Konfigurace a settings
- `models.py` - Data struktury
- `db.py` - Database connection wrapper
- `orchestrator.py` - Task orchestration engine
- `agents/` - AI agent implementace
  - `base_agent.py` - Base class
  - `content_writer.py` - Content generation
  - `seo_specialist.py` - SEO optimization
  - `product_manager.py` - Product descriptions
  - `marketing_copy.py` - Marketing copy

### Utility Scripts
- `import_strategy.py` - Importuj strategii z Markdown
- `import_sample_tasks.py` - **Importuj sample tasks (START HERE!)**
- `generate_tasks.py` - Generuj tasks pomocí Claude
- `run_orchestrator.py` - Spusť orchestrator
- `generate_report.py` - Generuj progress reporty

### Configuration
- `.env.example` - Příklad konfigurace
- `sample_tasks.json` - Vzorové tasky pro import
- `pyproject.toml` - Python projekt konfig

## 🚀 Quickstart

### 1. Setup Python prostředí

```bash
cd scripts/strategy
uv sync
```

### 2. Konfigurace (DŮLEŽITÉ!)

```bash
# Kopíruj example a vyplň své hodnoty
cp .env.example .env

# V .env vyplň:
# ANTHROPIC_API_KEY=sk-...  (z https://console.anthropic.com)
# DB_PASSWORD=...            (tvoje Supabase heslo)
```

### 3. Importuj sample tasks (bez API klíče!)

```bash
# Dry run - zkontroluj co se bude dělat
uv run import_sample_tasks.py --dry-run

# Importuj do databáze
uv run import_sample_tasks.py
```

### 4. Sleduj v dashboardu

Otevři: **http://localhost:3100/admin/strategy**

Měl bys vidět checklist se 20 vzorkovými tasky organizovanými do 6 sekcí:
- 🎯 Vize - Brand Positioning
- 💬 Mise - Komunikace hodnot
- 📊 Cíle - Obchodní metriky
- 🏠 Obchod - 3 segmenty
- 🔍 SEO & Viditelnost
- ✨ Personalizace obsahu

## 📊 Sample Tasks

20 tasky pokrývajících všechny aspekty strategie:

### Vize (3 tasky)
- Brand Positioning dokument
- Brand Identity Guidelines
- Homepage Hero Section

### Mise (2 tasky)
- Mise Statement & Values
- About Us obsah

### Cíle (1 task)
- KPI Dashboard setup

### Obchod (4 tasky)
- Rodinné domy (content + Google Ads)
- Bytové domy (content)
- B2B (Partner Portal)

### SEO (4 tasky)
- Tepelná čerpadla obsah
- Product Pages SEO
- Video strategie
- Social Media audit

### Personalizace (6 tasků)
- Email Newsletter
- Case Study
- Dotace Landing Page
- UX Copy
- HR Branding
- Product Comparison

## 🔄 Workflow

```
Sample Tasks (JSON)
        ↓
  import_sample_tasks.py
        ↓
  Databáze (strategy_tasks)
        ↓
  Dashboard (/admin/strategy)
        ↓
   Kanban Board + Checklist
        ↓
   run_orchestrator.py
        ↓
   AI Agents execute tasks
        ↓
   Progress tracking + Reports
```

## 🛠️ Utility Příkazy

```bash
# Importuj sample tasks
uv run import_sample_tasks.py

# Dry run - bez uložení do DB
uv run import_sample_tasks.py --dry-run

# Spusť orchestrator na 5 tasků
uv run run_orchestrator.py --limit 5

# Dry run orchestrator
uv run run_orchestrator.py --dry-run --limit 3

# Generuj progress report (JSON)
uv run generate_report.py --output report.json

# Generuj HTML report
uv run generate_report.py --output report.html --format html

# Kontinuální mode (každých 60 sekund)
uv run run_orchestrator.py --continuous --interval 60
```

## 📈 Dashboard Features

### Přehled Strategie (Strategy Overview)
- Vizuální checklist všech 6 sekcí
- Progress bary pro každou sekci
- Expandovatelné task listy
- Časová osa implementace

### Kanban Board
- Vizualizace workflow (Backlog → In Progress → Review → Done)
- Drag-and-drop task management
- Task detaily a prioritas

### Approval Queue
- Schvalování AI-generated obsahu
- Verze management
- Reviewer feedback

### Progress Metrics
- Milestones tracking
- Category breakdown
- Agent performance
- Quality scores

### Execution Logs
- Detailní logy spuštění agentů
- API cost tracking
- Token usage
- Error debugging

## 🔐 Security

- API klíč bezpečně v `.env` (nikdy v git!)
- Database password zabezpečeno
- RLS policies na Supabase (authenticated users only)
- Service role pro admin operace

## 📝 Logging

Všechny scripty logují do stdout. Pro production:

```bash
# Redirect do souboru
uv run run_orchestrator.py > /var/log/orchestrator.log 2>&1 &

# Sleduj logy
tail -f /var/log/orchestrator.log
```

## 🐛 Troubleshooting

### "Database connection refused"
```bash
# Zkontroluj, že máš správný heslo v .env
# Testuj připojení:
psql -h 91.99.126.53 -U postgres -d postgres
```

### "API key invalid"
```bash
# Zkontroluj API klíč v .env
# Nezapomeň `sk-` prefix
# Ověř kredity: https://console.anthropic.com/account/billing/overview
```

### Tasks nejdou do review
1. Zkontroluj `agent_skills` - agent musí být `active=true`
2. Zkontroluj `strategy_tasks` - musí mít `agent_name`
3. Podívej se na `execution_logs` na chyby

## 📚 Další informace

- **Admin Dashboard**: `/admin/strategy`
- **API Endpoints**: `/api/strategy/*`
- **Database Schema**: `supabase/migrations/004_strategy_implementation.sql`
- **Setup Guide**: `SETUP_GUIDE.md`

## 🎯 Next Steps

1. ✅ Import sample tasks (`import_sample_tasks.py`)
2. ✅ Sleduj v dashboardu
3. ⏭️ Spusť orchestrator (`run_orchestrator.py`)
4. ⏭️ Schvali obsah v Approval Queue
5. ⏭️ Monitoruj metriky a logy
6. ⏭️ Generuj reporty

## 📞 Support

Viz `SETUP_GUIDE.md` pro detailní dokumentaci včetně:
- Cron job setup
- GitHub Actions integration
- Systemd service
- Monitoring & alerting
- Production deployment
