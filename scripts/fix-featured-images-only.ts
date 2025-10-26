#!/usr/bin/env tsx
/**
 * Fix featured images for blog posts
 * Simple script - just assigns best available image to each post
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'http://localhost:54321';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const IMAGES_DIR = '/home/leos/ac-heating-web-new/public/images';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Get all available images
const availableImages = fs.readdirSync(IMAGES_DIR)
  .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
  .map(f => `/images/${f}`);

console.log(`📷 Found ${availableImages.length} available images`);

// Category-specific image mapping
const categoryImages: Record<string, string> = {
  'tepelné čerpadlo': '/images/ac-image.jpg',
  'tepelná čerpadla': '/images/ac-image.jpg',
  'fotovoltaika': '/images/banner.jpg',
  'klimatizace': '/images/ac-man.jpg',
  'dotace': '/images/ac-tablet.jpg',
  'kotlík': '/images/ac-man.jpg',
  'instalace': '/images/ac-tablet.jpg',
  'úspora': '/images/banner.jpg',
};

function findBestImage(post: any): string {
  // Keep existing photo images
  if (post.featured_image?.includes('/photo/')) {
    return post.featured_image;
  }

  const title = (post.title || '').toLowerCase();
  const excerpt = (post.excerpt || '').toLowerCase();
  const combined = title + ' ' + excerpt;

  // Try category matching
  for (const [keyword, image] of Object.entries(categoryImages)) {
    if (combined.includes(keyword)) {
      return image;
    }
  }

  // Fallback to first available image
  return availableImages[0] || '/images/logo-v2.svg';
}

async function main() {
  console.log('🚀 Fixing featured images...\n');

  // Get all posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, featured_image')
    .order('created_at', { ascending: false });

  if (error || !posts) {
    console.error('❌ Failed to fetch posts:', error);
    return;
  }

  console.log(`📊 Processing ${posts.length} posts\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    // Skip if already has good image (not placeholder)
    if (post.featured_image &&
        !post.featured_image.includes('logo-v2.svg') &&
        post.featured_image !== '/images/logo-v2.svg') {
      console.log(`⏭️  Skip: "${post.title}" - already has image`);
      skipped++;
      continue;
    }

    const bestImage = findBestImage(post);

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ featured_image: bestImage })
      .eq('id', post.id);

    if (updateError) {
      console.error(`❌ Failed: "${post.title}"`);
      failed++;
      continue;
    }

    console.log(`✅ Updated: "${post.title}" → ${bestImage}`);
    updated++;

    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n📊 Summary:');
  console.log(`   Total: ${posts.length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log('\n✨ Done!');
}

main();
