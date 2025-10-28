# Phase 4 - Database Queries Reference

## Frontend Query Examples

Tento dokument obsahuje příklady queries pro použití v Next.js aplikaci.

---

## 1. Business Strategy

### Načíst Vizi, Misi, Values

```typescript
import { createClient } from '@/lib/supabase/client'

// Get Vision
const { data: vision } = await supabase
  .from('business_strategy')
  .select('*')
  .eq('category', 'vision')
  .eq('status', 'active')
  .single()

console.log(vision.title) // "Dlouhodobý cíl 2025-2030"
console.log(vision.description) // "Být nejdůvěryhodnější značkou..."
console.log(vision.details.goals) // Array of goals with icons

// Get Mission
const { data: mission } = await supabase
  .from('business_strategy')
  .select('*')
  .eq('category', 'mission')
  .eq('status', 'active')
  .single()

// Get Values
const { data: values } = await supabase
  .from('business_strategy')
  .select('*')
  .eq('category', 'values')
  .eq('status', 'active')
  .single()
```

### Načíst SWOT analýzu

```typescript
// Get all SWOT items grouped by subcategory
const { data: swot } = await supabase
  .from('business_strategy')
  .select('*')
  .eq('category', 'swot')
  .eq('status', 'active')
  .order('subcategory', { ascending: true })
  .order('priority', { ascending: true })

// Group by subcategory
const swotGrouped = {
  strengths: swot.filter(s => s.subcategory === 'strengths'),
  weaknesses: swot.filter(s => s.subcategory === 'weaknesses'),
  opportunities: swot.filter(s => s.subcategory === 'opportunities'),
  threats: swot.filter(s => s.subcategory === 'threats')
}

// Example: Display strengths
swotGrouped.strengths.forEach(strength => {
  console.log(`✅ ${strength.title}: ${strength.description}`)
})

// Example: Display weaknesses with mitigation
swotGrouped.weaknesses.forEach(weakness => {
  console.log(`⚠️ ${weakness.title}: ${weakness.description}`)
  if (weakness.details?.mitigation) {
    console.log(`   Mitigation: ${weakness.details.mitigation}`)
  }
})
```

---

## 2. Target Segments & Personas

### Načíst všechny segmenty

```typescript
const { data: segments } = await supabase
  .from('target_segments')
  .select('*')
  .eq('active', true)
  .order('revenue_share', { ascending: false })

// segments[0] = "Rodinné domy (B2C)" - 60%
// segments[1] = "Bytové domy (B2B/B2C)" - 25%
// segments[2] = "Firemní objekty (B2B)" - 15%

segments.forEach(segment => {
  console.log(`${segment.name} - ${segment.revenue_share}% revenue`)
  console.log(`Persona: ${segment.persona_name}`)
  console.log(`Buying cycle: ${segment.buying_cycle}`)
  console.log(`Hero message: ${segment.messaging.hero}`)
})
```

### Personalizovaný landing page content

```typescript
// Get segment based on user source
async function getPersonalizedContent(source: 'organic' | 'linkedin' | 'ads') {
  const { data: segments } = await supabase
    .from('target_segments')
    .select('*')
    .eq('active', true)

  // Find best matching segment based on entry channels
  let bestSegment = segments[0]

  if (source === 'linkedin') {
    // LinkedIn = B2B segments (Bytové domy nebo Firemní objekty)
    bestSegment = segments.find(s =>
      s.name.includes('Bytové') || s.name.includes('Firemní')
    ) || bestSegment
  }

  return {
    hero: bestSegment.messaging.hero,
    cta: bestSegment.messaging.cta,
    leadMagnet: bestSegment.messaging.lead_magnet,
    motivations: bestSegment.motivations
  }
}

// Usage in page component
const content = await getPersonalizedContent('linkedin')
// Returns: "Dekarbonizujte s ROI < 5 let + ESG reporting"
```

---

## 3. KPIs & Metrics

