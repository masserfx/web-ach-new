#!/usr/bin/env tsx

/**
 * AC Heating - Content Migration Script
 *
 * Migrates content from PHP website to Next.js + Supabase
 * Features:
 * - Web scraping with Cheerio
 * - AI content enhancement with Claude
 * - Image optimization
 * - SEO generation
 * - Database import
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { Anthropic } from '@anthropic-ai/sdk';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  oldSiteUrl: process.env.OLD_SITE_URL || 'http://91.99.126.53:8080',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  anthropicKey: process.env.ANTHROPIC_API_KEY,

  // Migration settings
  batchSize: 10, // Process 10 pages at a time
  delayBetweenRequests: 1000, // 1 second delay
  enableAI: true, // Use AI for content enhancement
  optimizeImages: true,

  // Directories
  tempDir: './temp/migration',
  imagesDir: './temp/migration/images'
};

// Initialize clients
const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
const anthropic = CONFIG.anthropicKey ? new Anthropic({ apiKey: CONFIG.anthropicKey }) : null;

// ============================================
// TYPES
// ============================================

interface ScrapedPage {
  url: string;
  path: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  videos: string[];
  metaTags: Record<string, string>;
  publishedDate?: Date;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: any; // JSONB
  featured_image?: string;
  gallery?: any;
  category_id?: string;
  tags?: string[];
  meta_title: string;
  meta_description: string;
  og_image?: string;
  published: boolean;
  published_at?: Date;
  original_url: string;
}

interface Product {
  slug: string;
  name: string;
  model?: string;
  category: string;
  description: string;
  features?: any;
  specifications?: any;
  images?: any;
  meta_title: string;
  meta_description: string;
  published: boolean;
  original_url: string;
}

// ============================================
// MAIN MIGRATION FLOW
// ============================================

async function main() {
  console.log('🚀 Starting AC Heating content migration...\n');

  try {
    // Create temp directories
    await fs.mkdir(CONFIG.tempDir, { recursive: true });
    await fs.mkdir(CONFIG.imagesDir, { recursive: true });

    // Step 1: Get all URLs from sitemap
    console.log('📥 Step 1: Fetching sitemap...');
    const urls = await fetchSitemap();
    console.log(`✓ Found ${urls.length} URLs\n`);

    // Step 2: Categorize URLs
    console.log('📋 Step 2: Categorizing content...');
    const categorized = categorizeUrls(urls);
    console.log(`  Blog posts: ${categorized.blogPosts.length}`);
    console.log(`  Products: ${categorized.products.length}`);
    console.log(`  Static pages: ${categorized.staticPages.length}\n`);

    // Step 3: Migrate blog posts
    if (categorized.blogPosts.length > 0) {
      console.log('📝 Step 3: Migrating blog posts...');
      await migrateBlogPosts(categorized.blogPosts.slice(0, 20)); // Start with 20
      console.log('✓ Blog posts migrated\n');
    }

    // Step 4: Migrate products
    if (categorized.products.length > 0) {
      console.log('🏷️  Step 4: Migrating products...');
      await migrateProducts(categorized.products);
      console.log('✓ Products migrated\n');
    }

    // Step 5: Generate summary report
    console.log('📊 Step 5: Generating migration report...');
    await generateMigrationReport();

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// ============================================
// SITEMAP FETCHING
// ============================================

async function fetchSitemap(): Promise<string[]> {
  const { data } = await axios.get(`${CONFIG.oldSiteUrl}/sitemap.xml`);
  const $ = cheerio.load(data, { xmlMode: true });

  const urls: string[] = [];
  $('loc').each((_, el) => {
    const url = $(el).text();
    // Convert to relative paths
    const path = url
      .replace('https://www.ac-heating.cz', '')
      .replace(CONFIG.oldSiteUrl, '');
    urls.push(path);
  });

  return urls.filter(url => url && url !== '/');
}

// ============================================
// URL CATEGORIZATION
// ============================================

function categorizeUrls(urls: string[]) {
  const blogPosts: string[] = [];
  const products: string[] = [];
  const staticPages: string[] = [];

  for (const url of urls) {
    if (url.startsWith('/produkty/')) {
      products.push(url);
    } else if (
      url === '/blog/' ||
      url === '/o-nas/' ||
      url === '/kontakt/' ||
      url === '/faq/' ||
      url === '/bytove-domy/' ||
      url === '/pripravit-rozpocet/' ||
      url === '/regulace-xcc-new/'
    ) {
      staticPages.push(url);
    } else if (url.match(/^\/[a-z0-9-]+\/$/)) {
      // Blog posts are typically single-level slugs
      blogPosts.push(url);
    }
  }

  return { blogPosts, products, staticPages };
}

// ============================================
// PAGE SCRAPING
// ============================================

async function scrapePage(path: string): Promise<ScrapedPage> {
  const url = `${CONFIG.oldSiteUrl}${path}`;
  console.log(`  Scraping: ${path}`);

  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  // Extract metadata
  const title = $('h1').first().text().trim() || $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';

  // Extract images
  const images: string[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:')) {
      const fullUrl = src.startsWith('http') ? src : `${CONFIG.oldSiteUrl}${src}`;
      images.push(fullUrl);
    }
  });

  // Extract videos
  const videos: string[] = [];
  $('iframe[src*="youtube"], iframe[src*="vimeo"]').each((_, el) => {
    const src = $(el).attr('src');
    if (src) videos.push(src);
  });

  // Extract main content
  const contentElement = $('main, article, .content, .post-content').first();
  const content = contentElement.html() || $('body').html() || '';

  // Extract meta tags
  const metaTags: Record<string, string> = {};
  $('meta').each((_, el) => {
    const property = $(el).attr('property') || $(el).attr('name');
    const content = $(el).attr('content');
    if (property && content) {
      metaTags[property] = content;
    }
  });

  return {
    url,
    path,
    title,
    description,
    content,
    images,
    videos,
    metaTags
  };
}

// ============================================
// AI CONTENT ENHANCEMENT
// ============================================

async function enhanceContentWithAI(scraped: ScrapedPage): Promise<{
  improvedTitle: string;
  improvedExcerpt: string;
  structuredContent: any;
  suggestedTags: string[];
  seoKeywords: string[];
}> {
  if (!anthropic || !CONFIG.enableAI) {
    // Fallback without AI
    return {
      improvedTitle: scraped.title,
      improvedExcerpt: scraped.description,
      structuredContent: { blocks: [{ type: 'html', content: scraped.content }] },
      suggestedTags: [],
      seoKeywords: []
    };
  }

  const prompt = `Analyzuj tento článek z webu AC Heating (tepelná čerpadla) a vygeneruj:

Název: ${scraped.title}
Popis: ${scraped.description}
URL: ${scraped.path}

Obsah (HTML): ${scraped.content.slice(0, 5000)}

Úkol:
1. Vylepši název článku (max 60 znaků, SEO optimalizovaný)
2. Vytvoř výstižný perex (max 160 znaků)
3. Navrhni 5 relevantních tagů
4. Navrhni 5 SEO klíčových slov
5. Struktur ovaný obsah ve formátu JSON blocks (headings, paragraphs, lists)

Odpověz ve formátu JSON:
{
  "improvedTitle": "...",
  "improvedExcerpt": "...",
  "suggestedTags": ["tag1", "tag2", ...],
  "seoKeywords": ["keyword1", ...],
  "structuredContent": {
    "blocks": [
      { "type": "heading", "level": 2, "text": "..." },
      { "type": "paragraph", "text": "..." },
      ...
    ]
  }
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.warn('  ⚠ AI enhancement failed, using fallback');
  }

  // Fallback
  return {
    improvedTitle: scraped.title,
    improvedExcerpt: scraped.description,
    structuredContent: { blocks: [{ type: 'html', content: scraped.content }] },
    suggestedTags: [],
    seoKeywords: []
  };
}

// ============================================
// BLOG POST MIGRATION
// ============================================

async function migrateBlogPosts(paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    console.log(`\n[${i + 1}/${paths.length}] Processing: ${path}`);

    try {
      // Scrape page
      const scraped = await scrapePage(path);
      await delay(CONFIG.delayBetweenRequests);

      // Enhance with AI
      const enhanced = await enhanceContentWithAI(scraped);

      // Download featured image
      let featuredImage: string | undefined;
      if (scraped.images.length > 0 && CONFIG.optimizeImages) {
        featuredImage = await downloadAndOptimizeImage(scraped.images[0], path);
      }

      // Prepare blog post data
      const slug = path.replace(/^\//, '').replace(/\/$/, '');
      const blogPost: BlogPost = {
        slug,
        title: enhanced.improvedTitle,
        excerpt: enhanced.improvedExcerpt,
        content: enhanced.structuredContent,
        featured_image: featuredImage,
        tags: enhanced.suggestedTags,
        meta_title: enhanced.improvedTitle,
        meta_description: enhanced.improvedExcerpt,
        og_image: featuredImage,
        published: true,
        published_at: new Date(),
        original_url: scraped.url
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(blogPost)
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Failed to insert: ${error.message}`);
      } else {
        console.log(`  ✓ Migrated successfully (ID: ${data.id})`);
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error}`);
    }
  }
}

// ============================================
// PRODUCT MIGRATION
// ============================================

async function migrateProducts(paths: string[]) {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    console.log(`\n[${i + 1}/${paths.length}] Processing product: ${path}`);

    try {
      const scraped = await scrapePage(path);
      await delay(CONFIG.delayBetweenRequests);

      // Extract category from path
      const pathParts = path.split('/').filter(Boolean);
      const category = pathParts[1] || 'other'; // produkty/[category]/[product]
      const slug = pathParts[pathParts.length - 1];

      // Prepare product data
      const product: Product = {
        slug,
        name: scraped.title,
        category,
        description: scraped.description,
        meta_title: scraped.title,
        meta_description: scraped.description,
        published: true,
        original_url: scraped.url
      };

      // Insert
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) {
        console.error(`  ❌ Failed: ${error.message}`);
      } else {
        console.log(`  ✓ Migrated (ID: ${data.id})`);
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error}`);
    }
  }
}

// ============================================
// IMAGE OPTIMIZATION
// ============================================

async function downloadAndOptimizeImage(imageUrl: string, sourcePath: string): Promise<string> {
  try {
    // Download image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Generate filename
    const filename = `${Date.now()}-${path.basename(imageUrl).split('?')[0]}`;
    const localPath = path.join(CONFIG.imagesDir, filename);

    // Optimize with Sharp
    await sharp(buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(localPath);

    // TODO: Upload to Supabase Storage
    // For now, return local path
    return `/images/migrated/${filename}`;

  } catch (error) {
    console.warn(`  ⚠ Image optimization failed: ${imageUrl}`);
    return imageUrl;
  }
}

// ============================================
// MIGRATION REPORT
// ============================================

async function generateMigrationReport() {
  const { count: blogCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  const report = `
# Migration Report

## Summary
- Blog posts migrated: ${blogCount}
- Products migrated: ${productCount}
- Total: ${(blogCount || 0) + (productCount || 0)}

## Next Steps
1. Review migrated content in Supabase Studio
2. Upload images to Supabase Storage
3. Run SEO optimization
4. Test URLs for redirects
`;

  await fs.writeFile(path.join(CONFIG.tempDir, 'report.md'), report);
  console.log(report);
}

// ============================================
// UTILITIES
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// RUN
// ============================================

if (require.main === module) {
  main();
}

export { main, scrapePage, enhanceContentWithAI };
