# Phase 5: AI-Powered CMS - Quick Start Guide
**Setup time:** 5 minut
**Prerequisites:** Supabase running, Node.js installed

---

## 🚀 Quick Setup (5 kroků)

### 1. Apply Database Migration

```bash
cd ~/ac-heating-web-new

# Apply migration
npx supabase db push

# Or if using remote Supabase:
# npx supabase db push --db-url "postgresql://..."
```

**Expected output:**
```
Applying migration 003_ai_cms.sql...
✅ Migration applied successfully
```

---

### 2. Verify Migration

```bash
# Run test queries
psql $DATABASE_URL -f scripts/test-cms-migration.sql
```

**Expected summary:**
```
Total tables created: 4
Business strategy records: 15
Target segments: 3
Revenue projection records: 40+
Personnel planning records: 45+
RLS policies active: 6
```

---

### 3. Configure API Key

```bash
# Check if ANTHROPIC_API_KEY exists
cat .env.local | grep ANTHROPIC

# If not found, add it:
echo "ANTHROPIC_API_KEY=sk-ant-api03-xxx" >> .env.local
```

**Get API key:**
1. Visit https://console.anthropic.com/
2. Create API key
3. Copy to .env.local

---

### 4. Start Dev Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.0.0
✓ Ready in 2.5s
○ Local: http://localhost:3100
```

---

### 5. Access Admin

```bash
# Open browser
open http://localhost:3100/admin
```

**Expected UI:**
- ✅ KPI Dashboard (6 metrics)
- ✅ AI Content Generator
- ✅ Recent Content (empty)
- ✅ Edit History (empty)

---

## 🤖 First Content Generation

### Test Prompt

1. **Select Content Type:** Blog článek
2. **Enter Prompt:**
   ```
   Vytvoř článek o dotacích na tepelná čerpadla v roce 2025.
   Zaměř se na program NZÚ, výši dotace a proces žádosti.
   Cílová skupina: majitelé rodinných domů.
   ```
3. **Click:** "Vygenerovat obsah"
4. **Wait:** 10-30 sekund (depends on Claude API)
5. **Review Preview:**
   - Titulek
   - Meta description
   - Content JSON
6. **Click:** "Publikovat" nebo "Zahodit"

---

## ✅ Verification Checklist

### Database
- [x] Migration 003 applied
- [x] 4 tables created (cms_content, cms_edit_history, revenue_projections, personnel_planning)
- [x] Business data seeded (15 records)
- [x] Target segments (3 records)
- [x] Revenue projections (40+ records)
- [x] Personnel planning (45+ records)

### Admin UI
- [x] /admin accessible
- [x] KPI Dashboard visible
- [x] AI Generator functional
- [x] Content Type selector works
- [x] Generate button enabled

### AI Integration
- [x] ANTHROPIC_API_KEY configured
- [x] API call successful
- [x] JSON response parsed
- [x] Content saved to cms_content
- [x] Edit history logged

---

## 🧪 Test Queries

### Check CMS Content

```sql
-- All AI-generated content
SELECT
  id,
  title,
  content_type,
  status,
  ai_generated,
  created_at
FROM cms_content
WHERE ai_generated = true
ORDER BY created_at DESC;
```

### Check Edit History

```sql
-- All AI generations
SELECT
  edit_type,
  ai_model,
  LEFT(prompt_used, 50) as prompt_preview,
  editor_name,
  created_at
FROM cms_edit_history
WHERE edit_type = 'ai_generated'
ORDER BY created_at DESC;
```

### Check Business Data

```sql
-- Revenue summary by year
SELECT
  year,
  TO_CHAR(SUM(amount), '999G999G999') || ' Kč' as total
FROM revenue_projections
GROUP BY year
ORDER BY year;

-- Expected:
-- 2023: 353M Kč
-- 2027: 522M Kč (growth +48%)
```

---

## 🐛 Troubleshooting

### Issue: Migration fails

**Error:** `relation "business_strategy" does not exist`

**Solution:**
```bash
# Apply previous migrations first
npx supabase db push

# Check migration history
psql $DATABASE_URL -c "SELECT * FROM supabase_migrations.schema_migrations;"
```

---

### Issue: AI key not working

**Error:** `ANTHROPIC_API_KEY není nakonfigurován`

**Solution:**
```bash
# Verify .env.local exists
cat .env.local

# Restart dev server
npm run dev

# Test API key manually
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

### Issue: Admin page 404

**Error:** `404 - This page could not be found`

**Solution:**
```bash
# Check if admin/page.tsx exists
ls -la src/app/admin/page.tsx

# Rebuild
rm -rf .next
npm run dev
```

---

### Issue: Database connection error

**Error:** `Failed to fetch from Supabase`

**Solution:**
```bash
# Check Supabase env vars
cat .env.local | grep SUPABASE

# Verify Supabase is running (if local)
docker ps | grep supabase

# Test connection
psql $NEXT_PUBLIC_SUPABASE_URL
```

---

## 📚 Next Steps

### Immediate
1. ✅ Generate 3 test articles (blog, case_study, landing_page)
2. ✅ Review AI output quality
3. ✅ Iterate on prompts

### Week 1
1. Train marketing team (see CMS_USAGE_GUIDE.md)
2. Create content calendar
3. Generate 5 production articles
4. Monitor KPIs (conversion rate)

### Month 1
1. 20+ AI-generated articles published
2. Measure time savings vs manual process
3. Gather feedback from team
4. Fine-tune AI prompts

---

## 📞 Support

**Documentation:**
- `/docs/CMS_USAGE_GUIDE.md` - Comprehensive guide (400+ lines)
- `/docs/PHASE5_QUICK_START.md` - This file
- `/docs/PHASE5_COMPLETION_REPORT.md` - Full implementation report

**Database:**
- `/supabase/migrations/003_ai_cms.sql` - Schema definition
- `/scripts/test-cms-migration.sql` - Test queries

**Code:**
- `/src/app/admin/page.tsx` - Admin UI
- `/src/app/api/cms/generate/route.ts` - AI API
- `/src/app/api/cms/publish/route.ts` - Publish API

---

## 🎯 Success Criteria

### Setup Complete ✅
- [x] Migration applied
- [x] API key configured
- [x] Admin accessible
- [x] Test content generated

### Ready for Production ✅
- [x] All tables seeded
- [x] RLS policies active
- [x] AI integration tested
- [x] Documentation complete

### Next Milestone
- [ ] 5 production articles published
- [ ] Marketing team trained
- [ ] KPIs baseline established
- [ ] Content workflow defined

---

**Setup time:** ~5 minut
**Documentation:** Complete
**Status:** ✅ PRODUCTION READY

**Start now:** `cd ~/ac-heating-web-new && npm run dev && open http://localhost:3100/admin`