### Dashboard - Primary KPIs

```typescript
const { data: primaryKPIs } = await supabase
  .from('kpis')
  .select('*')
  .eq('is_primary', true)
  .eq('year', 2025)
  .order('category', { ascending: true })

// Format for dashboard
const kpiDashboard = primaryKPIs.map(kpi => ({
  name: kpi.metric_name,
  baseline: kpi.baseline_value,
  targets: {
    q1: kpi.target_q1,
    q2: kpi.target_q2,
    q3: kpi.target_q3,
    q4: kpi.target_q4
  },
  actual: kpi.actual_value, // To be updated
  unit: kpi.unit,
  category: kpi.category
}))

// Example output:
// {
//   name: "Conversion Rate",
//   baseline: 2.5,
//   targets: { q1: 4, q2: 5, q3: 6, q4: 8 },
//   actual: null,
//   unit: "%",
//   category: "marketing"
// }
```

### Marketing KPIs

```typescript
const { data: marketingKPIs } = await supabase
  .from('kpis')
  .select('*')
  .eq('category', 'marketing')
  .eq('year', 2025)
  .order('is_primary', { ascending: false })

// Key metrics for marketing team
const keyMetrics = {
  conversionRate: marketingKPIs.find(k => k.metric_name === 'Conversion Rate'),
  leadQuality: marketingKPIs.find(k => k.metric_name === 'Lead Quality'),
  costPerLead: marketingKPIs.find(k => k.metric_name === 'Cost per Lead'),
  organicTraffic: marketingKPIs.find(k => k.metric_name === 'Organic Traffic')
}
```

### Update actual values (admin function)

```typescript
async function updateKPIActual(metricName: string, actualValue: number, period: Date) {
  const { data, error } = await supabase
    .from('kpis')
    .update({
      actual_value: actualValue,
      actual_period: period.toISOString()
    })
    .eq('metric_name', metricName)
    .eq('year', 2025)
    .select()

  return data
}

// Example: Update Conversion Rate
await updateKPIActual('Conversion Rate', 3.2, new Date('2025-03-15'))
```

---

## 4. Competitors

### Načíst konkurenty podle tier

```typescript
// Premium competitors
const { data: premiumCompetitors } = await supabase
  .from('competitors')
  .select('*')
  .eq('tier', 'premium')
  .order('market_share', { ascending: false })

// Output: Viessmann (18%), Vaillant (15%), Buderus (10%)

// All competitors grouped
const { data: allCompetitors } = await supabase
  .from('competitors')
  .select('*')
  .order('tier', { ascending: true })
  .order('market_share', { ascending: false })

const competitorsByTier = {
  premium: allCompetitors.filter(c => c.tier === 'premium'),
  midRange: allCompetitors.filter(c => c.tier === 'mid-range'),
  lowCost: allCompetitors.filter(c => c.tier === 'low-cost')
}
```

### Porovnání s konkurencí (pro marketing)

```typescript
async function getCompetitiveAdvantages(competitorName: string) {
  const { data: competitor } = await supabase
    .from('competitors')
    .select('*')
    .eq('name', competitorName)
    .single()

  return {
    competitor: competitor.name,
    tier: competitor.tier,
    marketShare: competitor.market_share,
    priceDifference: competitor.pricing_vs_us, // +25% = they are 25% more expensive
    theirStrengths: competitor.strengths,
    theirWeaknesses: competitor.weaknesses,
    ourAdvantages: competitor.ac_heating_advantages
  }
}

// Usage
const comparison = await getCompetitiveAdvantages('Viessmann')
// Output:
// {
//   competitor: "Viessmann",
//   priceDifference: 25, // They are 25% more expensive
//   ourAdvantages: [
//     { title: "Vlastní výroba", detail: "Nižší cena, rychlejší reakce" },
//     { title: "xCC2 regulace", detail: "Lepší než generické řešení" }
//   ]
// }
```

---

## 5. Enhanced Products

### Produkty s business daty

