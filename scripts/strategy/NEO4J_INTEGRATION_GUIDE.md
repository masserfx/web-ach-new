# Neo4j Integration & Learning System Guide

Kompletní průvodce Neo4j integrací pro AC Heating Strategy Orchestrator.

## 📊 Přehled systému

Systém nyní využívá **2 databáze**:
- **PostgreSQL** - Primární data (tasks, agents, executions)
- **Neo4j** - Graf vztahů a learning patterns

### Graf schema

```
┌────────┐                  ┌────────┐
│ Agent  │─[ASSIGNED_TO]──>│  Task  │
└────────┘                  └────────┘
    │                           ▲
    │                           │
    ▼                           │
┌──────────┐─[FOR_TASK]────────┘
│Execution │
└──────────┘
    │
    ▼
┌──────────┐─[LEARNED_FROM]─>┌─────────┐
│ Learning │                 │ Pattern │
└──────────┘                 └─────────┘
```

## 🚀 Rychlý start

### 1. Spuštění Neo4j

```bash
cd ~/ac-heating-web-new/scripts/strategy

# Spustit Neo4j container
docker compose -f docker-compose.neo4j.yml up -d

# Sledovat logy
docker logs -f ac-heating-neo4j
```

### 2. Ověření připojení

```bash
# Otevřít Neo4j Browser
# URL: http://91.99.126.53:7474
# Username: neo4j
# Password: ac-heating-2024
```

### 3. Spuštění orchestrátoru s Neo4j

```bash
# Aktivovat virtual environment
source .venv/bin/activate

# Spustit orchestrator (Neo4j se automaticky inicializuje)
~/.local/bin/uv run run_orchestrator.py --limit 3

# Dry run test
~/.local/bin/uv run run_orchestrator.py --dry-run --limit 3
```

## 🔧 Konfigurace

### .env nastavení

```bash
# Neo4j Graph Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ac-heating-2024
NEO4J_ENABLED=true
```

### Vypnutí Neo4j (pokud nechcete používat)

```bash
# V .env nastavit:
NEO4J_ENABLED=false
```

## 📈 Funkce systému

### 1. Relationship Tracking

Každá exekuce tasku vytvoří v Neo4j:
- **Agent node** - s performance metrikami
- **Task node** - s metadaty
- **Execution node** - s výsledky
- **Relationships** - propojení mezi všemi entity

### 2. Learning System

Automaticky sbírá feedback:
```python
feedback_data = {
    "task_category": "content_writing",
    "agent_type": "content_writer",
    "quality_delta": 0.3,  # Improvement over baseline
    "performance_delta": 0.1
}
```

Vytváří patterns:
- `quality_pattern` - vzory pro kvalitu
- `error_pattern` - vzory pro chyby
- `optimization_pattern` - optimalizační vzory

### 3. Recommendations

Systém poskytuje doporučení na základě naučených vzorů:
```python
recommendations = learning.get_recommendations(
    task_data=task,
    agent_name="content_writer"
)
```

## 🛠️ Používání

### Dotazy v Neo4j

```cypher
// Zobrazit všechny agenty
MATCH (a:Agent) RETURN a

// Zobrazit task history
MATCH (t:Task {task_id: "uuid"})<-[:FOR_TASK]-(e:Execution)<-[:EXECUTED]-(a:Agent)
RETURN a.name, e.quality_score, e.started_at

// Najít nejlepší patterns
MATCH (p:Pattern)
WHERE p.success_rate > 0.7
RETURN p.description, p.frequency, p.success_rate
ORDER BY p.success_rate DESC, p.frequency DESC

// Agent performance
MATCH (a:Agent {name: "content_writer"})-[:EXECUTED]->(e:Execution)
RETURN 
    count(e) as total_executions,
    avg(e.quality_score) as avg_quality,
    sum(e.tokens_used) as total_tokens

// Learning insights
MATCH (l:Learning)-[:LEARNED_FROM]->(p:Pattern)
RETURN 
    p.pattern_type,
    count(l) as learning_count,
    avg(l.confidence) as avg_confidence
```

### Python API

