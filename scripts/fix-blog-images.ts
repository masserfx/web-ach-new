#!/usr/bin/env node
/**
 * Fix blog post featured images by mapping MySQL picture_id to actual photo files
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabase = createClient(supabaseUrl, supabaseKey);

// MySQL article export path
const MYSQL_EXPORT = '/home/leos/ac-heating-dev/www/backend/phpmyadmin_exports/articles.sql';
const PHOTO_DIR = '/home/leos/ac-heating-web-new/public/images/photo';

interface ArticleMapping {
  articleId: number;
  slug: string;
  pictureId: number;
  pictureSource: string;
}

async function parseMySQLExport(): Promise<Map<number, ArticleMapping>> {
  const mappings = new Map<number, ArticleMapping>();

  console.log('📖 Reading MySQL export...');
  const content = fs.readFileSync(MYSQL_EXPORT, 'utf-8');

  // Split by lines and find VALUE rows
  const lines = content.split('\n');

  for (const line of lines) {
    // Match rows like: (35, 'cz', 'Title', 'slug', ..., 192, 'pg', ...)
    // Columns: id, lang, name, name_url, ..., picture_id(8), picture_source(9), ...
    const match = line.match(/^\((\d+),\s*'cz',\s*'([^']+)',\s*'([^']*)',.*?,\s*(\d+),\s*'([^']*)',/);

    if (!match) continue;

    const [_, idStr, title, nameUrl, pictureIdStr, pictureSource] = match;
    const articleId = parseInt(idStr);
    const pictureId = parseInt(pictureIdStr);

    if (pictureId > 0 && pictureSource === 'pg') {
      mappings.set(articleId, {
        articleId,
        slug: nameUrl || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        pictureId,
        pictureSource,
      });

      console.log(`  📎 Article ${articleId}: "${title}" → picture_id=${pictureId}`);
    }
  }

  console.log(`✅ Found ${mappings.size} articles with featured images`);
  return mappings;
}

async function findPhotoFile(pictureId: number): Promise<string | null> {
  const photoFolder = path.join(PHOTO_DIR, pictureId.toString());

  if (!fs.existsSync(photoFolder)) {
    return null;
  }

  const files = fs.readdirSync(photoFolder);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

  if (imageFiles.length === 0) {
    return null;
  }

  // Return first image file found
  return `/images/photo/${pictureId}/${imageFiles[0]}`;
}

async function updateBlogPosts(mappings: Map<number, ArticleMapping>) {
  console.log('🔄 Updating blog posts in Supabase...');

  let updated = 0;
  let notFound = 0;

  for (const [articleId, mapping] of mappings) {
    const photoPath = await findPhotoFile(mapping.pictureId);

    if (!photoPath) {
      notFound++;
      console.log(`⚠️  Photo not found for article ${articleId} (picture_id: ${mapping.pictureId})`);
      continue;
    }

    // Find blog post by exact slug match
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, slug, title')
      .eq('slug', mapping.slug)
      .limit(1);

    if (fetchError || !posts || posts.length === 0) {
      console.log(`⚠️  Blog post not found for slug: "${mapping.slug}" (article_id: ${articleId})`);
      continue;
    }

    const post = posts[0];

    // Update featured_image
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ featured_image: photoPath })
      .eq('id', post.id);

    if (updateError) {
      console.error(`❌ Failed to update post ${post.id}:`, updateError);
      continue;
    }

    updated++;
    console.log(`✅ Updated "${post.title}" → ${photoPath}`);
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Total processed: ${mappings.size}`);
}

async function main() {
  console.log('🚀 Starting blog image fix...\n');

  try {
    const mappings = await parseMySQLExport();
    await updateBlogPosts(mappings);

    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
