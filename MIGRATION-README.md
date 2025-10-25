# 🔄 AC Heating - Content Migration Guide

## Přehled

Kompletní systém pro migraci 650+ stránek z původního PHP webu do moderního Next.js + Supabase stacku s AI vylepšením.

---

## 📊 Co jsme vytvořili

### 1. Database Schema ✅
```
📁 supabase/migrations/001_initial_schema.sql

Tabulky:
- blog_posts (články)
- products (produkty)
- categories (kategorie)
- media (fotografie, videa, PDF)
- faqs (otázky a odpovědi)
- references (reference, případové studie)
- pages (statické stránky)
- users (admin uživatelé)

Features:
✓ Full-text search (Czech language)
✓ Row Level Security (RLS)
✓ Optimized indexes
✓ Auto-updating timestamps
✓ SEO fields (meta_title, meta_description, og_image)
```

### 2. Migration Script ✅
```
📁 scripts/migrate-content.ts

Funkce:
✓ Scraping z původního webu (Cheerio)
✓ AI content enhancement (Claude Sonnet 4)
✓ Image download & optimization (Sharp)
✓ Automatic categorization
✓ Batch processing
✓ Error handling
✓ Migration reporting
```

### 3. SEO Components ✅
```
📁 src/components/content/

- BlogPostCard.tsx      (blog article cards)
- ProductCard.tsx       (product cards)
- ContentRenderer.tsx   (structured content display)

Features:
✓ Framer Motion animations
✓ Responsive design
✓ SEO-optimized HTML
✓ Image optimization (Next.js Image)
✓ Accessibility (ARIA labels)
```

---

## 🚀 Jak spustit migraci

### Krok 1: Příprava databáze

```bash
# Připojit se k Supabase
# http://localhost:54323

# Spustit SQL migraci
# V Supabase Studio → SQL Editor → New Query
# Zkopírovat obsah z: supabase/migrations/001_initial_schema.sql
# Spustit (Run)

# Alternativně přes Docker:
docker exec supabase_db_leos psql -U postgres -d postgres < supabase/migrations/001_initial_schema.sql
```

### Krok 2: Nastavit environment variables

```bash
# Editovat .env.local
nano .env.local

# Přidat:
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Optional - pro AI enhancement
OLD_SITE_URL=http://91.99.126.53:8080
```

### Krok 3: Spustit migraci

```bash
# Test run (prvních 20 článků)
npx tsx scripts/migrate-content.ts

# Production run (všechny články)
# Edituj scripts/migrate-content.ts
# Změň: .slice(0, 20) → celé pole
```

---

## 📋 Migration Workflow

### Fáze 1: Blog Articles (400+)

```typescript
Pro každý článek:
1. Scrape HTML z původního webu
2. Extract: title, description, content, images
3. AI Enhancement (Claude):
   - Vylepšený titulek (SEO)
   - Výstižný perex (160 znaků)
   - Strukturovaný obsah (JSON blocks)
   - Tagy (5 relevantních)
   - SEO keywords
4. Download & optimize featured image
5. Insert do Supabase (blog_posts table)
6. Log progress

Výstup:
✓ Článek v databázi
✓ Strukturovaný JSONB obsah
✓ Optimalizované SEO metadata
✓ Tags & keywords
```

### Fáze 2: Products (30+)

```typescript
Pro každý produkt:
1. Scrape product page
2. Extract: name, model, description, specs
3. Download product images
4. Extract technical specifications
5. Insert do Supabase (products table)

Výstup:
✓ Produkt v databázi
✓ Gallery obrázků
✓ Tech specs (JSONB)
✓ Related products links
```

### Fáze 3: Media Optimization

```typescript
Pro každý obrázek:
1. Download original
2. Resize (max 1200x800)
3. Convert to WebP (85% quality)
4. Generate thumbnail
5. Upload to Supabase Storage
6. Update database URLs

Výstup:
✓ Optimalizované obrázky
✓ WebP + AVIF verze
✓ Thumbnails
✓ Blurhash placeholders
```

---

## 🎯 AI Enhancement Details