```python
# Import
from neo4j_db import init_neo4j
from learning_system import LearningSystem

# Inicializace
neo4j_conn = init_neo4j(
    uri="bolt://localhost:7687",
    user="neo4j",
    password="ac-heating-2024"
)

learning = LearningSystem(neo4j_conn)

# Get agent performance
perf = neo4j_conn.get_agent_performance("content_writer")
print(f"Total executions: {perf['total_executions']}")
print(f"Avg quality: {perf['avg_quality']}")

# Get task history
history = neo4j_conn.get_task_history(task_id)
for exec in history:
    print(f"{exec['agent_name']}: {exec['status']}")

# Get learning insights
insights = learning.analyze_agent_learning("seo_specialist")
print(f"Learning velocity: {insights['learning_velocity']}")

# Export report
report = learning.export_learning_report(output_format="json")
# nebo
markdown_report = learning.export_learning_report(output_format="markdown")
```

## 📊 Reporting

### Generovat learning report

```bash
# JSON report
~/.local/bin/uv run run_orchestrator.py --limit 5 --report learning_report.json

# Report obsahuje:
# - batch_results: výsledky exekuce
# - status_report: celkový stav
# - neo4j_insights: metriky z Neo4j
# - learning_insights: naučené vzory
```

### Vizualizace v Neo4j Browser

1. Otevřít http://91.99.126.53:7474
2. Přihlásit se (neo4j / ac-heating-2024)
3. Spustit dotazy výše

## 🐛 Troubleshooting

### Neo4j container neběží

```bash
# Zkontrolovat status
docker ps | grep neo4j

# Restartovat
docker restart ac-heating-neo4j

# Sledovat logy
docker logs -f ac-heating-neo4j
```

### Connection refused

```bash
# Zkontrolovat, že Neo4j běží
docker ps | grep neo4j

# Zkontrolovat port
netstat -tulpn | grep 7687

# Testovat připojení
telnet localhost 7687
```

### Import chyba

```bash
# Zkontrolovat, že neo4j driver je nainstalován
~/.local/bin/uv pip list | grep neo4j

# Reinstalovat
cd ~/ac-heating-web-new/scripts/strategy
~/.local/bin/uv add neo4j
```

## 📚 Další zdroje

### Neo4j dokumentace
- Browser: http://91.99.126.53:7474
- Bolt: bolt://localhost:7687

### Soubory
- `neo4j_db.py` - Connection manager
- `learning_system.py` - Learning & pattern recognition
- `orchestrator.py` - Integrace s orchestrátorem
- `docker-compose.neo4j.yml` - Docker konfigurace

## 🎯 Next Steps

### Rozšíření systému

1. **Pattern similarity** - Najít podobné patterns
```python
# V neo4j_db.py přidat:
def find_similar_patterns(pattern_id, similarity_threshold=0.8):
    # Implementace similarity search
```

2. **Agent collaboration** - Sledovat spolupráci mezi agenty
```cypher
MATCH (a1:Agent)-[:EXECUTED]->(e1:Execution)-[:FOR_TASK]->(t:Task)
      <-[:FOR_TASK]-(e2:Execution)<-[:EXECUTED]-(a2:Agent)
WHERE a1 <> a2
RETURN a1.name, a2.name, count(t) as shared_tasks
```

3. **Quality prediction** - Predikovat kvalitu na základě patterns
```python
def predict_quality(task_data, agent_name):
    similar_patterns = find_similar_patterns(task_data)
    return weighted_average([p.success_rate for p in similar_patterns])
```

## ✅ Checklist

- [x] Neo4j Docker container běží
- [x] Python driver nainstalován
- [x] Config soubory aktualizovány
- [x] Orchestrátor integrován
- [x] Learning systém funkční
- [ ] Vyzkoušet kompletní workflow
- [ ] Otestovat learning insights
- [ ] Vytvořit custom patterns
- [ ] Vizualizovat v Neo4j Browser

## 🎉 Hotovo!

Systém je připraven k použití. Spusťte první task a sledujte, jak se vytváří graf v Neo4j!

```bash
~/.local/bin/uv run run_orchestrator.py --limit 1
```
