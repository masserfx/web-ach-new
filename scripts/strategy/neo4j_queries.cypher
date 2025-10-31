// ============================================================
// AC HEATING - NEO4J CYPHER QUERIES
// Kompletní sada dotazů pro monitoring a analytiku
// ============================================================

// ============================================================
// 📊 DASHBOARD - QUICK OVERVIEW
// ============================================================

// 1. Celkový přehled systému
MATCH (a:Agent), (t:Task), (e:Execution), (l:Learning)
RETURN 
    count(DISTINCT a) as total_agents,
    count(DISTINCT t) as total_tasks,
    count(DISTINCT e) as total_executions,
    count(DISTINCT l) as total_learnings;

// 2. Současný stav tasků
MATCH (t:Task)
RETURN 
    t.status as status,
    count(t) as task_count
ORDER BY task_count DESC;

// 3. Agent Performance Overview
MATCH (a:Agent)-[:EXECUTED]->(e:Execution)
RETURN 
    a.name as agent,
    count(e) as executions,
    round(avg(e.quality_score) * 100) / 100 as avg_quality,
    round(sum(e.api_cost) * 100) / 100 as total_cost,
    sum(e.tokens_used) as total_tokens
ORDER BY executions DESC;


// ============================================================
// 🤖 AGENT MONITORING
// ============================================================

// 4. Detail jednotlivého agenta
MATCH (a:Agent {name: "content_writer"})-[:EXECUTED]->(e:Execution)
OPTIONAL MATCH (e)-[:FOR_TASK]->(t:Task)
RETURN 
    a.name as agent,
    a.tasks_completed as tasks_completed,
    a.avg_quality_score as avg_quality,
    count(e) as total_executions,
    collect(DISTINCT t.title)[0..5] as recent_tasks
ORDER BY e.started_at DESC;

// 5. Agent Collaboration Network
MATCH (a1:Agent)-[:EXECUTED]->(e1:Execution)-[:FOR_TASK]->(t:Task)
      <-[:FOR_TASK]-(e2:Execution)<-[:EXECUTED]-(a2:Agent)
WHERE a1 <> a2 AND id(e1) < id(e2)
RETURN 
    a1.name as agent_1,
    a2.name as agent_2,
    count(DISTINCT t) as shared_tasks
ORDER BY shared_tasks DESC;

// 6. Agent Performance Trends (poslední executions)
MATCH (a:Agent {name: "seo_specialist"})-[:EXECUTED]->(e:Execution)
WITH a, e
ORDER BY e.started_at DESC
LIMIT 20
RETURN 
    e.started_at as date,
    e.quality_score as quality,
    e.tokens_used as tokens,
    e.status as status;

// 7. Všichni agenti s metrikami
MATCH (a:Agent)
RETURN 
    a.name as agent_name,
    a.agent_type as type,
    a.active as active,
    a.tasks_completed as tasks,
    round(a.avg_quality_score * 100) / 100 as avg_quality,
    round(a.success_rate * 100) as success_rate_pct
ORDER BY a.tasks_completed DESC;


// ============================================================
// 📝 TASK MONITORING
// ============================================================

// 8. Task Detail s kompletní historií
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

// 9. Tasky podle priorit a statusu
MATCH (t:Task)
RETURN 
    t.priority as priority,
    t.status as status,
    count(t) as count,
    collect(t.title)[0..3] as sample_tasks
ORDER BY t.priority ASC, count DESC;

// 10. Nedokončené tasky s assignovanými agenty
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

// 11. Task Dependencies Visualization
MATCH (t1:Task)-[:DEPENDS_ON]->(t2:Task)
RETURN 
    t1.title as task,
    t1.status as status,
    collect(t2.title) as depends_on,
    collect(t2.status) as dependency_status;

// 12. Tasks by Category Performance
MATCH (t:Task)
OPTIONAL MATCH (t)<-[:FOR_TASK]-(e:Execution)
RETURN 
    t.category as category,
    count(DISTINCT t) as total_tasks,
    count(e) as total_executions,
    avg(e.quality_score) as avg_quality,
    sum(e.tokens_used) as total_tokens
ORDER BY total_tasks DESC;


// ============================================================
// 🧠 LEARNING & PATTERNS
// ============================================================

// 13. Všechny naučené patterns
MATCH (p:Pattern)
RETURN 
    p.description as pattern,
    p.pattern_type as type,
    p.frequency as frequency,
    round(p.success_rate * 100) as success_rate_pct
ORDER BY p.frequency DESC, p.success_rate DESC;

// 14. Learning Insights per Agent
MATCH (a:Agent)-[:EXECUTED]->(e:Execution)-[:GENERATED]->(l:Learning)
MATCH (l)-[:LEARNED_FROM]->(p:Pattern)
RETURN 
    a.name as agent,
    count(DISTINCT l) as total_learnings,
    count(DISTINCT p) as unique_patterns,
    round(avg(l.confidence) * 100) / 100 as avg_confidence,
    round(avg(l.impact_score) * 100) / 100 as avg_impact,
    collect(DISTINCT p.pattern_type)[0..5] as pattern_types
