# Phase 4 - Quick Start Guide

Rychlý návod pro práci s novými business strategy tabulkami.

---

## 1. Instalace a Setup

### Spuštění migrace (již provedeno)
```bash
cd /home/leos/ac-heating-web-new
docker exec -i supabase_db_leos psql -U postgres -d postgres < supabase/migrations/002_business_strategy.sql
```

### Spuštění seed scriptu (již provedeno)
```bash
npm run seed:business
```

### Ověření dat v Supabase Studio
```
http://localhost:54323
```

---

## 2. Základní Query Patterns

### Get Vision for Homepage Hero
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

const { data: vision } = await supabase
  .from('business_strategy')
  .select('title, description, details')
  .eq('category', 'vision')
  .eq('status', 'active')
  .single()

// Use in JSX:
<h1>{vision.description}</h1>
<p>{vision.details.goals[0].desc}</p>
```

### Get Segment-Specific Content
```typescript
// Detect entry channel (from UTM params, referer, etc.)
const entryChannel = 'linkedin' // or 'organic', 'ads', 'social'

const { data: segments } = await supabase
  .from('target_segments')
  .select('*')
  .eq('active', true)

// Find best segment
let targetSegment = segments.find(s =>
  entryChannel === 'linkedin'
    ? s.entry_channels.linkedin > 20
    : s.entry_channels[entryChannel] > 30
) || segments[0]

// Use personalized messaging
<h1>{targetSegment.messaging.hero}</h1>
<button>{targetSegment.messaging.cta}</button>
```

### Display SWOT Analysis
```typescript
const { data: swot } = await supabase
  .from('business_strategy')
  .select('*')
  .eq('category', 'swot')
  .eq('status', 'active')
  .order('priority', { ascending: true })

const grouped = {
  strengths: swot.filter(s => s.subcategory === 'strengths'),
  weaknesses: swot.filter(s => s.subcategory === 'weaknesses'),
  opportunities: swot.filter(s => s.subcategory === 'opportunities'),
  threats: swot.filter(s => s.subcategory === 'threats')
}

// Render
<section>
  <h2>Silné stránky</h2>
  {grouped.strengths.map(s => (
    <div key={s.id}>
      <h3>{s.title}</h3>
      <p>{s.description}</p>
    </div>
  ))}
</section>
```

### Get Primary KPIs for Dashboard
```typescript
const { data: kpis } = await supabase
  .from('kpis')
  .select('*')
  .eq('is_primary', true)
  .eq('year', 2025)
  .order('category')

// Calculate progress
const progress = kpis.map(kpi => ({
  name: kpi.metric_name,
  baseline: kpi.baseline_value,
  target: kpi.target_q4,
  actual: kpi.actual_value || kpi.baseline_value,
  progress: ((kpi.actual_value || kpi.baseline_value) / kpi.target_q4) * 100,
  unit: kpi.unit
}))

// Render with Recharts
<LineChart data={progress}>
  <Line dataKey="actual" stroke="#8884d8" />
  <Line dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" />
</LineChart>
```

### Compare with Competitors
```typescript
const { data: competitor } = await supabase
  .from('competitors')
  .select('*')
  .eq('name', 'Viessmann')
  .single()

// Show comparison
<div>
  <h3>AC Heating vs {competitor.name}</h3>
  <p>Cena: {competitor.pricing_vs_us > 0 ? 'O' : '+'} {Math.abs(competitor.pricing_vs_us)}% {competitor.pricing_vs_us > 0 ? 'levnější' : 'dražší'}</p>
  <p>Market share: {competitor.market_share}%</p>

  <h4>Naše výhody:</h4>
  {competitor.ac_heating_advantages.map(adv => (
    <div key={adv.title}>
      <strong>{adv.title}:</strong> {adv.detail}
    </div>
  ))}
</div>
```

### Get Products for Segment
```typescript
// Get segment ID first
const { data: segment } = await supabase
  .from('target_segments')
  .select('id')
  .eq('name', 'Rodinné domy (B2C)')
  .single()

// Get products for this segment
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    pricing,
    technical_specs,
    usp,
    roi_months,
    bundle_options
  `)
  .contains('target_segment_ids', [segment.id])
  .eq('published', true)

// Render with business context
products.map(product => (
  <div key={product.id}>
    <h3>{product.name}</h3>
    <p className="text-2xl font-bold">
      {product.pricing.base_price.toLocaleString('cs-CZ')} Kč
    </p>
    <p className="text-sm">
      S instalací: {product.pricing.with_installation.toLocaleString('cs-CZ')} Kč
    </p>
    <p className="text-green-600">{product.usp}</p>
    <p>ROI: {product.roi_months} měsíců</p>
    <p>COP: {product.technical_specs.cop}</p>
    <p>Garance: {product.warranty_years} let</p>

    <h4>Bundle nabídky:</h4>
    {product.bundle_options?.map(bundle => (
      <div key={bundle.name}>
        <span>{bundle.name}</span>
        <span className="text-green-600">-{bundle.discount}%</span>
        <span className="line-through">
          {product.pricing.with_installation.toLocaleString('cs-CZ')} Kč
        </span>
        <span className="font-bold">
          {(product.pricing.with_installation * (1 - bundle.discount / 100)).toLocaleString('cs-CZ')} Kč
        </span>
      </div>
    ))}
  </div>
))
```

