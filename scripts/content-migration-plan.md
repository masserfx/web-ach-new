# 🔄 AC Heating - Content Migration Plan
## Migrace 650+ stránek z PHP do Next.js s AI Enhancement

---

## 📊 Content Audit - Co migrujeme

### Z analýzy sitemap.xml (650+ URLs):

```typescript
{
  "content_types": {
    "blog_articles": "~400 článků",
    "product_pages": "~30 produktových stránek",
    "static_pages": "~20 statických stránek",
    "categories": "~10 kategorií",
    "landing_pages": "~10 landing pages",
    "media": "Photos, videos, PDFs"
  },

  "url_patterns": {
    "blog": "/[slug]/",
    "products": "/produkty/[category]/[product]/",
    "categories": "/blog/", "/produkty/", etc.,
    "static": "/o-nas/", "/kontakt/", "/faq/"
  }
}
```

### Typy obsahu:

**1. Blog Články (400+)**
```
Example URLs:
- /ac-heating-ziskalo-prestizni-german-design-award-2025-/
- /5-nejcastejsich-mytu-o-tepelnych-cerpadlech/
- /aktuality-z-kotlikovych-dotaci/

Content:
- Title, description
- Featured image
- Body content (HTML)
- Publication date
- Category/tags
- Author
- Related articles
```

**2. Produktové stránky (30+)**
```
Example URLs:
- /produkty/tepelna-cerpadla/ac-hawk/
- /produkty/fotovoltaika/system-5kw/

Content:
- Product name, model
- Description
- Technical specifications
- Image gallery
- Price (optional)
- Downloads (PDF manuály)
- Related products
```

**3. Multimedia**
```
- Photos: JPG, PNG (produkty, reference, články)
- Videos: YouTube embeds, vlastní videa
- Documents: PDF (manuály, certifikáty)
- Infographics: SVG, PNG
```

---

## 🗄️ Database Schema (Supabase)

### Tables Structure:

```sql
-- ============================================
-- CONTENT TABLES
-- ============================================

-- Pages (statické stránky)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB, -- Structured content blocks

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
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Full-text search (Czech)
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('czech',
      coalesce(title, '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content JSONB, -- Structured blocks

  -- Media
  featured_image TEXT,
  gallery JSONB, -- Array of images
  video_url TEXT,

  -- Categorization
  category_id UUID REFERENCES categories(id),
  tags TEXT[],

  -- Author
  author_id UUID REFERENCES users(id),
  author_name TEXT,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  keywords TEXT[],

  -- Stats
  views INTEGER DEFAULT 0,
  reading_time INTEGER, -- minutes

  -- Related
  related_posts UUID[],
  related_products UUID[],

  -- Status
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  featured BOOLEAN DEFAULT false,

  -- Migration
  original_url TEXT,
  migrated_at TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('czech',
      coalesce(title, '') || ' ' ||
      coalesce(excerpt, '') || ' ' ||
      coalesce(content::text, '')
    )
  ) STORED
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  model TEXT,
  category TEXT NOT NULL, -- 'tepelna-cerpadla', 'fotovoltaika'
  subcategory TEXT,

  -- Content
  description TEXT,
  features JSONB, -- Array of features
  specifications JSONB, -- Tech specs

  -- Media
  images JSONB, -- Array of image objects with metadata
  videos JSONB, -- Array of video URLs
  gallery_order INTEGER[],

  -- Documents
  downloads JSONB, -- PDFs, manuals

  -- Pricing (optional)
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
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('czech',
      coalesce(name, '') || ' ' ||
      coalesce(model, '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'blog', 'product'
  parent_id UUID REFERENCES categories(id),

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

-- Media Library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  blurhash TEXT, -- For loading placeholders

  -- Categorization
  type TEXT, -- 'image', 'video', 'document'
  usage TEXT[], -- Where it's used
  tags TEXT[],

  -- Ownership
  uploaded_by UUID REFERENCES users(id),

  -- Migration
  original_url TEXT,
  migrated_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Q&A / FAQ
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- References / Case Studies
CREATE TABLE references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  rating INTEGER,

  -- Status
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (for admin, authors)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'editor', -- 'admin', 'editor', 'seo', 'viewer'

  -- Profile
  avatar_url TEXT,
  bio TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Pages
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(published, published_at DESC);
CREATE INDEX idx_pages_search ON pages USING gin(search_vector);

-- Blog Posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(search_vector);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category, subcategory);
CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_search ON products USING gin(search_vector);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Media
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_tags ON media USING gin(tags);
CREATE INDEX idx_media_created ON media(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (published = true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update search vector on change
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('czech',
    coalesce(NEW.title, '') || ' ' ||
    coalesce(NEW.description, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER blog_posts_search_vector_update
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 🤖 Migration Script (AI-Enhanced)

### Architecture:

```typescript
Content Scraping → AI Enhancement → Supabase Import → Media Optimization
```

### Script Components:

**1. Content Scraper**
**2. AI Content Enhancer (Claude)**
**3. Media Downloader & Optimizer**
**4. Database Importer**
**5. SEO Generator**

Připravím kompletní implementation v dalším souboru...