ORDER BY total_learnings DESC;

// 15. High-Impact Learnings
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

// 16. Pattern Evolution Over Time
MATCH (l:Learning)-[:LEARNED_FROM]->(p:Pattern)
WITH p, l
ORDER BY l.created_at
RETURN 
    p.description as pattern,
    count(l) as learning_count,
    min(l.created_at) as first_seen,
    max(l.created_at) as last_seen,
    avg(l.confidence) as avg_confidence
ORDER BY learning_count DESC;


// ============================================================
// 📈 WEB CONTENT ANALYTICS
// ============================================================

// 17. Všechny články s metrikami
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

// 18. Top Performing Content
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

// 19. Image Usage Analytics
MATCH (i:Image)
OPTIONAL MATCH (a:Article)-[:CONTAINS_IMAGE]->(i)
RETURN 
    i.url as image_url,
    i.alt_text as alt_text,
    count(a) as used_in_articles,
    collect(a.title)[0..3] as articles
ORDER BY used_in_articles DESC;

// 20. Content by Category
MATCH (c:Category)
OPTIONAL MATCH (a:Article)-[:IN_CATEGORY]->(c)
RETURN 
    c.name as category,
    count(a) as article_count,
    round(avg(a.views)) as avg_views,
    sum(a.shares) as total_shares,
    collect(a.title)[0..3] as sample_articles
ORDER BY article_count DESC;

// 21. Article → Task Connection
MATCH (t:Task)-[:GENERATED_CONTENT]->(a:Article)
OPTIONAL MATCH (agent:Agent)-[:CREATED]->(a)
RETURN 
    t.title as source_task,
    a.title as article_title,
    a.views as views,
    agent.name as agent,
    a.published_date as published
ORDER BY a.views DESC;

// 22. Tag Cloud
MATCH (t:Tag)
OPTIONAL MATCH (a:Article)-[:TAGGED_WITH]->(t)
RETURN 
    t.name as tag,
    count(a) as article_count,
    sum(a.views) as total_views
ORDER BY article_count DESC;


// ============================================================
// 🔍 ADVANCED ANALYTICS
// ============================================================

// 23. Complete Content Pipeline
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

// 24. ROI Analysis (Cost vs Performance)
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

// 25. Quality Trends Over Time
MATCH (e:Execution)
WHERE e.started_at IS NOT NULL
WITH date(e.started_at) as day, e
RETURN 
    day,
    count(e) as executions,
    round(avg(e.quality_score) * 100) / 100 as avg_quality,
    sum(e.tokens_used) as tokens,
    round(sum(e.api_cost) * 100) / 100 as cost
ORDER BY day DESC
LIMIT 30;

// 26. Agent Specialization Matrix
MATCH (a:Agent)-[:EXECUTED]->(e:Execution)-[:FOR_TASK]->(t:Task)
RETURN 
    a.name as agent,
    t.category as category,
    count(e) as executions,
    round(avg(e.quality_score) * 100) / 100 as avg_quality
ORDER BY agent, executions DESC;

// 27. Knowledge Graph Completeness
MATCH (a:Agent)
OPTIONAL MATCH (a)-[:EXECUTED]->(e:Execution)
OPTIONAL MATCH (e)-[:FOR_TASK]->(t:Task)
OPTIONAL MATCH (e)-[:GENERATED]->(l:Learning)
OPTIONAL MATCH (l)-[:LEARNED_FROM]->(p:Pattern)
RETURN 
    count(DISTINCT a) as agents,
    count(DISTINCT e) as executions,
    count(DISTINCT t) as tasks,
    count(DISTINCT l) as learnings,
    count(DISTINCT p) as patterns,
    round(count(DISTINCT l) * 100.0 / count(DISTINCT e), 2) as learning_rate;


// ============================================================
// 🔥 REAL-TIME MONITORING
// ============================================================

// 28. Poslední Activity (Last 24h)
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

// 29. Active Tasks RIGHT NOW
MATCH (t:Task {status: "in_progress"})
OPTIONAL MATCH (a:Agent)-[:ASSIGNED_TO]->(t)
OPTIONAL MATCH (e:Execution)-[:FOR_TASK]->(t)
WHERE e.status = "running"
RETURN 
    t.title as task,
    a.name as agent,
    t.priority as priority,
    e.started_at as started,
    duration.between(e.started_at, datetime()).minutes as running_minutes;

// 30. Error Analysis
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


// ============================================================
// 🎯 STRATEGIC INSIGHTS
// ============================================================

// 31. Content Gap Analysis
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

// 32. Agent Efficiency Comparison
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

// 33. Viral Content Prediction
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
