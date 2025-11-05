-- 004_strategy_implementation.sql
-- AC Heating Strategy Implementation System
-- Created: 2025-10-29

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: agent_skills
-- Registry subagentů a jejich specializací
-- ============================================================================

CREATE TABLE agent_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Agent identification
  agent_name TEXT UNIQUE NOT NULL, -- 'seo_specialist', 'content_writer', etc.
  agent_type TEXT NOT NULL CHECK (agent_type IN ('content', 'seo', 'product', 'marketing', 'technical', 'ux')),
  display_name TEXT NOT NULL,
  description TEXT,

  -- Capabilities
  skills TEXT[] NOT NULL, -- ['blog_writing', 'keyword_research', 'meta_optimization']
  supported_content_types TEXT[], -- ['blog', 'landing_page', 'product_description']

  -- Configuration
  system_prompt TEXT NOT NULL, -- AI system prompt
  model TEXT DEFAULT 'claude-sonnet-4-5-20250929',
  max_tokens INTEGER DEFAULT 4096,
  temperature NUMERIC(2,1) DEFAULT 1.0,

  -- Execution config
  execution_config JSONB, -- Custom config per agent

  -- Performance metrics
  tasks_completed INTEGER DEFAULT 0,
  avg_quality_score NUMERIC(3,2),
  avg_execution_time NUMERIC(6,2), -- Minutes
  success_rate NUMERIC(5,2), -- Percentage

  -- Status
  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agent_skills_type ON agent_skills(agent_type);
CREATE INDEX idx_agent_skills_active ON agent_skills(active) WHERE active = true;
CREATE INDEX idx_agent_skills_name ON agent_skills(agent_name);

-- ============================================================================
-- TABLE: strategy_tasks
-- Úkoly ze strategického dokumentu
-- ============================================================================

CREATE TABLE strategy_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Task metadata
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('content', 'seo', 'product', 'marketing', 'technical', 'ux', 'business')),
  priority INTEGER DEFAULT 0 CHECK (priority BETWEEN 1 AND 5), -- 1=Critical, 5=Low

  -- Strategie reference
  strategy_section TEXT, -- Např: "7.1 SEO a content marketing"
  strategy_document TEXT DEFAULT 'ac_heating_web_strategy.md',

  -- Assignment
  assigned_to TEXT, -- 'ai-agent' nebo 'human:email@example.com'
  agent_name TEXT REFERENCES agent_skills(agent_name), -- Agent assignment
  agent_type TEXT, -- Typ agenta (cached from agent_skills)

  -- Execution details
  prompt_template TEXT, -- AI prompt pro generování
  expected_output JSONB, -- Expected output structure
  dependencies UUID[], -- Array of task IDs this depends on

  -- Status tracking
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'approved', 'rejected', 'done', 'blocked')),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),

  -- Approval workflow
  requires_approval BOOLEAN DEFAULT true,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected', NULL)),
  approved_by TEXT,
  approved_at TIMESTAMP,
  rejection_reason TEXT,

  -- Execution tracking
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_hours NUMERIC(4,1),
  actual_hours NUMERIC(4,1),

  -- Results
  output_content_id UUID, -- Will reference cms_content(id) once available
  output_data JSONB, -- Generated content or data
  quality_score NUMERIC(3,2) CHECK (quality_score BETWEEN 0 AND 1),

  -- Metadata
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_strategy_tasks_status ON strategy_tasks(status);
CREATE INDEX idx_strategy_tasks_category ON strategy_tasks(category);
CREATE INDEX idx_strategy_tasks_priority ON strategy_tasks(priority);
CREATE INDEX idx_strategy_tasks_agent ON strategy_tasks(agent_name);
CREATE INDEX idx_strategy_tasks_approval ON strategy_tasks(approval_status) WHERE requires_approval = true;
CREATE INDEX idx_strategy_tasks_created ON strategy_tasks(created_at DESC);

-- ============================================================================
-- TABLE: task_approvals
-- Workflow schvalování s verzováním
-- ============================================================================

CREATE TABLE task_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES strategy_tasks(id) ON DELETE CASCADE,

  -- Version control
  version INTEGER NOT NULL DEFAULT 1,

  -- Content snapshot
  content_snapshot JSONB NOT NULL, -- Snapshot of generated content
  changes_made TEXT, -- Description of changes from previous version

  -- Approval workflow
  submitted_by TEXT NOT NULL, -- AI agent or user
  submitted_at TIMESTAMP DEFAULT NOW(),

  reviewer_email TEXT,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
  reviewed_at TIMESTAMP,

  -- Feedback
  reviewer_notes TEXT,
  suggested_changes JSONB, -- Structured feedback

  -- Decision
  decision TEXT CHECK (decision IN ('approve', 'reject', 'request_revision', NULL)),
  decision_reason TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_task_approvals_task ON task_approvals(task_id, version DESC);
