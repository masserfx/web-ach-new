# 📊 Neo4j Queries - Kompletní průvodce

Kompletní kolekce 33 Cypher dotazů pro monitoring a analytiku AC Heating systému.

## 🚀 Rychlý start

### Přístup k Neo4j Browser

```
URL: http://91.99.126.53:7474
Username: neo4j
Password: ac-heating-2024
```

### Jak používat dotazy

1. Otevřete Neo4j Browser
2. Zkopírujte dotaz z tohoto dokumentu
3. Vložte do query editoru
4. Stiskněte **Ctrl+Enter** pro spuštění
5. Prohlédněte si výsledky v tabulce nebo grafu

### Interaktivní dashboard

Otevřete: `file:///Users/lhradek/ac-heating-web-new/scripts/strategy/neo4j_dashboard.html`

Nebo na serveru:
```bash
cd ~/ac-heating-web-new/scripts/strategy
python3 -m http.server 8080
# Otevřete: http://91.99.126.53:8080/neo4j_dashboard.html
```

## 📑 Kategorie dotazů

- [Dashboard (3 dotazy)](#dashboard---quick-overview)
- [Agent Monitoring (7 dotazů)](#agent-monitoring)
- [Task Monitoring (5 dotazů)](#task-monitoring)
- [Learning & Patterns (4 dotazy)](#learning--patterns)
- [Web Content (6 dotazů)](#web-content-analytics)
- [Advanced Analytics (7 dotazů)](#advanced-analytics)
- [Real-time (3 dotazy)](#real-time-monitoring)
- [Strategic (3 dotazy)](#strategic-insights)

---

## 📊 Dashboard - Quick Overview

### #1 - Celkový přehled systému

**Použití:** První dotaz pro rychlý overview

```cypher
MATCH (a:Agent), (t:Task), (e:Execution), (l:Learning)
RETURN 
    count(DISTINCT a) as total_agents,
    count(DISTINCT t) as total_tasks,
    count(DISTINCT e) as total_executions,
    count(DISTINCT l) as total_learnings;
```

**Output:** Celkové počty všech hlavních entit

---

### #2 - Současný stav tasků

**Použití:** Zobrazit rozdělení tasků podle statusu

```cypher
MATCH (t:Task)
RETURN 
    t.status as status,
    count(t) as task_count
ORDER BY task_count DESC;
```

**Output:** Status (backlog, in_progress, done) + počet

---

### #3 - Agent Performance Overview

**Použití:** Rychlý přehled performance všech agentů

```cypher
MATCH (a:Agent)-[:EXECUTED]->(e:Execution)
RETURN 
    a.name as agent,
    count(e) as executions,
    round(avg(e.quality_score) * 100) / 100 as avg_quality,
    round(sum(e.api_cost) * 100) / 100 as total_cost,
    sum(e.tokens_used) as total_tokens
ORDER BY executions DESC;
```

**Output:** Tabulka s metrikami pro každého agenta

---

## 🤖 Agent Monitoring

### #4 - Detail jednotlivého agenta

**Použití:** Kompletní informace o vybraném agentovi

```cypher
MATCH (a:Agent {name: "content_writer"})-[:EXECUTED]->(e:Execution)
OPTIONAL MATCH (e)-[:FOR_TASK]->(t:Task)
RETURN 
    a.name as agent,
    a.tasks_completed as tasks_completed,
    a.avg_quality_score as avg_quality,
    count(e) as total_executions,
    collect(DISTINCT t.title)[0..5] as recent_tasks
ORDER BY e.started_at DESC;
```

**Tip:** Změňte `"content_writer"` na jiného agenta

**Dostupní agenti:**
- `content_writer`
- `seo_specialist`
- `product_manager`
- `marketing_copy`

---

### #5 - Agent Collaboration Network

**Použití:** Zjistit, kteří agenti spolupracují na společných tascích

```cypher
MATCH (a1:Agent)-[:EXECUTED]->(e1:Execution)-[:FOR_TASK]->(t:Task)
      <-[:FOR_TASK]-(e2:Execution)<-[:EXECUTED]-(a2:Agent)
WHERE a1 <> a2 AND id(e1) < id(e2)
RETURN 
    a1.name as agent_1,
    a2.name as agent_2,
    count(DISTINCT t) as shared_tasks
ORDER BY shared_tasks DESC;
```

**Vizualizace:** Přepněte na Graph view pro síťový graf

---

### #6 - Agent Performance Trends

**Použití:** Sledovat trend kvality v čase

```cypher
MATCH (a:Agent {name: "seo_specialist"})-[:EXECUTED]->(e:Execution)
WITH a, e
ORDER BY e.started_at DESC
LIMIT 20
RETURN 
    e.started_at as date,
    e.quality_score as quality,
    e.tokens_used as tokens,
    e.status as status;
```

**Vizualizace:** Použijte graf pro zobrazení trendu

---

## 📝 Task Monitoring

### #8 - Task Detail s kompletní historií

**Použití:** Zobrazit všechny executions pro daný task

```cypher
MATCH (t:Task {task_id: "YOUR_TASK_ID_HERE"})
OPTIONAL MATCH (t)<-[:FOR_TASK]-(e:Execution)<-[:EXECUTED]-(a:Agent)
OPTIONAL MATCH (e)-[:GENERATED]->(l:Learning)
RETURN 
    t.title as task_title,
    t.status as status,
    t.priority as priority,
    collect({
        agent: a.name,
        execution_id: e.execution_id,
        started: e.started_at,
        quality: e.quality_score,
        learnings: count(l)
    }) as execution_history
ORDER BY e.started_at DESC;
```

**Jak získat task_id:**
Použijte dotaz #10 pro seznam tasků a jejich IDs

---

### #10 - Nedokončené tasky

**Použití:** Zobrazit všechny pending/in-progress tasky

```cypher
MATCH (t:Task)
WHERE t.status IN ['backlog', 'in_progress']
OPTIONAL MATCH (a:Agent)-[:ASSIGNED_TO]->(t)
RETURN 
    t.title as task,
    t.status as status,
    t.priority as priority,
    t.category as category,
    a.name as assigned_agent
ORDER BY t.priority ASC, t.created_at DESC;
```

**Použití:** Ideální pro denní planning

---

## 🧠 Learning & Patterns

### #13 - Všechny naučené patterns

**Použití:** Zobrazit všechny patterns s metrikami

```cypher
MATCH (p:Pattern)
RETURN 
    p.description as pattern,
    p.pattern_type as type,
    p.frequency as frequency,
    round(p.success_rate * 100) as success_rate_pct
ORDER BY p.frequency DESC, p.success_rate DESC;
```

**Output:** Seznam patterns seřazený podle úspěšnosti

---

### #15 - High-Impact Learnings

**Použití:** Najít nejdůležitější learnings

```cypher
MATCH (l:Learning)
WHERE l.impact_score > 0.7
OPTIONAL MATCH (l)-[:LEARNED_FROM]->(p:Pattern)
OPTIONAL MATCH (e:Execution)-[:GENERATED]->(l)
OPTIONAL MATCH (a:Agent)-[:EXECUTED]->(e)
RETURN 
    l.learning_id as learning_id,
    l.pattern_type as pattern,
    l.impact_score as impact,
    l.confidence as confidence,
    a.name as learned_by,
    p.description as pattern_description
ORDER BY l.impact_score DESC
LIMIT 20;
```

**Použití:** Identifikovat klíčové insights

---

## 📰 Web Content Analytics

### #17 - Všechny články s metrikami

**Použití:** Zobrazit všechny publikované články

```cypher
MATCH (a:Article)
OPTIONAL MATCH (a)-[:CONTAINS_IMAGE]->(i:Image)
OPTIONAL MATCH (a)-[:IN_CATEGORY]->(c:Category)
OPTIONAL MATCH (agent:Agent)-[:CREATED]->(a)
RETURN 
    a.title as title,
    a.status as status,
    a.views as views,
    a.shares as shares,
    a.word_count as words,
    count(i) as images,
    c.name as category,
    agent.name as created_by,
    a.published_date as published
ORDER BY a.views DESC;
```

**Output:** Kompletní content inventory

---

### #18 - Top Performing Content

**Použití:** 10 nejúspěšnějších článků

```cypher
MATCH (a:Article)
WHERE a.views IS NOT NULL
RETURN 
    a.title as article,
    a.views as views,
    a.shares as shares,
    (a.views + a.shares * 5) as engagement_score,
    a.category as category
ORDER BY engagement_score DESC
LIMIT 10;
```

**Engagement score:** `views + (shares × 5)` - čím vyšší, tím lepší

---

### #21 - Article → Task Connection

**Použití:** Propojení článků s původními tasky

```cypher
MATCH (t:Task)-[:GENERATED_CONTENT]->(a:Article)
OPTIONAL MATCH (agent:Agent)-[:CREATED]->(a)
RETURN 
    t.title as source_task,
    a.title as article_title,
    a.views as views,
    agent.name as agent,
    a.published_date as published
ORDER BY a.views DESC;
```

**Použití:** Trackovat ROI jednotlivých tasků

---

## 🔍 Advanced Analytics

### #23 - Complete Content Pipeline

**Použití:** Vizualizace celého flow: Agent → Task → Article → Images

```cypher
MATCH path = (agent:Agent)-[:EXECUTED]->(e:Execution)-[:FOR_TASK]->(t:Task)
              -[:GENERATED_CONTENT]->(a:Article)-[:CONTAINS_IMAGE]->(i:Image)
RETURN 
    agent.name as agent,
    t.title as task,
    a.title as article,
    count(i) as images,
    e.quality_score as quality,
    a.views as views
ORDER BY a.views DESC
LIMIT 10;
```

**Vizualizace:** Přepněte na Graph view!

---

### #24 - ROI Analysis

**Použití:** Cost vs Performance analýza

```cypher
MATCH (e:Execution)-[:FOR_TASK]->(t:Task)
OPTIONAL MATCH (t)-[:GENERATED_CONTENT]->(a:Article)
RETURN 
    t.category as category,
    count(e) as executions,
    round(sum(e.api_cost) * 100) / 100 as total_cost,
    round(avg(e.quality_score) * 100) / 100 as avg_quality,
    sum(a.views) as total_views,
    round(sum(a.views) / sum(e.api_cost)) as views_per_dollar
ORDER BY views_per_dollar DESC;
```

**Metrika:** Views per dollar - efektivita investice

---

### #32 - Agent Efficiency Comparison

**Použití:** Porovnat efektivitu agentů

```cypher
MATCH (a:Agent)-[:EXECUTED]->(e:Execution)
WITH a, e
RETURN 
    a.name as agent,
    count(e) as total_executions,
    round(avg(e.tokens_used)) as avg_tokens_per_task,
    round(avg(e.api_cost) * 100) / 100 as avg_cost_per_task,
    round(avg(e.quality_score) * 100) / 100 as avg_quality,
    round((avg(e.quality_score) / avg(e.api_cost)) * 100) / 100 as quality_per_dollar
ORDER BY quality_per_dollar DESC;
```

**Metrika:** Quality per dollar - nejlepší agent?

---

## 🔥 Real-Time Monitoring

### #28 - Poslední Activity (24h)

**Použití:** Zobrazit všechnu aktivitu za poslední den

```cypher
MATCH (e:Execution)
WHERE e.started_at > datetime() - duration({hours: 24})
OPTIONAL MATCH (a:Agent)-[:EXECUTED]->(e)
OPTIONAL MATCH (e)-[:FOR_TASK]->(t:Task)
RETURN 
    e.started_at as timestamp,
    a.name as agent,
    t.title as task,
    e.status as status,
    e.quality_score as quality,
    e.tokens_used as tokens
ORDER BY e.started_at DESC
LIMIT 50;
```

**Použití:** Denní reporting

---

### #30 - Error Analysis

**Použití:** Najít poslední chyby

```cypher
MATCH (e:Execution)
WHERE e.status = "error" OR e.error_message IS NOT NULL
OPTIONAL MATCH (a:Agent)-[:EXECUTED]->(e)
OPTIONAL MATCH (e)-[:FOR_TASK]->(t:Task)
RETURN 
    e.started_at as timestamp,
    a.name as agent,
    t.title as task,
    e.error_message as error,
    e.status as status
ORDER BY e.started_at DESC
LIMIT 20;
```

**Použití:** Debugging a troubleshooting

---

## 🎯 Strategic Insights

### #31 - Content Gap Analysis

**Použití:** Najít kategorie s nedostatkem obsahu

```cypher
MATCH (c:Category)
OPTIONAL MATCH (a:Article)-[:IN_CATEGORY]->(c)
WITH c, count(a) as article_count
RETURN 
    c.name as category,
    article_count,
    CASE 
        WHEN article_count = 0 THEN 'CRITICAL - No content'
        WHEN article_count < 3 THEN 'LOW - Need more content'
        WHEN article_count < 10 THEN 'MEDIUM - Good start'
        ELSE 'HIGH - Well covered'
    END as coverage_level
ORDER BY article_count ASC;
```

**Použití:** Content strategy planning

---

### #33 - Viral Content Prediction

**Použití:** Predikce virality článků

```cypher
MATCH (a:Article)
WHERE a.published_date IS NOT NULL
WITH a, 
     (a.views + a.shares * 5) as engagement,
     duration.between(a.published_date, datetime()).days as days_old
WHERE days_old > 0
RETURN 
    a.title as article,
    a.views as views,
    a.shares as shares,
    engagement,
    days_old,
    round(engagement / days_old) as engagement_per_day,
    CASE 
        WHEN engagement / days_old > 100 THEN '🔥 VIRAL'
        WHEN engagement / days_old > 50 THEN '📈 TRENDING'
        WHEN engagement / days_old > 20 THEN '✅ GOOD'
        ELSE '📊 NORMAL'
    END as performance_level
ORDER BY engagement_per_day DESC;
```

**Metrika:** Engagement per day - virální potenciál

---

## 📚 Soubory

```
~/ac-heating-web-new/scripts/strategy/
├── neo4j_queries.cypher          # Všechny dotazy v jednom souboru
├── neo4j_dashboard.html          # Interaktivní dashboard
├── web_content_schema.py         # Python API pro web content
├── import_web_content.py         # Import sample content
└── NEO4J_QUERIES_GUIDE.md        # Tento dokument
```

## 🚀 Import web content

```bash
cd ~/ac-heating-web-new/scripts/strategy

# Import sample articles, images, categories
~/.local/bin/uv run import_web_content.py --sample
```

To vytvoří:
- 4 kategorie
- 2 obrázky
- 3 články
- 2 pages
- Propojení mezi všemi entitami

## 💡 Tipy & Triky

### Vlastní vizualizace

```cypher
// Zobrazit pouze graf (ne tabulku)
MATCH path = (a:Agent)-[:EXECUTED]->(e:Execution)-[:FOR_TASK]->(t:Task)
RETURN path
LIMIT 100
```

### Export dat

```cypher
// Export do CSV (v Neo4j Browser: Download as CSV)
MATCH (a:Article)
RETURN a.title, a.views, a.shares
```

### Filtrování podle data

```cypher
// Pouze články z posledních 30 dnů
MATCH (a:Article)
WHERE a.published_date > datetime() - duration({days: 30})
RETURN a.title, a.views
```

### Agregace

```cypher
// Průměry, sumy, max/min
MATCH (a:Article)
RETURN 
    avg(a.views) as avg_views,
    max(a.views) as max_views,
    sum(a.shares) as total_shares
```

## 🎨 Vizualizace v Neo4j Browser

### Graph View
- Nejlepší pro relationship queries
- Klikněte na node pro detail
- Double-click pro expand

### Table View
- Nejlepší pro numerical data
- Sortování kliknutím na header
- Export do CSV

### Text View
- Raw Cypher výsledky
- Dobré pro debugging

---

**Happy Querying!** 🚀

Máte otázky? Podívejte se na `NEO4J_INTEGRATION_GUIDE.md`
