-- AC Heating - AI-powered CMS + Business Strategy Data
-- Migration: 003
-- Description: CMS content management, edit history, revenue projections, personnel planning

-- ============================================
-- CMS CONTENT
-- ============================================

CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('page', 'blog', 'case_study', 'product_detail', 'landing_page')),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,

  -- Structured content (JSON blocks)
  content JSONB,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],

  -- Segment targeting (RD, BD, Developery, Obce)
  segment_targeting TEXT[],

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),

  -- AI tracking
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_model TEXT, -- e.g., 'claude-sonnet-4.5'
  ai_prompt TEXT, -- Original user prompt

  -- Authorship
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Publishing
  published_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cms_content_slug ON cms_content(slug);
CREATE INDEX idx_cms_content_type ON cms_content(content_type);
CREATE INDEX idx_cms_content_status ON cms_content(status, published_at DESC);
CREATE INDEX idx_cms_content_segments ON cms_content USING gin(segment_targeting);
CREATE INDEX idx_cms_content_ai ON cms_content(ai_generated) WHERE ai_generated = true;

-- ============================================
-- CMS EDIT HISTORY
-- ============================================

CREATE TABLE cms_edit_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES cms_content(id) ON DELETE CASCADE,

  -- Edit type
  edit_type TEXT NOT NULL CHECK (edit_type IN ('ai_generated', 'human_edited', 'ai_suggested', 'approved', 'rejected')),

  -- Changes tracking (diff)
  changes JSONB,
  previous_version JSONB,

  -- AI details
  ai_model TEXT,
  prompt_used TEXT,

  -- Editor
  editor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  editor_name TEXT,

  -- Notes
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cms_edit_history_content ON cms_edit_history(content_id, created_at DESC);
CREATE INDEX idx_cms_edit_history_type ON cms_edit_history(edit_type);
CREATE INDEX idx_cms_edit_history_editor ON cms_edit_history(editor_id);

-- ============================================
-- REVENUE PROJECTIONS
-- ============================================

CREATE TABLE revenue_projections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  category TEXT NOT NULL, -- 'RD TČ', 'BD TČ', 'RD FVE', etc.
  amount DECIMAL(12, 2) NOT NULL, -- v Kč
  units INTEGER, -- Počet instalací/panelů

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_revenue_projections_year ON revenue_projections(year);
CREATE INDEX idx_revenue_projections_category ON revenue_projections(category);

-- ============================================
-- PERSONNEL PLANNING
-- ============================================

CREATE TABLE personnel_planning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  department TEXT NOT NULL, -- 'Obchod', 'Marketing', 'Projekce', 'Provoz', 'Výroba a realizace', 'Management/Rada'
  subdepartment TEXT, -- 'Interní obchod', 'Externí obchod', 'Tech. podpora', 'Asistentka'
  count INTEGER NOT NULL,

  -- Metrics
  fluktuace_percent DECIMAL(5, 2), -- Predicted fluktuace %
  nabor_count INTEGER, -- Požadovaný počet náborů
  pohovory_year INTEGER, -- Požadovaný počet pohovorů ročně

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_personnel_planning_year ON personnel_planning(year);
CREATE INDEX idx_personnel_planning_dept ON personnel_planning(department);

-- ============================================
-- SEED BUSINESS STRATEGY DATA
-- ============================================

-- Insert Vision
INSERT INTO business_strategy (category, title, description, priority) VALUES
('vision', 'Vize AC Heating', 'Značka AC Heating je leadrem v oblasti komplexních energetických služeb pro rodinné domy, bytové domy a firemní objekty v ČR', 1);

-- Insert Mission
INSERT INTO business_strategy (category, title, description, priority) VALUES
('mission', 'Mise AC Heating', 'Pomáháme lidem a firmám snižovat energetickou náročnost a zvyšovat komfort prostřednictvím inteligentních, udržitelných a kompletních řešení na míru', 1);

-- Insert SWOT - Strengths
INSERT INTO business_strategy (category, title, description, priority) VALUES
('strengths', 'Vlastní vývoj a výroba', 'Vlastní vývoj a výroba tepelného čerpadla Convert NG ONE', 1),
('strengths', 'Dlouholetá zkušenost', 'Dlouholetá zkušenost s instalacemi a servisem', 2),
('strengths', 'Silná reference', 'Silná reference v segmentu rodinných a bytových domů', 3),
('strengths', 'Vysoká odbornost', 'Vysoká technická odbornost a flexibilita při řešení projektů', 4);

-- Insert SWOT - Weaknesses
INSERT INTO business_strategy (category, title, description, priority) VALUES
('weaknesses', 'Nižší rozpoznatelnost', 'Nižší rozpoznatelnost značky mimo regionální trhy', 1),
('weaknesses', 'Závislost na sezónnosti', 'Závislost na sezónnosti poptávky', 2),
('weaknesses', 'Nedostatečný digital marketing', 'Nedostatečné využití digitálního marketingu a B2B kanálů', 3);