### Claude Prompt Template:

```
Analyzuj tento článek z webu AC Heating (tepelná čerpadla):

Název: {title}
Popis: {description}
URL: {url}
Obsah: {content}

Úkol:
1. Vylepši název (max 60 znaků, SEO optimalizovaný)
2. Vytvoř výstižný perex (max 160 znaků)
3. Navrhni 5 relevantních tagů
4. Navrhni 5 SEO klíčových slov
5. Strukturuj obsah do JSON blocks

Odpověz ve formátu JSON
```

### Output:

```json
{
  "improvedTitle": "5 nejčastějších mýtů o tepelných čerpadlech – Pravda a fakta",
  "improvedExcerpt": "Vyvrátíme 5 nejčastějších mýtů o tepelných čerpadlech. Zjistěte pravdu o spotřebě, hlučnosti a provozu v zimě.",
  "suggestedTags": [
    "tepelná čerpadla",
    "mýty",
    "úspora energie",
    "ekologie",
    "vytápění"
  ],
  "seoKeywords": [
    "tepelné čerpadlo mýty",
    "tepelné čerpadlo pravda",
    "tepelná čerpadla zima",
    "hlučnost tepelného čerpadla",
    "spotřeba tepelného čerpadla"
  ],
  "structuredContent": {
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Mýtus 1: Tepelná čerpadla jsou hlučná"
      },
      {
        "type": "paragraph",
        "text": "Moderní tepelná čerpadla jsou tiché..."
      },
      ...
    ]
  }
}
```

---

## 📁 Content Structure v Supabase

### Blog Post Example:

```json
{
  "id": "uuid",
  "slug": "5-nejcastejsich-mytu-o-tepelnych-cerpadlech",
  "title": "5 nejčastějších mýtů o tepelných čerpadlech",
  "excerpt": "Vyvrátíme 5 nejčastějších mýtů...",
  "content": {
    "blocks": [
      { "type": "heading", "level": 2, "text": "Mýtus 1..." },
      { "type": "paragraph", "text": "..." },
      { "type": "image", "src": "/images/...", "alt": "..." },
      { "type": "list", "items": ["...", "..."] }
    ]
  },
  "featured_image": "/images/blog/featured-123.webp",
  "category_id": "uuid",
  "tags": ["tepelná čerpadla", "mýty", ...],
  "meta_title": "5 nejčastějších mýtů o tepelných čerpadlech – AC Heating",
  "meta_description": "Vyvrátíme 5 nejčastějších mýtů...",
  "og_image": "/images/blog/og-123.jpg",
  "published": true,
  "published_at": "2024-01-15T10:00:00Z",
  "views": 0,
  "reading_time": 5,
  "search_text": "5 nejčastějších mýtů...", // Auto-generated
  "original_url": "http://91.99.126.53:8080/5-nejcastejsich-mytu-o-tepelnych-cerpadlech/",
  "migrated_at": "2025-10-25T15:00:00Z"
}
```

---

## 🔍 Full-Text Search

### Použití:

```typescript
// Search blog posts
const { data } = await supabase
  .from('blog_posts')
  .select('*')
  .textSearch('search_text', 'tepelná čerpadla');

// Search products
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('search_text', 'fotovoltaika');

// Advanced search with ranking
const { data } = await supabase
  .rpc('search_content', {
    search_query: 'dotace kotlík',
    limit_results: 20
  });
```

---

## 📊 Migration Progress Tracking

### Dashboard Query:

```sql
-- Migration stats
SELECT
  COUNT(*) FILTER (WHERE migrated_at IS NOT NULL) as migrated_count,
  COUNT(*) as total_count,
  ROUND(COUNT(*) FILTER (WHERE migrated_at IS NOT NULL)::numeric / COUNT(*)::numeric * 100, 2) as progress_percent
FROM blog_posts;

-- Recently migrated
SELECT title, migrated_at, original_url
FROM blog_posts
WHERE migrated_at IS NOT NULL
ORDER BY migrated_at DESC
LIMIT 20;

-- Failed migrations (if original_url exists but no data)
SELECT original_url
FROM blog_posts
WHERE original_url IS NOT NULL
  AND (title IS NULL OR content IS NULL);
```