---

## 3. Praktické use case

### Homepage Personalization

```typescript
// app/(pages)/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function HomePage({ searchParams }: { searchParams: { utm_source?: string } }) {
  const supabase = await createClient()

  // Detect segment
  const entryChannel = searchParams.utm_source === 'linkedin' ? 'linkedin' : 'organic'

  const { data: segment } = await supabase
    .from('target_segments')
    .select('*')
    .eq('active', true)
    .order('revenue_share', { ascending: false })
    .limit(1)
    .single()

  // Get vision
  const { data: vision } = await supabase
    .from('business_strategy')
    .select('*')
    .eq('category', 'vision')
    .single()

  return (
    <div>
      {/* Hero section - personalized */}
      <section className="hero">
        <h1>{segment.messaging.hero}</h1>
        <p>{vision.description}</p>
        <button>{segment.messaging.cta}</button>
      </section>

      {/* Features from SWOT strengths */}
      <section className="features">
        {/* Query strengths and display */}
      </section>
    </div>
  )
}
```

### Admin KPI Dashboard

```typescript
// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function AdminDashboard() {
  const [kpis, setKPIs] = useState([])
  const supabase = createClient()

  useEffect(() => {
    async function loadKPIs() {
      const { data } = await supabase
        .from('kpis')
        .select('*')
        .eq('is_primary', true)
        .eq('year', 2025)

      setKPIs(data || [])
    }
    loadKPIs()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {kpis.map(kpi => (
          <div key={kpi.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{kpi.metric_name}</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {kpi.actual_value || kpi.baseline_value}
              </span>
              <span className="text-gray-500 ml-2">{kpi.unit}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Target Q4: {kpi.target_q4} {kpi.unit}
            </div>
            <div className="mt-2">
              <div className="bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{
                    width: `${((kpi.actual_value || kpi.baseline_value) / kpi.target_q4) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Line chart showing quarterly targets */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quarterly Targets</h2>
        <LineChart width={800} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="target" stroke="#82ca9d" />
          <Line type="monotone" dataKey="actual" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  )
}
```

### Product Detail with Business Context

```typescript
// app/produkty/[slug]/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      pricing,
      technical_specs,
      usp,
      roi_months,
      bundle_options,
      warranty_years
    `)
    .eq('slug', slug)
    .single()

  return (
    <div>
      <h1>{product.name}</h1>

      {/* Pricing */}
      <div className="pricing">
        <div className="price-main">
          {product.pricing.base_price.toLocaleString('cs-CZ')} Kč
          <span className="text-sm">bez instalace</span>
        </div>
        <div className="price-install">
          {product.pricing.with_installation.toLocaleString('cs-CZ')} Kč
          <span className="text-sm">s instalací na klíč</span>
        </div>
        {product.pricing.subsidy_eligible && (
          <div className="subsidy-badge">
            Dotace až {product.pricing.subsidy_amount.toLocaleString('cs-CZ')} Kč
          </div>
        )}
      </div>

      {/* USP */}
      <div className="usp bg-green-50 p-4 rounded-lg">
        <strong>Klíčová výhoda:</strong> {product.usp}
      </div>

      {/* Technical Specs */}
      <div className="specs grid grid-cols-2 gap-4">
        <div>
          <span className="label">Typ:</span>
          <span>{product.technical_specs.type}</span>
        </div>
        <div>
          <span className="label">Výkon:</span>
          <span>{product.technical_specs.output_kw} kW</span>
        </div>
        <div>
          <span className="label">COP:</span>
          <span>{product.technical_specs.cop}</span>
        </div>
        <div>
          <span className="label">Energetická třída:</span>
          <span>{product.technical_specs.rating}</span>
        </div>
        <div>
          <span className="label">Regulace:</span>
          <span>{product.technical_specs.regulation}</span>
        </div>
        <div>
          <span className="label">Garance:</span>
          <span>{product.warranty_years} let</span>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="roi">
        <h3>Návratnost investice</h3>
        <p>Očekávaná návratnost: <strong>{product.roi_months} měsíců</strong></p>
        <p>To je přibližně <strong>{Math.round(product.roi_months / 12)} roky</strong></p>
      </div>

      {/* Bundle Options */}
      {product.bundle_options && product.bundle_options.length > 0 && (
        <div className="bundles">
          <h3>Výhodné balíčky</h3>
          {product.bundle_options.map((bundle: any) => (
            <div key={bundle.name} className="bundle-card">
              <h4>{bundle.name}</h4>
              <p className="desc">{bundle.desc}</p>
              <div className="pricing">
                <span className="discount">-{bundle.discount}%</span>
                <span className="original line-through">
                  {product.pricing.with_installation.toLocaleString('cs-CZ')} Kč
                </span>
                <span className="final font-bold text-2xl">
                  {(product.pricing.with_installation * (1 - bundle.discount / 100)).toLocaleString('cs-CZ')} Kč
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 4. Admin Functions

### Update KPI Actual Value
```typescript
async function updateKPIActual(metricName: string, actualValue: number, period: Date) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('kpis')
    .update({
      actual_value: actualValue,
      actual_period: period.toISOString()
    })
    .eq('metric_name', metricName)
    .eq('year', 2025)
    .select()

  if (error) throw error
  return data
}

