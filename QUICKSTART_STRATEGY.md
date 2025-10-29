# 🚀 Strategy Implementation System - Quick Start

Tímto průvodcem spustíš AI-powered Strategy Implementation System v 5 minutách.

## Co máš připraveno?

✅ Supabase PostgreSQL database
✅ Next.js admin dashboard (`/admin/strategy`)
✅ 4 speciální AI agenti (Claude-powered)
✅ 20 vzorových tasků pokrývajících strategii
✅ Orchestrator pro automatizaci
✅ Progress tracking a reporting

## 5-Minute Setup

### Step 1: Naviguj do Python scripts

```bash
cd scripts/strategy
```

### Step 2: Vygeneruj Python prostředí

```bash
# Instaluj všechny Python závislosti
uv sync
```

> **Potřebuješ `uv`?** Instaluj z: https://docs.astral.sh/uv/getting-started/installation/

### Step 3: Importuj vzorové tasky

```bash
# To vytvoří 20 tasků v databázi - ŽÁDNÝ API klíč není potřeba!
uv run import_sample_tasks.py
```

### Step 4: Otevři dashboard v prohlížeči

```
http://localhost:3100/admin/strategy
```

✨ **Vidíš checklist se 6 strategickými sekcemi a 20 tasky!**

## Co vidíš v dashboardu?

### 🎯 Přehled Strategie (Strategy Overview)
Interaktivní checklist všech 6 sekcí:
- **Vize** - Brand Positioning (3 tasky)
- **Mise** - Komunikace hodnot (2 tasky)
- **Cíle** - Obchodní metriky (1 task)
- **Obchod** - 3 segmenty (4 tasky)
- **SEO** - Online viditelnost (4 tasky)
- **Personalizace** - Obsah (6 tasků)

Každá sekce má:
- ✓ Progress bar
- ✓ Počet tasků
- ✓ Expandovatelný seznam tasků
- ✓ Prioritas a přiřazené agenty

### 📋 Kanban Board
Vizuální workflow: Backlog → In Progress → Review → Done

### ✓ Approval Queue
Schvalování AI-generated obsahu s verzováním

### 📊 Progress Metrics
Milestones, kategorie, agent performance, timeline

### 📝 Execution Logs
Detailní logy spuštění agentů, API costs, token usage

## Příští kroky (Volitelné)

### Spusť AI orchestrator na tasků

```bash
# Dry run - podívej se co se stane
uv run run_orchestrator.py --dry-run --limit 3

# Spusť skutečné spuštění na 5 tasků
uv run run_orchestrator.py --limit 5
```

**Potřebuješ API klíč?**
1. Jdi na: https://console.anthropic.com/keys
2. Vytvoř nový klíč
3. Zkopíruj do `scripts/strategy/.env`:
   ```env
   ANTHROPIC_API_KEY=sk-your-key-here
   ```

### Generuj progress report

```bash
# JSON format
uv run generate_report.py --output report.json

# HTML format
uv run generate_report.py --output report.html --format html
```

## Struktura tasků

### Priority stupně
- 🔴 **Critical (1)** - Essential, do first
- 🟠 **High (2)** - Important, do soon
- 🟡 **Normal (3)** - Can wait

### Agenti

| Agent | Speciality |
|-------|-----------|
| 👤 **content_writer** | Blog articles, case studies, messaging |
| 🔍 **seo_specialist** | Keyword research, meta optimization, SEO audit |
| 📦 **product_manager** | Product descriptions, features, value props |
| 💬 **marketing_copy** | Landing pages, CTAs, persuasive copy |

### Kategorie tasků

- **content** - Blog posts, articles, messaging
- **seo** - Keyword research, optimization
- **product** - Product pages, descriptions
- **marketing** - Campaigns, landing pages, CTAs
- **technical** - Dashboards, integrations
- **ux** - User experience, copy, flows
- **business** - KPIs, metrics, planning

## Sample Tasks - Co je v balíčku?

```
20 tasků celkem:

📊 Vize (3): Brand positioning, guidelines, homepage
💬 Mise (2): Mission statement, about page
📈 Cíle (1): KPI dashboard
🏠 Obchod (4): Rodiny domy, bytovky, B2B
🔍 SEO (4): Content, optimization, video, social
✨ Personalizace (6): Newsletters, case studies, landing pages, UX
```

Příklady tasků:
- "Vytvoř Brand Positioning dokument" → content_writer
- "Napiš SEO obsah - Tepelná čerpadla" → seo_specialist
- "Vytvoř Landing Page - Dotace 2025" → marketing_copy
- "Nastav KPI Dashboard" → (manual)

## Troubleshooting

### "Chyba: ModuleNotFoundError"
```bash
# Znovu synchronizuj Python dependencies
uv sync
```

### "Chyba: Failed to connect to database"
Database je zapnutá? Zkontroluj si v Supabase dashboard že tabulky existují.

```bash
# Zkontroluj že migration 004 byla spuštěna
psql -h 91.99.126.53 -U postgres -d postgres
\dt strategy_tasks
```

### "Chyba: ANTHROPIC_API_KEY not found"
To je normální pro `import_sample_tasks.py` - ten API klíč nepotřebuje!

API klíč je potřeba až pro:
- `run_orchestrator.py` (spuštění AI agentů)
- `generate_tasks.py` (generování tasků z strategie)

## Tipy & Triky

### Dry run vs. Real execution
```bash
# Podívej se co se bude dělat BEZ provedení
uv run import_sample_tasks.py --dry-run
uv run run_orchestrator.py --dry-run

# Potvrď a spusť
uv run import_sample_tasks.py
```

### Zobrazování statusu
```bash
# Jak vidět co se děje
curl http://localhost:3100/api/strategy/stats | jq

# Shrnutí
curl http://localhost:3100/api/strategy/summary | jq
```

### Debuggování
```bash
# Podívej se na logy tasků
SELECT * FROM strategy_tasks ORDER BY created_at DESC LIMIT 10;

# Logy spuštění
SELECT * FROM execution_logs ORDER BY started_at DESC LIMIT 5;

# Schválení čeká
SELECT * FROM task_approvals WHERE review_status = 'pending';
```

## Dokumentace

Pro detailnější informace si přečti:

- **README.md** - Kompletní dokumentace
- **SETUP_GUIDE.md** - Instalace, konfigurce, cron jobs
- **DEMO_REPORT.html** - Vizuální přehled (otevři v prohlížeči)

## 🎉 Hotovo!

Úspěšně jsi spustil Strategy Implementation System!

Příští kroky:
1. Sleduj tasky v dashboardu
2. Schvaluj AI obsah v Approval Queue
3. Sleduj metriky a logy
4. Generuj reporty
5. Spouštěj orchestrator dle potřeby

## 💡 Extra: Scheduling (Production)

Pokud chceš automatické spouštění:

```bash
# Každých 6 hodin
0 */6 * * * cd /path/to/scripts/strategy && uv run run_orchestrator.py --limit 10

# Denně v 8 AM
0 8 * * * cd /path/to/scripts/strategy && uv run generate_report.py --output report.html --format html
```

Viz `SETUP_GUIDE.md` pro detailní instrukce.

---

**Máš otázky?** Podívej se do README.md nebo SETUP_GUIDE.md 🚀
