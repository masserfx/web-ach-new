-- AC Heating - Enhanced Products & Leads Schema
-- Migration: 005
-- Description: Enhanced product schema with 8 variants + lead tracking system

-- ============================================
-- ENHANCED PRODUCTS TABLE
-- ============================================

-- Add new columns to existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT CHECK (product_type IN ('rd_tc', 'rd_fve', 'klima', 'retrofit', 'bd_tc', 'bd_fve', 'bd_fve_komunita', 'developer', 'teplo', 'partner', 'servis'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS target_market TEXT CHECK (target_market IN ('residential', 'commercial', 'developer', 'partner'));
ALTER TABLE products ADD COLUMN IF NOT EXISTS average_price DECIMAL(12, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_min DECIMAL(12, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_max DECIMAL(12, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS typical_orders_per_project INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS installation_time_days INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warranty_years INTEGER DEFAULT 7;
ALTER TABLE products ADD COLUMN IF NOT EXISTS savings_percentage INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS pros TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS cons TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS technical_specs JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS financing_options JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subsidies JSONB;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_market ON products(target_market);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(average_price);

-- ============================================
-- LEADS TABLE (Enhanced)
-- ============================================

DROP TABLE IF EXISTS leads CASCADE;

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Contact Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  company_ico TEXT,
  
  -- Address
  street TEXT,
  city TEXT,
  postal_code TEXT,
  region TEXT,
  
  -- Lead Type & Source
  lead_type TEXT NOT NULL CHECK (lead_type IN ('product_inquiry', 'quote_request', 'consultation', 'callback', 'site_visit', 'download', 'chat', 'newsletter')),
  source TEXT CHECK (source IN ('website', 'facebook', 'google', 'email', 'referral', 'direct', 'partner')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Product Interest
  interested_products UUID[],
  product_category TEXT,
  budget_range TEXT,
  property_type TEXT CHECK (property_type IN ('rodinny_dum', 'bytovy_dum', 'firma', 'developer')),
  property_size_sqm INTEGER,
  
  -- Project Details
  project_description TEXT,
  preferred_contact_time TEXT,
  urgency TEXT CHECK (urgency IN ('immediate', 'this_month', 'this_quarter', 'planning')),
  
  -- Lead Status & Qualification
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost', 'archived')),
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 5),
  qualified_at TIMESTAMP,
  disqualified_reason TEXT,
  
  -- Assignment & Follow-up
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  last_contact_at TIMESTAMP,
  next_follow_up_at TIMESTAMP,
  
  -- Notes & Communication
  notes JSONB,
  communication_history JSONB,
  
  -- GDPR & Consent
  gdpr_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  consent_ip TEXT,
  consent_timestamp TIMESTAMP,
  
  -- Conversion Tracking
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMP,
  conversion_value DECIMAL(12, 2),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_type ON leads(lead_type);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);

-- ============================================
-- LEAD ACTIVITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'status_change', 'document_sent', 'proposal_sent')),
  subject TEXT,
  description TEXT,
  
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created ON lead_activities(created_at DESC);

-- ============================================
-- PRODUCT INQUIRIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS product_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  inquiry_type TEXT CHECK (inquiry_type IN ('price', 'availability', 'specifications', 'installation', 'warranty', 'financing')),
  message TEXT,
  
  response TEXT,
  responded_at TIMESTAMP,
  responded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_product_inquiries_product ON product_inquiries(product_id);
CREATE INDEX idx_product_inquiries_lead ON product_inquiries(lead_id);

-- ============================================
-- QUOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Quote Details
  title TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL, -- Array of {product_id, quantity, unit_price, discount, total}
  
  -- Pricing
  subtotal DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'CZK',
  
  -- Validity
  valid_until DATE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  responded_at TIMESTAMP,
  
  -- Terms
  payment_terms TEXT,
  delivery_terms TEXT,
  notes TEXT,
  
  -- Documents
  pdf_url TEXT,
  
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at DESC);

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

-- Lead conversion funnel
CREATE OR REPLACE VIEW lead_funnel AS
SELECT 
  status,
  COUNT(*) as count,
  ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400), 1) as avg_days_in_status
FROM leads
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'new' THEN 1
    WHEN 'contacted' THEN 2
    WHEN 'qualified' THEN 3
    WHEN 'proposal' THEN 4
    WHEN 'negotiation' THEN 5
    WHEN 'won' THEN 6
    WHEN 'lost' THEN 7
    ELSE 8
  END;

-- Monthly lead statistics
CREATE OR REPLACE VIEW monthly_lead_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'won') as won_leads,
  COUNT(*) FILTER (WHERE status = 'lost') as lost_leads,
  ROUND(AVG(quality_score), 2) as avg_quality,
  SUM(conversion_value) FILTER (WHERE converted = true) as total_revenue
FROM leads
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Product inquiry analytics
CREATE OR REPLACE VIEW product_inquiry_stats AS
SELECT 
  p.name,
  p.product_type,
  COUNT(pi.id) as inquiry_count,
  COUNT(DISTINCT pi.lead_id) as unique_leads,
  COUNT(*) FILTER (WHERE pi.responded_at IS NOT NULL) as responded_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (pi.responded_at - pi.created_at))/3600), 1) as avg_response_hours
FROM products p
LEFT JOIN product_inquiries pi ON p.id = pi.product_id
WHERE pi.created_at >= NOW() - INTERVAL '90 days'
GROUP BY p.id, p.name, p.product_type
ORDER BY inquiry_count DESC;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log lead status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_activities (lead_id, activity_type, subject, description, metadata)
    VALUES (
      NEW.id,
      'status_change',
      'Status changed',
      'Status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_lead_status_changes AFTER UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_status_change();