-- Insert SWOT - Opportunities
INSERT INTO business_strategy (category, title, description, priority) VALUES
('opportunities', 'Státní a EU dotace', 'Státní a evropské dotace na obnovitelné zdroje energie', 1),
('opportunities', 'Poptávka po soběstačnosti', 'Rostoucí poptávka po energeticky soběstačných domech', 2),
('opportunities', 'ESG tlak', 'Vzrůstající tlak firem na ESG (udržitelný rozvoj)', 3),
('opportunities', 'Expanze', 'Možnost expanze do bytových domů a komerční sféry (např. administrativní budovy, hotely, školy)', 4);

-- Insert SWOT - Threats
INSERT INTO business_strategy (category, title, description, priority) VALUES
('threats', 'Zahraniční konkurence', 'Silná konkurence zahraničních značek v oblasti rodinných domů', 1),
('threats', 'Kolísání cen', 'Kolísání cen energií a legislativní změny', 2),
('threats', 'Nedostatek partnerů', 'Riziko nedostatku kvalifikovaných instalačních partnerů', 3),
('threats', 'Stabilita dodavatelů', 'Stabilita dodavatelů FVE', 4);

-- Insert Target Segments
INSERT INTO target_segments (name, slug, description, content_focus, pain_points, revenue_percentage) VALUES
('Rodinné domy', 'rodinne-domy', 'Majitelé rodinných domů hledající energetickou nezávislost a úspory',
ARRAY['Návratnost investice', 'Dotace', 'Energetická nezávislost', 'Komfort bydlení'],
ARRAY['Vysoké náklady na vytápění', 'Závislost na fosilních palivech', 'Komplexnost řešení'],
60),

('Bytové domy', 'bytove-domy', 'SVJ a bytová družstva modernizující vytápění a TUV',
ARRAY['Snížení nákladů SVJ', 'Legislativa', 'Komunitní energetika', 'Dlouhodobá úspora'],
ARRAY['Stará plynová kotelna', 'Vysoké náklady na teplo', 'Složité rozhodování SVJ'],
25),

('Developery/Firmy', 'developery-firmy', 'Developři a firmy s požadavkem na ESG a nízkou uhlíkovou stopu',
ARRAY['ESG reporting', 'Nízká uhlíková stopa', 'B2B partnerství', 'Hromadné projekty'],
ARRAY['ESG compliance', 'Certifikace budov', 'Energetické náklady'],
15);

-- Insert Revenue Projections (2023-2027)
INSERT INTO revenue_projections (year, category, amount, units) VALUES
-- 2023
(2023, 'RD TČ', 157106053, 614),
(2023, 'RD FVE', 60016969, 2251),
(2023, 'Klima', 2122387, NULL),
(2023, 'BD TČ', 111556463, 100),
(2023, 'BD FVE', 22349161, 914),

-- 2024
(2024, 'RD TČ', 161672574, 534),
(2024, 'RD FVE', 68738309, 2578),
(2024, 'Klima', 5948634, NULL),
(2024, 'BD TČ', 99385592, 90),
(2024, 'BD FVE', 29001881, 1186),

-- 2025
(2025, 'RD TČ', 150000000, 540),
(2025, 'RD FVE', 35000000, 1313),
(2025, 'Klima', 6000000, 30),
(2025, 'Retrofit RD', 2000000, 10),
(2025, 'BD TČ', 110000000, 110),
(2025, 'BD FVE', 24000000, 982),
(2025, 'Developer/Firma TČ', 25000000, 33),
(2025, 'Teplo TČ + FVE', 15000000, NULL),
(2025, 'Partner TČ', 20000000, 83),
(2025, 'Servisní smlouvy BD', 1200000, NULL),

-- 2026
(2026, 'RD TČ', 155000000, 585),
(2026, 'RD FVE', 25000000, 938),
(2026, 'Klima', 6000000, 30),
(2026, 'Retrofit RD', 10000000, 50),
(2026, 'BD TČ', 130000000, 125),
(2026, 'BD FVE', 25000000, 1023),
(2026, 'BD FVE Komunitní', 10000000, 300),
(2026, 'Developer/Firma TČ', 35000000, 47),
(2026, 'Teplo TČ + FVE', 20000000, NULL),
(2026, 'Partner TČ', 28000000, 117),
(2026, 'Servisní smlouvy BD', 8000000, NULL),

-- 2027
(2027, 'RD TČ', 170000000, 642),
(2027, 'RD FVE', 25000000, 938),
(2027, 'Klima', 6000000, 30),
(2027, 'Retrofit RD', 20000000, 100),
(2027, 'BD TČ', 156000000, 150),
(2027, 'BD FVE', 30000000, 1227),
(2027, 'BD FVE Komunitní', 20000000, 600),
(2027, 'Developer/Firma TČ', 45000000, 60),
(2027, 'Teplo TČ + FVE', 25000000, NULL),
(2027, 'Partner TČ', 40000000, 167),
(2027, 'Servisní smlouvy BD', 10000000, NULL);

