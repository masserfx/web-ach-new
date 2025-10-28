-- AC Heating - Business Strategy Tables
-- Migration: 002
-- Description: Implementace business strategie (Vize, Mise, SWOT, Target Segments, KPIs, Competitors)
-- Source: BUSINESS_STRATEGY.md

-- ============================================
-- BUSINESS STRATEGY TABLE
-- ============================================
-- Stores: Vision, Mission, Values, SWOT

CREATE TABLE business_strategy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('vision', 'mission', 'values', 'swot')),
  subcategory TEXT, -- For SWOT: 'strengths', 'weaknesses', 'opportunities', 'threats'
  title TEXT NOT NULL,
  description TEXT,
  details JSONB, -- For structured data (e.g., SWOT mitigation, metrics)
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TARGET SEGMENTS & PERSONAS
-- ============================================
-- Stores: Customer segments with detailed personas

CREATE TABLE target_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Rodinné domy', 'Bytové domy', 'Firemní objekty'
  persona_name TEXT NOT NULL, -- 'Ekologický optimizátor', 'Správce objektu', 'ESG Manager'

  -- Demographics
  demographics JSONB NOT NULL, -- {age_range: '35-50', income: '80,000+', education: 'VŠ', personality: 'ISTJ'}

  -- Motivations & Pain Points
  motivations JSONB NOT NULL, -- [{icon: '💰', text: 'Úspora nákladů', value: '50-60%'}]

  -- Entry Channels
  entry_channels JSONB NOT NULL, -- {organic: 40, ads: 30, social: 20, direct: 10}

  -- Buying Cycle
  buying_cycle TEXT NOT NULL, -- '3-6 měsíců'
  buying_stage_notes TEXT, -- Additional context

  -- Messaging
  messaging JSONB NOT NULL, -- {hero: '...', cta: '...', value_prop: '...'}

  -- Business Metrics
  revenue_share NUMERIC(5,2), -- Percentage (e.g., 60.00 for 60%)
  avg_order_value NUMERIC(10,2), -- Average zakázka in Kč

  -- Status
  active BOOLEAN DEFAULT true,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE ENHANCEMENT
-- ============================================
-- Add business strategy columns to existing products table

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS pricing JSONB, -- {base_price: 189000, with_installation: 320000, financing_options: [...]}
  ADD COLUMN IF NOT EXISTS technical_specs JSONB, -- {cop: 4.5, output_kw: '6-16', rating: 'A+++', regulation: 'xCC2'}
  ADD COLUMN IF NOT EXISTS target_segment_ids UUID[], -- References target_segments (array of UUIDs)
  ADD COLUMN IF NOT EXISTS usp TEXT, -- Unique Selling Proposition
  ADD COLUMN IF NOT EXISTS roi_months INTEGER, -- Payback period in months
  ADD COLUMN IF NOT EXISTS bundle_options JSONB, -- [{name: 'TČ + FVE', discount: 8}, ...]
  ADD COLUMN IF NOT EXISTS warranty_years INTEGER DEFAULT 7; -- Garance

-- ============================================
-- KPIs TRACKING
-- ============================================
-- Stores: Business metrics with quarterly targets

CREATE TABLE kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('revenue', 'marketing', 'operational', 'installation')),

  -- Baseline & Targets
  baseline_value NUMERIC(12,2),
  baseline_period DATE,

  target_q1 NUMERIC(12,2),
  target_q2 NUMERIC(12,2),
  target_q3 NUMERIC(12,2),
  target_q4 NUMERIC(12,2),

  -- Actual Values (to be updated over time)
  actual_value NUMERIC(12,2),
  actual_period DATE,

  -- Metadata
  unit TEXT NOT NULL, -- '%', 'Kč', 'count', '/100', 'days', 'hours', '/měsíc'
  description TEXT,

  -- Tracking
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  is_primary BOOLEAN DEFAULT false, -- Mark key metrics

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMPETITORS TRACKING
-- ============================================
-- Stores: Competitive analysis

CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'mid-range', 'low-cost')),

  -- Analysis
  strengths JSONB NOT NULL, -- [{title: 'Brand awareness', detail: 'silná dealerská síť'}]
  weaknesses JSONB NOT NULL, -- [{title: 'Vysoké ceny', detail: '20-30% dražší'}]

  -- Pricing
  pricing_vs_us NUMERIC(5,2), -- Percentage difference (e.g., 25.00 for +25%)
  avg_product_price NUMERIC(10,2), -- Average cena in Kč

  -- Market Share
  market_share NUMERIC(5,2), -- Percentage

  -- Our Advantages
  ac_heating_advantages JSONB, -- [{title: 'Vlastní výroba', detail: 'nižší cena'}]

  -- Additional Data
  website TEXT,
  notes TEXT,

  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Business Strategy
CREATE INDEX idx_business_strategy_category ON business_strategy(category);
CREATE INDEX idx_business_strategy_subcategory ON business_strategy(category, subcategory);
CREATE INDEX idx_business_strategy_status ON business_strategy(status);

-- Target Segments
CREATE INDEX idx_target_segments_active ON target_segments(active);
CREATE INDEX idx_target_segments_revenue ON target_segments(revenue_share DESC);

-- KPIs
CREATE INDEX idx_kpis_category ON kpis(category);
CREATE INDEX idx_kpis_year ON kpis(year DESC);
CREATE INDEX idx_kpis_primary ON kpis(is_primary) WHERE is_primary = true;
CREATE INDEX idx_kpis_metric_year ON kpis(metric_name, year);

-- Competitors
CREATE INDEX idx_competitors_tier ON competitors(tier);
CREATE INDEX idx_competitors_market_share ON competitors(market_share DESC);

-- Products (new columns)
CREATE INDEX idx_products_target_segments ON products USING gin(target_segment_ids);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE TRIGGER business_strategy_updated_at
  BEFORE UPDATE ON business_strategy
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER target_segments_updated_at
  BEFORE UPDATE ON target_segments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER kpis_updated_at
  BEFORE UPDATE ON kpis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE business_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

-- Public can read active business strategy
CREATE POLICY "Public can read active business strategy"
  ON business_strategy FOR SELECT
  USING (status = 'active');

CREATE POLICY "Public can read active target segments"
  ON target_segments FOR SELECT
  USING (active = true);

CREATE POLICY "Public can read KPIs"
  ON kpis FOR SELECT
  USING (true);

CREATE POLICY "Public can read competitors"
  ON competitors FOR SELECT
  USING (true);

-- Service role can manage everything
CREATE POLICY "Service role can manage business strategy"
  ON business_strategy FOR ALL
  USING (true);

CREATE POLICY "Service role can manage target segments"
  ON target_segments FOR ALL
  USING (true);

CREATE POLICY "Service role can manage KPIs"
  ON kpis FOR ALL
  USING (true);

CREATE POLICY "Service role can manage competitors"
  ON competitors FOR ALL
  USING (true);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 002 - Business Strategy schema created successfully';
  RAISE NOTICE 'Tables created: business_strategy, target_segments, kpis, competitors';
  RAISE NOTICE 'Products table enhanced with: pricing, technical_specs, target_segment_ids, usp, roi_months, bundle_options, warranty_years';
END $$;