---

## 🎨 SEO Best Practices

### Implemented:

**1. Semantic HTML**
```tsx
✓ Proper heading hierarchy (h1 → h6)
✓ Article tags for blog posts
✓ Figure/figcaption for images
✓ Time tags for dates
✓ Schema.org structured data
```

**2. Meta Tags**
```tsx
✓ Unique meta_title per page
✓ Unique meta_description (150-160 chars)
✓ OpenGraph tags (og:title, og:description, og:image)
✓ Twitter Card tags
✓ Canonical URLs
```

**3. Performance**
```tsx
✓ Next.js Image optimization (WebP, AVIF)
✓ Lazy loading images
✓ Blurhash placeholders
✓ Responsive images (srcset)
✓ Font optimization (variable fonts)
```

**4. Accessibility**
```tsx
✓ Alt text pro všechny obrázky
✓ ARIA labels kde potřeba
✓ Keyboard navigation
✓ Screen reader friendly
✓ Color contrast WCAG AA
```

---

## 🚨 Troubleshooting

### Chyba: "Failed to insert blog post"

```bash
# Check Supabase connection
curl http://localhost:54321/rest/v1/

# Check RLS policies
# In Supabase Studio → Authentication → Policies
# Verify service_role can insert
```

### Chyba: "AI enhancement failed"

```bash
# Check API key
echo $ANTHROPIC_API_KEY

# Fallback je aktivní - migrace pokračuje bez AI
# Můžeš AI přidat později
```

### Chyba: "Image optimization failed"

```bash
# Install Sharp dependencies
npm install sharp

# Check temp directory
ls -la temp/migration/images/
```

---

## 📈 Next Steps

### Po dokončení migrace:

**1. Review obsahu**
```
→ Otevři Supabase Studio: http://localhost:54323
→ Zkontroluj blog_posts table
→ Ověř že content je správně strukturovaný
```

**2. Upload obrázků**
```bash
# Supabase Storage setup
# V Studio → Storage → Create bucket: "blog-images"
# Upload obrázky z temp/migration/images/
```

**3. Test zobrazení**
```bash
# Vytvoř test page
# src/app/blog/[slug]/page.tsx
# Načti článek z Supabase
# Použij ContentRenderer pro zobrazení
```

**4. SEO redirects**
```typescript
// next.config.ts
async redirects() {
  return [
    {
      source: '/old-url',
      destination: '/new-url',
      permanent: true, // 301
    },
  ];
}
```

**5. Sitemap generování**
```typescript
// src/app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllBlogPosts();
  const products = await getAllProducts();

  return [
    ...posts.map(post => ({
      url: `https://ac-heating.cz/blog/${post.slug}`,
      lastModified: post.updated_at,
    })),
    ...products.map(product => ({
      url: `https://ac-heating.cz/produkty/${product.category}/${product.slug}`,
      lastModified: product.updated_at,
    })),
  ];
}
```

---

## ✅ Checklist

```markdown
Migration Complete Checklist:

Database:
- [ ] Schema migrated to Supabase
- [ ] Tables created successfully
- [ ] Indexes optimized
- [ ] RLS policies configured
- [ ] Full-text search working

Content:
- [ ] Blog posts migrated (400+)
- [ ] Products migrated (30+)
- [ ] Categories created
- [ ] Media optimized
- [ ] Tags assigned

SEO:
- [ ] Meta tags complete
- [ ] Structured data added
- [ ] Redirects configured
- [ ] Sitemap generated
- [ ] Search Console verified

Testing:
- [ ] Content displays correctly
- [ ] Images load properly
- [ ] Search works
- [ ] Mobile responsive
- [ ] Performance optimized (Lighthouse 95+)

Deployment:
- [ ] Production build successful
- [ ] Database backed up
- [ ] Monitoring active
- [ ] Analytics configured
```

---

**Ready to migrate? 🚀**

```bash
npx tsx scripts/migrate-content.ts
```
