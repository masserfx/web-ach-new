-- AC Heating - Initial Database Schema
-- Migration: 001
-- Description: Complete schema for content, products, media

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'seo', 'viewer')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('blog', 'product')),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,

  -- Display
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,

  -- Stats
  post_count INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAGES
-- ============================================

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,

  -- Status
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS
-- ============================================

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content JSONB,

  -- Media
  featured_image TEXT,
  gallery JSONB,
  video_url TEXT,

  -- Categorization
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[],

  -- Author
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  keywords TEXT[],

  -- Stats
  views INTEGER DEFAULT 0,
  reading_time INTEGER,

  -- Related
  related_posts UUID[],
  related_products UUID[],

  -- Status
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  featured BOOLEAN DEFAULT false,

  -- Migration tracking
  original_url TEXT,
  migrated_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  model TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,

  -- Content
  description TEXT,
  features JSONB,
  specifications JSONB,

  -- Media
  images JSONB,
  videos JSONB,
  gallery_order INTEGER[],

  -- Documents
  downloads JSONB,

  -- Pricing
  price DECIMAL(10, 2),
  price_from DECIMAL(10, 2),
  currency TEXT DEFAULT 'CZK',

  -- Availability
  in_stock BOOLEAN DEFAULT true,
  available_from DATE,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,

  -- Related
  related_products UUID[],
  related_articles UUID[],

  -- Stats
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,

  -- Status
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,

  -- Migration
  original_url TEXT,
  migrated_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- MEDIA LIBRARY
-- ============================================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- Metadata
  alt_text TEXT,
  caption TEXT,
  description TEXT,

  -- File info
  mime_type TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,

  -- Optimization
  optimized BOOLEAN DEFAULT false,
  webp_url TEXT,
  avif_url TEXT,
  blurhash TEXT,

  -- Categorization
  type TEXT CHECK (type IN ('image', 'video', 'document')),
  usage TEXT[],
  tags TEXT[],

  -- Ownership
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Migration
  original_url TEXT,
  migrated_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- FAQ
-- ============================================

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,

  -- Display
  order_index INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,

  -- Stats
  views INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CASE STUDIES (renamed from references to avoid SQL keyword conflict)
-- ============================================

CREATE TABLE case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT,
  location TEXT,

  -- Content
  description TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,

  -- Media
  images JSONB,
  featured_image TEXT,
  video_url TEXT,

  -- Related
  product_ids UUID[],
  installation_date DATE,

  -- Testimonial
  testimonial TEXT,
  testimonial_author TEXT,
  testimonial_role TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),

  -- Status
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Pages
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(published, published_at DESC);

-- Blog Posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category, subcategory);
CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);

-- Media
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_tags ON media USING gin(tags);
CREATE INDEX idx_media_created ON media(created_at DESC);

-- ============================================
-- FULL-TEXT SEARCH
-- ============================================

-- Add search columns
ALTER TABLE pages ADD COLUMN search_text TEXT;
ALTER TABLE blog_posts ADD COLUMN search_text TEXT;
ALTER TABLE products ADD COLUMN search_text TEXT;

-- Create GIN indexes for full-text search
CREATE INDEX idx_pages_search ON pages USING gin(to_tsvector('simple', coalesce(search_text, '')));
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(to_tsvector('simple', coalesce(search_text, '')));
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('simple', coalesce(search_text, '')));

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update search text for pages
CREATE OR REPLACE FUNCTION update_pages_search_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := coalesce(NEW.title, '') || ' ' || coalesce(NEW.description, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pages_search_text_update
  BEFORE INSERT OR UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_pages_search_text();

-- Update search text for blog posts
CREATE OR REPLACE FUNCTION update_blog_posts_search_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := coalesce(NEW.title, '') || ' ' || coalesce(NEW.excerpt, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_search_text_update
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_search_text();

-- Update search text for products
CREATE OR REPLACE FUNCTION update_products_search_text()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := coalesce(NEW.name, '') || ' ' || coalesce(NEW.model, '') || ' ' || coalesce(NEW.description, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_text_update
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_search_text();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER case_studies_updated_at BEFORE UPDATE ON case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read published case studies"
  ON case_studies FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read FAQs"
  ON faqs FOR SELECT
  USING (true);

-- Service role can manage everything (for migration)
CREATE POLICY "Service role can manage all"
  ON blog_posts FOR ALL
  USING (true);

CREATE POLICY "Service role can manage products"
  ON products FOR ALL
  USING (true);

CREATE POLICY "Service role can manage media"
  ON media FOR ALL
  USING (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default admin user
INSERT INTO users (email, name, role) VALUES
  ('dev@ac-heating.cz', 'AC Heating Admin', 'admin');

-- Insert categories
INSERT INTO categories (slug, name, type, description) VALUES
  ('novinky', 'Novinky', 'blog', 'Aktuality a novinky z AC Heating'),
  ('technicke-clanky', 'Technické články', 'blog', 'Odborné technické informace'),
  ('dotace', 'Dotace', 'blog', 'Informace o kotlíkových dotacích a NZÚ'),
  ('reference', 'Reference', 'blog', 'Naše realizace a zákaznické příběhy'),
  ('tepelna-cerpadla', 'Tepelná čerpadla', 'product', 'Produkty - tepelná čerpadla'),
  ('fotovoltaika', 'Fotovoltaika', 'product', 'Produkty - fotovoltaické systémy');

-- Migration complete notification
DO $$
BEGIN
  RAISE NOTICE 'Schema migration 001 completed successfully';
END $$;
