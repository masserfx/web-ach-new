#!/usr/bin/env tsx

/**
 * Database Image URL Cleanup Script
 *
 * This script removes #icon fragments from image URLs in the database.
 * Safe to run multiple times (idempotent).
 *
 * Usage:
 *   npx tsx scripts/db-cleanup/fix-image-urls.ts
 *
 * Or with dry-run to preview changes:
 *   npx tsx scripts/db-cleanup/fix-image-urls.ts --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const isDryRun = process.argv.includes('--dry-run');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ImageRecord {
  id: string;
  featured_image: string | null;
  thumbnail?: string | null;
}

async function cleanImageUrls(
  tableName: string,
  imageColumns: string[]
): Promise<{ updated: number; errors: number }> {
  console.log(`\n📋 Processing table: ${tableName}`);
  console.log(`   Columns: ${imageColumns.join(', ')}`);

  let updated = 0;
  let errors = 0;

  try {
    // Fetch all records (select all columns to auto-discover schema)
    const { data: records, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1000);

    if (fetchError) {
      console.error(`❌ Error fetching from ${tableName}:`, fetchError);
      return { updated: 0, errors: 1 };
    }

    if (!records || records.length === 0) {
      console.log(`   ℹ️  No records found`);
      return { updated: 0, errors: 0 };
    }

    console.log(`   Found ${records.length} records`);

    // Auto-discover columns with #icon URLs
    const firstRecord = records[0] as any;
    const availableColumns = Object.keys(firstRecord);
    const relevantColumns = availableColumns.filter(col =>
      imageColumns.includes(col) || col.includes('image') || col.includes('Image')
    );

    if (relevantColumns.length === 0) {
      console.log(`   ⚠️  No image columns found. Available: ${availableColumns.join(', ')}`);
    } else {
      console.log(`   Found image columns: ${relevantColumns.join(', ')}`);
    }

    // Process each record
    for (const record of records as any[]) {
      let hasChanges = false;
      const updates: any = {};

      // Check each image column
      for (const column of relevantColumns) {
        const value = record[column];

        if (value && typeof value === 'string' && value.includes('#icon')) {
          const cleaned = value.replace(/#icon$/g, '');
          updates[column] = cleaned;
          hasChanges = true;

          console.log(`   🔧 ${record.id}:`);
          console.log(`      ${column}: ${value} → ${cleaned}`);
        }
      }

      // Update if there are changes
      if (hasChanges) {
        if (isDryRun) {
          console.log(`   [DRY RUN] Would update record ${record.id}`);
          updated++;
        } else {
          const { error: updateError } = await supabase
            .from(tableName)
            .update(updates)
            .eq('id', record.id);

          if (updateError) {
            console.error(`   ❌ Error updating ${record.id}:`, updateError);
            errors++;
          } else {
            console.log(`   ✅ Updated record ${record.id}`);
            updated++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Unexpected error processing ${tableName}:`, error);
    errors++;
  }

  return { updated, errors };
}

async function main() {
  console.log('🚀 Starting image URL cleanup...');

  if (isDryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  const tables = [
    { name: 'blog_posts', columns: ['featured_image', 'thumbnail'] },
    { name: 'products', columns: ['featured_image'] },
  ];

  let totalUpdated = 0;
  let totalErrors = 0;

  for (const table of tables) {
    const { updated, errors } = await cleanImageUrls(table.name, table.columns);
    totalUpdated += updated;
    totalErrors += errors;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  console.log(`   Records updated: ${totalUpdated}`);
  console.log(`   Errors: ${totalErrors}`);

  if (isDryRun) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to apply changes.');
  } else if (totalErrors === 0) {
    console.log('\n✅ All image URLs cleaned successfully!');
  } else {
    console.log('\n⚠️  Some errors occurred. Please review the output above.');
  }

  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
