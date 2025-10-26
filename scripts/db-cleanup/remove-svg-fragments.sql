-- ============================================================================
-- SQL Script: Remove #icon fragments from image URLs
-- ============================================================================
-- Description: Removes #icon fragments from featured_image URLs in all tables
-- Usage: Run this in Supabase SQL Editor or via psql
-- Safe: This script only updates URLs ending with #icon
-- ============================================================================

-- 1. Fix blog_posts table
UPDATE blog_posts
SET featured_image = REPLACE(featured_image, '#icon', '')
WHERE featured_image LIKE '%#icon';

-- 2. Fix products table
UPDATE products
SET featured_image = REPLACE(featured_image, '#icon', '')
WHERE featured_image LIKE '%#icon';

-- 3. Fix any additional image columns in blog_posts
UPDATE blog_posts
SET thumbnail = REPLACE(thumbnail, '#icon', '')
WHERE thumbnail LIKE '%#icon';

-- 4. Check results
SELECT
  'blog_posts' as table_name,
  COUNT(*) as total_images,
  COUNT(*) FILTER (WHERE featured_image LIKE '%#icon') as with_fragments
FROM blog_posts
WHERE featured_image IS NOT NULL

UNION ALL

SELECT
  'products' as table_name,
  COUNT(*) as total_images,
  COUNT(*) FILTER (WHERE featured_image LIKE '%#icon') as with_fragments
FROM products
WHERE featured_image IS NOT NULL;

-- ============================================================================
-- Expected output: with_fragments should be 0 after running updates
-- ============================================================================