-- Insert Personnel Planning (2025-2027)
INSERT INTO personnel_planning (year, department, subdepartment, count, fluktuace_percent, nabor_count, pohovory_year) VALUES
-- 2025
(2025, 'Obchod', NULL, 11, 15, NULL, NULL),
(2025, 'Obchod', 'Vedení/Podpora', 5, 15, NULL, NULL),
(2025, 'Obchod', 'Interní obchod', 5, 15, NULL, NULL),
(2025, 'Obchod', 'Externí obchod', 2, 15, NULL, NULL),
(2025, 'Obchod', 'Tech. podpora', NULL, 15, NULL, NULL),
(2025, 'Obchod', 'Asistentka', 1, 15, NULL, NULL),
(2025, 'Marketing', NULL, 2, 15, NULL, NULL),
(2025, 'Marketing', 'Interní obchod', 2, 15, NULL, NULL),
(2025, 'Marketing', 'Externí obchod', 4, 15, NULL, NULL),
(2025, 'Marketing', 'Tech. podpora', 1, 15, NULL, NULL),
(2025, 'Marketing', 'Asistentka', 1, 15, NULL, NULL),
(2025, 'Projekce', NULL, 6, 15, NULL, NULL),
(2025, 'Provoz', NULL, 5, 15, NULL, NULL),
(2025, 'Výroba a realizace', NULL, 23, 15, NULL, NULL),
(2025, 'Management/Rada', NULL, 45, 15, NULL, NULL),

-- 2026
(2026, 'Obchod', NULL, 13, 10, NULL, NULL),
(2026, 'Obchod', 'Vedení/Podpora', 5, 10, NULL, NULL),
(2026, 'Obchod', 'Interní obchod', 7, 10, NULL, NULL),
(2026, 'Obchod', 'Externí obchod', 2, 10, NULL, NULL),
(2026, 'Obchod', 'Tech. podpora', 2, 10, NULL, NULL),
(2026, 'Obchod', 'Asistentka', 1, 10, NULL, NULL),
(2026, 'Marketing', NULL, 2, 10, NULL, NULL),
(2026, 'Marketing', 'Interní obchod', 2, 10, NULL, NULL),
(2026, 'Marketing', 'Externí obchod', 4, 10, NULL, NULL),
(2026, 'Marketing', 'Tech. podpora', 1, 10, NULL, NULL),
(2026, 'Marketing', 'Asistentka', 1, 10, NULL, NULL),
(2026, 'Projekce', NULL, 6, 10, NULL, NULL),
(2026, 'Provoz', NULL, 7, 10, NULL, NULL),
(2026, 'Výroba a realizace', NULL, 23, 10, NULL, NULL),
(2026, 'Management/Rada', NULL, 45, 10, NULL, NULL),

-- 2027
(2027, 'Obchod', NULL, 15, 7, NULL, NULL),
(2027, 'Obchod', 'Vedení/Podpora', 5, 7, NULL, NULL),
(2027, 'Obchod', 'Interní obchod', 12, 7, NULL, NULL),
(2027, 'Obchod', 'Externí obchod', 2, 7, NULL, NULL),
(2027, 'Obchod', 'Tech. podpora', 4, 7, NULL, NULL),
(2027, 'Obchod', 'Asistentka', 1, 7, NULL, NULL),
(2027, 'Marketing', NULL, 4, 7, NULL, NULL),
(2027, 'Marketing', 'Interní obchod', 3, 7, NULL, NULL),
(2027, 'Marketing', 'Externí obchod', 4, 7, NULL, NULL),
(2027, 'Marketing', 'Tech. podpora', 1, 7, NULL, NULL),
(2027, 'Marketing', 'Asistentka', 1, 7, NULL, NULL),
(2027, 'Projekce', NULL, 6, 7, NULL, NULL),
(2027, 'Provoz', NULL, 8, 7, NULL, NULL),
(2027, 'Výroba a realizace', NULL, 23, 7, NULL, NULL),
(2027, 'Management/Rada', NULL, 45, 7, NULL, NULL);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_edit_history ENABLE ROW LEVEL SECURITY;

-- Public can read published CMS content
CREATE POLICY "Public can read published CMS content"
  ON cms_content FOR SELECT
  USING (status = 'published');

-- Service role can manage everything
CREATE POLICY "Service role can manage CMS content"
  ON cms_content FOR ALL
  USING (true);

CREATE POLICY "Service role can manage edit history"
  ON cms_edit_history FOR ALL
  USING (true);

-- Revenue and personnel data is public for dashboards
CREATE POLICY "Public can read revenue projections"
  ON revenue_projections FOR SELECT
  USING (true);

CREATE POLICY "Public can read personnel planning"
  ON personnel_planning FOR SELECT
  USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update updated_at on cms_content
CREATE TRIGGER cms_content_updated_at
  BEFORE UPDATE ON cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Migration complete
DO $$
BEGIN
  RAISE NOTICE 'Schema migration 003 (AI-powered CMS) completed successfully';
END $$;