// Usage
await updateKPIActual('Conversion Rate', 3.5, new Date('2025-03-15'))
```

### Add New Competitor
```typescript
async function addCompetitor(competitorData: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('competitors')
    .insert({
      name: competitorData.name,
      tier: competitorData.tier,
      strengths: competitorData.strengths,
      weaknesses: competitorData.weaknesses,
      pricing_vs_us: competitorData.pricing_vs_us,
      market_share: competitorData.market_share,
      ac_heating_advantages: competitorData.advantages
    })
    .select()

  if (error) throw error
  return data
}
```

---

## 5. TypeScript Types

```typescript
// lib/types/business.ts

export interface BusinessStrategy {
  id: string
  category: 'vision' | 'mission' | 'values' | 'swot'
  subcategory?: string
  title: string
  description: string
  details?: any
  priority: number
  status: 'active' | 'archived' | 'draft'
}

export interface TargetSegment {
  id: string
  name: string
  persona_name: string
  demographics: any
  motivations: Array<{ icon: string; text: string; value?: string }>
  entry_channels: Record<string, number>
  buying_cycle: string
  messaging: {
    hero: string
    cta: string
    lead_magnet?: string
  }
  revenue_share: number
  avg_order_value: number
  active: boolean
}

export interface KPI {
  id: string
  metric_name: string
  category: 'revenue' | 'marketing' | 'operational' | 'installation'
  baseline_value: number
  target_q1: number
  target_q2: number
  target_q3: number
  target_q4: number
  actual_value?: number
  unit: string
  is_primary: boolean
  year: number
}

export interface Competitor {
  id: string
  name: string
  tier: 'premium' | 'mid-range' | 'low-cost'
  strengths: Array<{ title: string; detail: string }>
  weaknesses: Array<{ title: string; detail: string }>
  pricing_vs_us: number
  market_share: number
  ac_heating_advantages: Array<{ title: string; detail: string }>
}
```

---

## 6. Troubleshooting

### Permission errors při seedingu
```bash
docker exec -i supabase_db_leos psql -U postgres -d postgres <<'EOF'
GRANT ALL ON business_strategy TO service_role;
GRANT ALL ON target_segments TO service_role;
GRANT ALL ON kpis TO service_role;
GRANT ALL ON competitors TO service_role;
EOF
```

### Re-seed data
```bash
# Clear
docker exec -i supabase_db_leos psql -U postgres -d postgres <<'EOF'
TRUNCATE business_strategy, target_segments, kpis, competitors CASCADE;
EOF

# Re-seed
npm run seed:business
```

### Verify data
```bash
docker exec -i supabase_db_leos psql -U postgres -d postgres -c "SELECT COUNT(*) FROM business_strategy;"
docker exec -i supabase_db_leos psql -U postgres -d postgres -c "SELECT COUNT(*) FROM target_segments;"
docker exec -i supabase_db_leos psql -U postgres -d postgres -c "SELECT COUNT(*) FROM kpis;"
docker exec -i supabase_db_leos psql -U postgres -d postgres -c "SELECT COUNT(*) FROM competitors;"
```

---

## Odkazy

- **Kompletní dokumentace:** `/docs/PHASE4_QUERIES.md`
- **Completion report:** `/PHASE4_COMPLETION_REPORT.md`
- **SQL schema:** `/supabase/migrations/002_business_strategy.sql`
- **Seed script:** `/scripts/seed-business-data.ts`

---

**Hotovo!** Nyní máš k dispozici kompletní business strategii v databázi a můžeš ji využít v Next.js aplikaci.