```typescript
// Get products with all business enhancements
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    pricing,
    technical_specs,
    target_segment_ids,
    usp,
    roi_months,
    bundle_options,
    warranty_years
  `)
  .eq('published', true)
  .not('pricing', 'is', null) // Only products with pricing data

// Display product with business context
products.forEach(product => {
  console.log(`${product.name}`)
  console.log(`Base price: ${product.pricing.base_price.toLocaleString('cs-CZ')} Kč`)
  console.log(`With installation: ${product.pricing.with_installation.toLocaleString('cs-CZ')} Kč`)
  console.log(`COP: ${product.technical_specs.cop}`)
  console.log(`USP: ${product.usp}`)
  console.log(`ROI: ${product.roi_months} měsíců`)
  console.log(`Garance: ${product.warranty_years} let`)
})
```

### Produkty pro konkrétní segment

```typescript
async function getProductsForSegment(segmentName: string) {
  // Get segment ID
  const { data: segment } = await supabase
    .from('target_segments')
    .select('id')
    .eq('name', segmentName)
    .single()

  if (!segment) return []

  // Get products matching this segment
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .contains('target_segment_ids', [segment.id])
    .eq('published', true)

  return products
}

// Usage
const familyHouseProducts = await getProductsForSegment('Rodinné domy (B2C)')
// Returns: Products tagged for family houses (CONVERT NG ONE, TWO)

const apartmentProducts = await getProductsForSegment('Bytové domy (B2B/B2C)')
// Returns: Products for apartments (CONVERT NG HYBRID)
```

### Produkt detail s bundle options

```typescript
async function getProductWithBundles(productSlug: string) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', productSlug)
    .single()

  // Format bundle options for UI
  const bundles = product.bundle_options?.map((bundle: any) => ({
    name: bundle.name,
    discount: bundle.discount,
    description: bundle.desc,
    calculatedPrice: product.pricing.with_installation * (1 - bundle.discount / 100)
  }))

  return {
    ...product,
    bundles
  }
}

// Example output:
// bundles: [
//   {
//     name: "TČ + FVE",
//     discount: 8,
//     description: "Tepelné čerpadlo + Fotovoltaika",
//     calculatedPrice: 294400 // 320000 * 0.92
//   }
// ]
```

---

## 6. Combined Queries (Business Intelligence)

### Homepage - Strategic Overview

```typescript
async function getHomePageBusinessData() {
  // Vision for hero section
  const { data: vision } = await supabase
    .from('business_strategy')
    .select('title, description, details')
    .eq('category', 'vision')
    .single()

  // Top 3 strengths for USP section
  const { data: strengths } = await supabase
    .from('business_strategy')
    .select('title, description')
    .eq('category', 'swot')
    .eq('subcategory', 'strengths')
    .order('priority', { ascending: true })
    .limit(3)

  // Featured products
  const { data: products } = await supabase
    .from('products')
    .select('*, pricing, technical_specs, usp')
    .eq('featured', true)
    .eq('published', true)
    .limit(3)

  return {
    vision,
    strengths,
    products
  }
}
```

### About Page - Company Story

```typescript
async function getAboutPageData() {
  const { data: mission } = await supabase
    .from('business_strategy')
    .select('*')
    .eq('category', 'mission')
    .single()

  const { data: values } = await supabase
    .from('business_strategy')
    .select('*')
    .eq('category', 'values')
    .single()

  const { data: strengths } = await supabase
    .from('business_strategy')
    .select('*')
    .eq('category', 'swot')
    .eq('subcategory', 'strengths')
    .order('priority', { ascending: true })

  return {
    mission: {
      title: mission.title,
      description: mission.description,
      pillars: mission.details.pillars
    },
    values: values.details.values,
    strengths
  }
}
```

### Admin Dashboard - Business Metrics

```typescript
async function getBusinessDashboard() {
  // Primary KPIs
  const { data: kpis } = await supabase
    .from('kpis')
    .select('*')
    .eq('is_primary', true)
    .eq('year', 2025)

  // Target segments performance
  const { data: segments } = await supabase
    .from('target_segments')
    .select('name, revenue_share, avg_order_value')
    .eq('active', true)
    .order('revenue_share', { ascending: false })

  // Competitive landscape
  const { data: competitors } = await supabase
    .from('competitors')
    .select('name, tier, market_share, pricing_vs_us')
    .order('market_share', { ascending: false })

  return {
    kpis,
    segments,
    competitors,
    marketOverview: {
      totalMarketShare: competitors.reduce((sum, c) => sum + c.market_share, 0),
      acHeatingPosition: '5%', // From BUSINESS_STRATEGY.md
      targetPosition: 'TOP 3'
    }
  }
}
```

---

## TypeScript Types

```typescript
// types/business.ts

