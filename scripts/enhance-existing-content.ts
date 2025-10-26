#!/usr/bin/env tsx
/**
 * Enhance existing blog posts with AI and proper images
 *
 * This script:
 * 1. Fetches existing posts from Supabase
 * 2. Uses AI to generate proper structured content
 * 3. Finds or generates appropriate featured images
 * 4. Updates posts with enhanced data
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

// Config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const PHOTO_DIR = '/home/leos/ac-heating-web-new/public/images/photo';
const LEGACY_IMAGES_DIR = '/home/leos/ac-heating-web-new/public/images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const anthropic = ANTHROPIC_KEY ? new Anthropic({ apiKey: ANTHROPIC_KEY }) : null;

interface EnhancedContent {
  structuredContent: {
    blocks: Array<{
      type: string;
      level?: number;
      text?: string;
      items?: string[];
      src?: string;
      alt?: string;
    }>;
  };
  suggestedTags: string[];
  seoKeywords: string[];
  improvedExcerpt: string;
  readingTime: number;
}

async function enhancePostContent(post: any): Promise<EnhancedContent | null> {
  if (!anthropic) {
    console.log('⚠️  No AI key - skipping AI enhancement');
    return null;
  }

  try {
    const prompt = `Analyzuj tento článek o tepelných čerpadlech:

Název: ${post.title}
Obsah: ${post.content}

Úkol:
1. Vytvoř strukturovaný obsah (JSON blocks) - rozdělený na nadpisy, odstavce, seznamy
2. Navrhni 5 relevantních tagů
3. Navrhni 5 SEO klíčových slov
4. Vytvoř výstižný perex (max 160 znaků)
5. Odhadni čas čtení v minutách

Odpověz POUZE validní JSON ve formátu:
{
  "structuredContent": {
    "blocks": [
      {"type": "heading", "level": 2, "text": "..."},
      {"type": "paragraph", "text": "..."},
      {"type": "list", "items": ["...", "..."]},
      {"type": "image", "src": "placeholder.jpg", "alt": "..."}
    ]
  },
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "improvedExcerpt": "...",
  "readingTime": 5
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log('⚠️  No JSON found in AI response');
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ AI enhancement failed:', error);
    return null;
  }
}

async function findBestFeaturedImage(post: any): Promise<string> {
  // Strategy 1: Check if post already has a photo
  if (post.featured_image && post.featured_image.includes('/photo/')) {
    return post.featured_image;
  }

  // Strategy 2: Look for relevant images in legacy directory
  const relevantKeywords = ['tepelne-cerpadlo', 'fotovoltaika', 'klimatizace', 'dum', 'instalace'];

  try {
    const legacyFiles = fs.readdirSync(LEGACY_IMAGES_DIR);
    const slug = post.slug || '';

    // Try to find image matching slug or keywords
    for (const file of legacyFiles) {
      if (file.includes(slug.substring(0, 20)) ||
          relevantKeywords.some(kw => file.includes(kw))) {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          return `/images/${file}`;
        }
      }
    }
  } catch (error) {
    // Fallback continues
  }

  // Strategy 3: Use category-specific placeholder
  const categoryImages: Record<string, string> = {
    'tepelná čerpadla': '/images/ac-image.jpg',
    'fotovoltaika': '/images/banner.jpg',
    'klimatizace': '/images/ac-man.jpg',
    'dotace': '/images/ac-tablet.jpg',
  };

  for (const [category, image] of Object.entries(categoryImages)) {
    if (post.title?.toLowerCase().includes(category) ||
        post.excerpt?.toLowerCase().includes(category)) {
      return image;
    }
  }

  // Strategy 4: Generic AC Heating image
  return '/images/logo-v2.svg';
}

async function enhancePost(post: any) {
  console.log(`\n🔧 Enhancing: "${post.title}"`);

  // 1. AI Enhancement
  const enhanced = await enhancePostContent(post);

  // 2. Find best featured image
  const featuredImage = await findBestFeaturedImage(post);

  // 3. Prepare update data
  const updates: any = {
    featured_image: featuredImage,
  };

  if (enhanced) {
    updates.content = enhanced.structuredContent;
    updates.tags = enhanced.suggestedTags;
    updates.excerpt = enhanced.improvedExcerpt || post.excerpt;
    updates.reading_time = enhanced.readingTime;
    updates.meta_description = enhanced.improvedExcerpt || post.meta_description;
  }

  // 4. Update in database
  const { error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', post.id);

  if (error) {
    console.error(`❌ Failed to update ${post.id}:`, error);
    return false;
  }

  console.log(`✅ Enhanced: ${post.title}`);
  console.log(`   Image: ${featuredImage}`);
  if (enhanced) {
    console.log(`   Tags: ${enhanced.suggestedTags.join(', ')}`);
    console.log(`   Blocks: ${enhanced.structuredContent.blocks.length}`);
  }

  return true;
}

async function main() {
  console.log('🚀 Starting content enhancement...\n');

  // Fetch posts that need enhancement
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Failed to fetch posts:', error);
    return;
  }

  console.log(`📊 Found ${posts.length} posts to enhance\n`);

  let enhanced = 0;
  let failed = 0;

  for (const post of posts) {
    // Skip if already enhanced (has structured content)
    if (post.content && typeof post.content === 'object' && post.content.blocks) {
      console.log(`⏭️  Skipping "${post.title}" - already enhanced`);
      continue;
    }

    // Skip if no title or content
    if (!post.title || !post.content) {
      console.log(`⏭️  Skipping "${post.id}" - missing title/content`);
      continue;
    }

    const success = await enhancePost(post);

    if (success) {
      enhanced++;
    } else {
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n📊 Summary:');
  console.log(`   Total posts: ${posts.length}`);
  console.log(`   Enhanced: ${enhanced}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Skipped: ${posts.length - enhanced - failed}`);
  console.log('\n✨ Done!');
}

main();