CREATE INDEX idx_task_approvals_status ON task_approvals(review_status);
CREATE INDEX idx_task_approvals_reviewer ON task_approvals(reviewer_email);
CREATE INDEX idx_task_approvals_created ON task_approvals(created_at DESC);

-- ============================================================================
-- TABLE: execution_logs
-- Detailní logy běhů agentů
-- ============================================================================

CREATE TABLE execution_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Task reference
  task_id UUID NOT NULL REFERENCES strategy_tasks(id) ON DELETE CASCADE,
  agent_name TEXT REFERENCES agent_skills(agent_name),

  -- Execution metadata
  execution_type TEXT CHECK (execution_type IN ('generation', 'revision', 'optimization', 'validation')),
  trigger_source TEXT CHECK (trigger_source IN ('manual', 'scheduled', 'workflow', 'api')),

  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER,

  -- Input/Output
  input_prompt TEXT,
  input_data JSONB,
  output_data JSONB,

  -- AI details
  model_used TEXT,
  tokens_used INTEGER,
  api_cost NUMERIC(10,6), -- USD

  -- Status
  status TEXT CHECK (status IN ('running', 'success', 'failed', 'cancelled')),
  error_message TEXT,
  error_details JSONB,

  -- Quality metrics
  output_quality_score NUMERIC(3,2),
  validation_errors TEXT[],

  -- Context
  user_agent TEXT,
  ip_address INET,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_execution_logs_task ON execution_logs(task_id, created_at DESC);
CREATE INDEX idx_execution_logs_agent ON execution_logs(agent_name, created_at DESC);
CREATE INDEX idx_execution_logs_status ON execution_logs(status);
CREATE INDEX idx_execution_logs_date ON execution_logs(created_at DESC);

-- ============================================================================
-- TABLE: strategy_milestones
-- Tracking implementačního plánu
-- ============================================================================

CREATE TABLE strategy_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Milestone metadata
  name TEXT NOT NULL,
  description TEXT,
  phase TEXT NOT NULL, -- 'Phase 1', 'Q1 2025', etc.

  -- Timeline
  target_date DATE,
  actual_completion_date DATE,

  -- Tasks
  task_ids UUID[], -- Array of strategy_tasks.id
  total_tasks INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,

  -- Progress
  progress_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN total_tasks > 0 THEN (completed_tasks::NUMERIC / total_tasks * 100) ELSE 0 END
  ) STORED,

  -- Status
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'delayed')),

  -- Notes
  blockers TEXT[],
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_strategy_milestones_phase ON strategy_milestones(phase);
CREATE INDEX idx_strategy_milestones_status ON strategy_milestones(status);
CREATE INDEX idx_strategy_milestones_date ON strategy_milestones(target_date);

-- ============================================================================
-- TABLE: strategy_agent_performance
-- Performance metrics za agenty (summary table)
-- ============================================================================

CREATE TABLE strategy_agent_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  agent_name TEXT NOT NULL,
  period_date DATE NOT NULL, -- Daily tracking

  -- Metrics
  tasks_executed INTEGER DEFAULT 0,
  tasks_approved INTEGER DEFAULT 0,
  tasks_rejected INTEGER DEFAULT 0,
  avg_quality_score NUMERIC(3,2),
  avg_execution_time NUMERIC(6,2), -- Minutes
  total_tokens_used INTEGER DEFAULT 0,
  total_cost NUMERIC(10,6),

  -- Status
  success_rate NUMERIC(5,2),
  error_rate NUMERIC(5,2),

  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_name, period_date)
);

CREATE INDEX idx_agent_performance_agent ON strategy_agent_performance(agent_name, period_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_agent_performance ENABLE ROW LEVEL SECURITY;

-- Policies - Allow authenticated users to view all data
CREATE POLICY "Allow authenticated to view strategy_tasks"
  ON strategy_tasks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to view task_approvals"
  ON task_approvals FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to view execution_logs"
  ON execution_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access"
  ON strategy_tasks FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to task_approvals"
  ON task_approvals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to execution_logs"
  ON execution_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate category breakdown
CREATE OR REPLACE FUNCTION get_category_breakdown()
RETURNS TABLE (
  category TEXT,
  total INTEGER,
  completed INTEGER,
  percentage NUMERIC
) AS $$
  SELECT
    category,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'done') as completed,
    (COUNT(*) FILTER (WHERE status = 'done')::NUMERIC / COUNT(*) * 100) as percentage
  FROM strategy_tasks
  GROUP BY category
  ORDER BY percentage DESC;
$$ LANGUAGE SQL;