export interface BusinessStrategy {
  id: string
  category: 'vision' | 'mission' | 'values' | 'swot'
  subcategory?: 'strengths' | 'weaknesses' | 'opportunities' | 'threats'
  title: string
  description: string
  details?: {
    goals?: Array<{ icon: string; title: string; desc: string }>
    pillars?: Array<{ title: string; desc: string }>
    values?: Array<{ icon: string; title: string; desc: string }>
    mitigation?: string
    potential?: string
  }
  priority: number
  status: 'active' | 'archived' | 'draft'
  created_at: string
  updated_at: string
}

export interface TargetSegment {
  id: string
  name: string
  persona_name: string
  demographics: {
    age_range?: string
    family?: string
    role?: string
    education?: string
    income?: string
    personality?: string
    decision_type?: string
  }
  motivations: Array<{
    icon: string
    text: string
    value?: string
  }>
  entry_channels: {
    organic?: number
    ads?: number
    social?: number
    linkedin?: number
    direct?: number
    referral?: number
    events?: number
  }
  buying_cycle: string
  buying_stage_notes?: string
  messaging: {
    hero: string
    cta: string
    lead_magnet?: string
    value_prop?: string
    social_proof?: string
  }
  revenue_share: number
  avg_order_value: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface KPI {
  id: string
  metric_name: string
  category: 'revenue' | 'marketing' | 'operational' | 'installation'
  baseline_value: number
  baseline_period: string
  target_q1: number
  target_q2: number
  target_q3: number
  target_q4: number
  actual_value?: number
  actual_period?: string
  unit: string
  description?: string
  year: number
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface Competitor {
  id: string
  name: string
  tier: 'premium' | 'mid-range' | 'low-cost'
  strengths: Array<{ title: string; detail: string }>
  weaknesses: Array<{ title: string; detail: string }>
  pricing_vs_us: number
  avg_product_price: number
  market_share: number
  ac_heating_advantages: Array<{ title: string; detail: string }>
  website?: string
  notes?: string
  last_updated: string
  created_at: string
}

export interface ProductEnhanced {
  // ... existing product fields
  pricing: {
    base_price: number
    with_installation: number
    financing_available?: boolean
    financing_months?: number[]
    subsidy_eligible?: boolean
    subsidy_amount?: number
  }
  technical_specs: {
    type?: string
    output_kw?: string
    cop?: number
    rating?: string
    regulation?: string
    noise_level?: string
    refrigerant?: string
    backup?: string
  }
  target_segment_ids: string[]
  usp: string
  roi_months: number
  bundle_options?: Array<{
    name: string
    discount: number
    desc?: string
  }>
  warranty_years: number
}
```

---

**Next Steps:**
1. Implement these queries in Next.js components
2. Create Recharts visualizations for KPIs
3. Build admin interface for updating actual_value in KPIs
4. Add personalization logic based on entry_channels

**Documentation:**
- `/docs/PHASE4_QUERIES.md` - This file
- `/supabase/migrations/002_business_strategy.sql` - Schema
- `/scripts/seed-business-data.ts` - Seed data
