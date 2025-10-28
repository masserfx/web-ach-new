-- AC Heating CMS - Migration Test Queries
-- Run these after applying 003_ai_cms.sql migration
-- Usage: psql $DATABASE_URL -f scripts/test-cms-migration.sql

\echo '=== AC HEATING CMS MIGRATION TEST ==='
\echo ''

-- 1. Check all tables exist
\echo '1. Checking tables existence...'
SELECT
  CASE
    WHEN COUNT(*) = 4 THEN '✅ All 4 CMS tables exist'
    ELSE '❌ Missing tables! Expected 4, found ' || COUNT(*)
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('cms_content', 'cms_edit_history', 'revenue_projections', 'personnel_planning');

\echo ''

-- 2. Check business_strategy data
\echo '2. Checking business_strategy seed data...'
SELECT
  category,
  COUNT(*) as count,
  CASE
    WHEN category = 'vision' AND COUNT(*) = 1 THEN '✅'
    WHEN category = 'mission' AND COUNT(*) = 1 THEN '✅'
    WHEN category = 'strengths' AND COUNT(*) = 4 THEN '✅'
    WHEN category = 'weaknesses' AND COUNT(*) = 3 THEN '✅'
    WHEN category = 'opportunities' AND COUNT(*) = 4 THEN '✅'
    WHEN category = 'threats' AND COUNT(*) = 4 THEN '✅'
    ELSE '❌'
  END as status
FROM business_strategy
GROUP BY category
ORDER BY
  CASE category
    WHEN 'vision' THEN 1
    WHEN 'mission' THEN 2
    WHEN 'strengths' THEN 3
    WHEN 'weaknesses' THEN 4
    WHEN 'opportunities' THEN 5
    WHEN 'threats' THEN 6
  END;

\echo ''

-- 3. Check target_segments
\echo '3. Checking target_segments...'
SELECT
  CASE
    WHEN COUNT(*) = 3 THEN '✅ All 3 target segments exist'
    ELSE '❌ Expected 3 segments, found ' || COUNT(*)
  END as status
FROM target_segments;

SELECT
  name,
  revenue_percentage || '%' as revenue_share,
  CASE
    WHEN name = 'Rodinné domy' AND revenue_percentage = 60 THEN '✅'
    WHEN name = 'Bytové domy' AND revenue_percentage = 25 THEN '✅'
    WHEN name = 'Developery/Firmy' AND revenue_percentage = 15 THEN '✅'
    ELSE '❌'
  END as status
FROM target_segments
ORDER BY revenue_percentage DESC;

\echo ''

-- 4. Check revenue_projections
\echo '4. Checking revenue_projections (2023-2027)...'
SELECT
  year,
  TO_CHAR(SUM(amount), '999G999G999') || ' Kč' as total_revenue,
  COUNT(*) as categories,
  CASE
    WHEN year = 2023 AND SUM(amount) > 350000000 THEN '✅'
    WHEN year = 2024 AND SUM(amount) > 360000000 THEN '✅'
    WHEN year = 2025 AND SUM(amount) > 370000000 THEN '✅'
    WHEN year = 2026 AND SUM(amount) > 430000000 THEN '✅'
    WHEN year = 2027 AND SUM(amount) > 520000000 THEN '✅'
    ELSE '⚠️'
  END as status
FROM revenue_projections
GROUP BY year
ORDER BY year;

\echo ''

-- 5. Check personnel_planning
\echo '5. Checking personnel_planning (2025-2027)...'
SELECT
  year,
  SUM(count) as total_employees,
  COUNT(DISTINCT department) as departments,
  CASE
    WHEN year = 2025 AND SUM(count) >= 108 THEN '✅'
    WHEN year = 2026 AND SUM(count) >= 116 THEN '✅'
    WHEN year = 2027 AND SUM(count) >= 129 THEN '✅'
    ELSE '⚠️'
  END as status
FROM personnel_planning
GROUP BY year
ORDER BY year;

\echo ''

-- 6. Check cms_content table structure
\echo '6. Checking cms_content table structure...'
SELECT
  column_name,
  data_type,
  CASE
    WHEN is_nullable = 'NO' THEN 'NOT NULL'
    ELSE 'nullable'
  END as nullable
FROM information_schema.columns
WHERE table_name = 'cms_content'
  AND column_name IN ('id', 'content_type', 'slug', 'title', 'content', 'ai_generated', 'status')
ORDER BY ordinal_position;

\echo ''

-- 7. Check RLS policies
\echo '7. Checking RLS policies...'
SELECT
  schemaname,
  tablename,
  policyname,
  CASE
    WHEN cmd = 'SELECT' THEN '✅ READ policy'
    WHEN cmd = 'ALL' THEN '✅ FULL ACCESS policy'
    ELSE cmd
  END as policy_type
FROM pg_policies
WHERE tablename IN ('cms_content', 'cms_edit_history')
ORDER BY tablename, policyname;

\echo ''

-- 8. Check indexes
\echo '8. Checking indexes...'
SELECT
  tablename,
  indexname,
  '✅' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('cms_content', 'cms_edit_history', 'revenue_projections', 'personnel_planning')
ORDER BY tablename, indexname;

\echo ''

-- 9. Summary
\echo '=== MIGRATION TEST SUMMARY ==='
SELECT
  'Total tables created' as metric,
  COUNT(DISTINCT table_name) as value
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('cms_content', 'cms_edit_history', 'revenue_projections', 'personnel_planning')
UNION ALL
SELECT
  'Business strategy records',
  COUNT(*)
FROM business_strategy
UNION ALL
SELECT
  'Target segments',
  COUNT(*)
FROM target_segments
UNION ALL
SELECT
  'Revenue projection records',
  COUNT(*)
FROM revenue_projections
UNION ALL
SELECT
  'Personnel planning records',
  COUNT(*)
FROM personnel_planning
UNION ALL
SELECT
  'RLS policies active',
  COUNT(*)
FROM pg_policies
WHERE tablename IN ('cms_content', 'cms_edit_history', 'revenue_projections', 'personnel_planning');

\echo ''
\echo '✅ Migration test complete!'
\echo ''
\echo 'Next steps:'
\echo '1. Visit http://localhost:3100/admin'
\echo '2. Configure ANTHROPIC_API_KEY in .env.local'
\echo '3. Generate test content'
\echo ''