-- Function to update task progress
CREATE OR REPLACE FUNCTION update_task_progress()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  -- Auto-calculate progress based on status
  IF NEW.status = 'done' THEN
    NEW.progress = 100;
  ELSIF NEW.status = 'in_progress' THEN
    NEW.progress = GREATEST(NEW.progress, 20);
  ELSIF NEW.status = 'review' THEN
    NEW.progress = GREATEST(NEW.progress, 80);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_progress
  BEFORE UPDATE ON strategy_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_progress();

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial agent definitions
INSERT INTO agent_skills (
  agent_name,
  agent_type,
  display_name,
  description,
  skills,
  supported_content_types,
  system_prompt,
  model,
  max_tokens,
  temperature,
  execution_config,
  active
) VALUES
-- Content Writer Agent
(
  'content_writer',
  'content',
  'Content Writer',
  'AI agent specialized in blog posts, articles, and case studies',
  ARRAY['blog_writing', 'article_creation', 'case_study_writing', 'storytelling', 'seo_content'],
  ARRAY['blog', 'article', 'case_study', 'landing_page'],
  'Jsi expert na psaní marketingového a odborného obsahu pro AC Heating...',
  'claude-sonnet-4-5-20250929',
  4096,
  1.0,
  '{"max_retries": 2, "timeout_seconds": 300}',
  true
),
-- SEO Specialist Agent
(
  'seo_specialist',
  'seo',
  'SEO Specialist',
  'AI agent for keyword research, meta optimization, and SEO audits',
  ARRAY['keyword_research', 'meta_optimization', 'internal_linking', 'seo_audit', 'competitor_analysis'],
  ARRAY['meta_tags', 'keyword_list', 'seo_audit'],
  'Jsi SEO expert pro český trh v oblasti tepelných čerpadel a fotovoltaiky...',
  'claude-sonnet-4-5-20250929',
  4096,
  1.0,
  '{"max_retries": 2, "timeout_seconds": 300}',
  true
),
-- Product Manager Agent
(
  'product_manager',
  'product',
  'Product Manager',
  'AI agent for product descriptions, features, and pricing strategies',
  ARRAY['product_description', 'feature_highlighting', 'pricing_strategy', 'value_proposition', 'competitive_positioning'],
  ARRAY['product_page', 'landing_page', 'pricing_table'],
  'Jsi produktový manažer pro AC Heating s focus na 8 produktových linií...',
  'claude-sonnet-4-5-20250929',
  4096,
  1.0,
  '{"max_retries": 2, "timeout_seconds": 300}',
  true
),
-- Marketing Copy Agent
(
  'marketing_copy',
  'marketing',
  'Marketing Copywriter',
  'AI agent for landing pages, CTAs, and value propositions',
  ARRAY['landing_page_copy', 'cta_optimization', 'value_proposition', 'social_proof', 'conversion_optimization'],
  ARRAY['landing_page', 'email', 'ad_copy'],
  'Jsi conversion copywriter pro AC Heating...',
  'claude-sonnet-4-5-20250929',
  4096,
  0.9,
  '{"max_retries": 3, "timeout_seconds": 300}',
  true
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE strategy_tasks IS 'Master table for strategy implementation tasks extracted from AC Heating strategic document';
COMMENT ON TABLE task_approvals IS 'Approval workflow with version control for AI-generated content';
COMMENT ON TABLE agent_skills IS 'Registry of specialized AI agents and their capabilities';
COMMENT ON TABLE execution_logs IS 'Detailed logs of agent executions for debugging and monitoring';
COMMENT ON TABLE strategy_milestones IS 'Tracking of implementation milestones and phases';
COMMENT ON TABLE strategy_agent_performance IS 'Daily performance metrics aggregation for agents';

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================

/*
Migration: 004_strategy_implementation.sql

This migration creates the core infrastructure for the AC Heating Strategy Implementation System.

Tables Created:
1. agent_skills - Registry of AI agents and their capabilities
2. strategy_tasks - Master task table from strategic document
3. task_approvals - Approval workflow with versioning
4. execution_logs - Execution tracking and debugging
5. strategy_milestones - Milestone tracking
6. strategy_agent_performance - Daily performance aggregation

Key Features:
- Full support for approval workflow with versioning
- Detailed execution logging for debugging
- Performance tracking per agent
- RLS enabled for security
- Helper functions for data analysis

Deploy:
1. Run this migration on remote Supabase instance (91.99.126.53:54321)
2. Initialize agent_skills (already included)
3. Import strategy document to strategy_tasks

Dependencies:
- PostgreSQL 12+
- uuid-ossp extension

Related Files:
- scripts/strategy/import_strategy.py - Imports strategic document
- scripts/strategy/generate_tasks.py - Generates tasks using Claude AI
- scripts/strategy/run_orchestrator.py - Executes orchestration
- src/app/admin/strategy/page.tsx - Admin dashboard
*/
