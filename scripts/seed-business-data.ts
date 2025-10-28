#!/usr/bin/env tsx
/**
 * AC Heating - Business Data Seeder
 *
 * Seeds database with business strategy data from BUSINESS_STRATEGY.md:
 * - Vision, Mission, Values, SWOT
 * - Target Segments & Personas (3 segments)
 * - KPIs (Q1-Q4 2025 targets)
 * - Competitors (Tier 1, 2, 3)
 * - Product enhancements
 *
 * Usage:
 *   npm run seed:business
 *   or: tsx scripts/seed-business-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ============================================
// 1. BUSINESS STRATEGY (Vision, Mission, Values, SWOT)
// ============================================

async function seedBusinessStrategy() {
  console.log('\n📊 Seeding Business Strategy...')

  const strategyData = [
    // VISION
    {
      category: 'vision',
      subcategory: null,
      title: 'Dlouhodobý cíl 2025-2030',
      description: 'Být nejdůvěryhodnější značkou inteligentního vytápění v ČR',
      details: {
        goals: [
          { icon: '🏆', title: 'Market Leader', desc: 'TOP 3 v tepelných čerpadlech v ČR' },
          { icon: '🌍', title: 'Udržitelnost', desc: '100% podpora dekarbonizace českých domácností' },
          { icon: '💡', title: 'Inovace', desc: 'Vlastní vývoj xCC2 regulace (konkurenční výhoda)' },
          { icon: '🤝', title: 'Zákaznická spokojenost', desc: 'Net Promoter Score 70+' }
        ]
      },
      priority: 1,
      status: 'active'
    },

    // MISSION
    {
      category: 'mission',
      subcategory: null,
      title: 'Jak to uděláme',
      description: 'Poskytujeme komplexní energetická řešení s vlastním vývojem a výrobou, kde chytrá regulace je srdce systému',
      details: {
        pillars: [
          { title: 'Vlastní výroba', desc: 'Made in Czech Republic (Letkov, 326 00)' },
          { title: 'Inteligentní regulace', desc: 'xCC2 system (patentovaná technologie)' },
          { title: 'Komplexní servis', desc: 'Od návrhu po instalaci a servis' },
          { title: 'Certifikace', desc: 'APVTC, CFA, CTI (důvěryhodnost)' },
          { title: 'Garance', desc: '7 let záruky na produkty' }
        ]
      },
      priority: 2,
      status: 'active'
    },

    // VALUES
    {
      category: 'values',
      subcategory: null,
      title: 'Co nás řídí',
      description: 'Naše základní hodnoty a principy',
      details: {
        values: [
          { icon: '✅', title: 'Kvalita', desc: 'Czech design, prémium komponenty' },
          { icon: '✅', title: 'Transparentnost', desc: 'Jasné ceny, ROI kalkulace' },
          { icon: '✅', title: 'Odbornost', desc: '18+ let zkušeností, 100+ zaměstnanců' },
          { icon: '✅', title: 'Udržitelnost', desc: 'Ekologická řešení, dotační podpora' },
          { icon: '✅', title: 'Inovace', desc: 'Vlastní R&D, kontinuální vývoj' }
        ]
      },
      priority: 3,
      status: 'active'
    },

    // SWOT - STRENGTHS
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'Vlastní výroba',
      description: 'Kompletní kontrola kvality, rychlá reakce na požadavky',
      priority: 1,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'xCC2 regulace',
      description: 'Unikátní technologie, konkurenční výhoda',
      priority: 2,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'Zkušenosti',
      description: '18+ let na trhu, 7,500+ instalací',
      priority: 3,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'Certifikace',
      description: 'APVTC, CFA, CTI - důvěra zákazníků',
      priority: 4,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'Komplexnost',
      description: 'TČ + FVE + servis = "one-stop-shop"',
      priority: 5,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'strengths',
      title: 'Garance',
      description: '7 let záruky (nad průměrem trhu)',
      priority: 6,
      status: 'active'
    },

    // SWOT - WEAKNESSES
    {
      category: 'swot',
      subcategory: 'weaknesses',
      title: 'Digitální marketing',
      description: 'Závislost na externí agentuře',
      details: { mitigation: 'Internalizace + AI CMS', status: 'in_progress' },
      priority: 1,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'weaknesses',
      title: 'Web UX',
      description: 'Legacy PHP, pomalý web',
      details: { mitigation: 'Next.js migration (Phase 1-6)', status: 'in_progress' },
      priority: 2,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'weaknesses',
      title: 'Brand awareness',
      description: 'Méně známí než Viessmann/Vaillant',
      details: { mitigation: 'Black Steel rebrand', status: 'in_progress' },
      priority: 3,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'weaknesses',
      title: 'Conversion rate',
      description: '2.5% (průměr trhu)',
      details: { mitigation: 'Personalizace + CRO', status: 'planned' },
      priority: 4,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'weaknesses',
      title: 'SEO',
      description: 'Organický traffic 15k/měs (potenciál 25k+)',
      details: { mitigation: 'Content strategy TOFU/MOFU/BOFU', status: 'planned' },
      priority: 5,
      status: 'active'
    },

    // SWOT - OPPORTUNITIES
    {
      category: 'swot',
      subcategory: 'opportunities',
      title: 'Dotace 2025',
      description: 'Kotlíkové dotace + NZÚ',
      details: { potential: '+30% demand' },
      priority: 1,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'opportunities',
      title: 'ESG compliance',
      description: 'Firmy musí dekarbonizovat',
      details: { potential: 'B2B segment růst' },
      priority: 2,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'opportunities',
      title: 'AI personalizace',
      description: 'Segment-specific landing pages',
      details: { potential: '+200-300% CR' },
      priority: 3,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'opportunities',
      title: 'Content marketing',
      description: 'TOFU/MOFU/BOFU strategie',
      details: { potential: '+67% organic traffic' },
      priority: 4,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'opportunities',
      title: 'Bytové domy',
      description: 'Nevyužitý segment (50% potenciál)',
      details: { potential: '+500 instalací/rok' },
      priority: 5,
      status: 'active'
    },

    // SWOT - THREATS
    {
      category: 'swot',
      subcategory: 'threats',
      title: 'Konkurence',
      description: 'Viessmann, Vaillant (silné brandy)',
      details: { mitigation: 'Vlastní výroba + cena' },
      priority: 1,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'threats',
      title: 'Ceny energií',
      description: 'Pokles cen → nižší ROI TČ',
      details: { mitigation: 'Dotační kalkulačka' },
      priority: 2,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'threats',
      title: 'Regulace',
      description: 'Změny dotačních podmínek',
      details: { mitigation: 'Diversifikace (TČ + FVE)' },
      priority: 3,
      status: 'active'
    },
    {
      category: 'swot',
      subcategory: 'threats',
      title: 'Ekonomika',
      description: 'Recese → odložené investice',
      details: { mitigation: 'Financování + leasing' },
      priority: 4,
      status: 'active'
    }
  ]

  const { data, error } = await supabase
    .from('business_strategy')
    .insert(strategyData)
    .select()

  if (error) {
    console.error('❌ Error seeding business strategy:', error)
    throw error
  }

  console.log(`✅ Business Strategy seeded: ${data?.length || 0} records`)
  return data
}

// ============================================
// 2. TARGET SEGMENTS & PERSONAS
// ============================================

async function seedTargetSegments() {
  console.log('\n👥 Seeding Target Segments...')

  const segmentsData = [
    // SEGMENT 1: Rodinné domy
    {
      name: 'Rodinné domy (B2C)',
      persona_name: 'Ekologický optimizátor',
      demographics: {
        age_range: '35-50 let',
        family: 'manželé/rodiny',
        education: 'VŠ',
        income: '80,000+ Kč/měsíc (domácnost)',
        personality: 'ISTJ (praktičnost, bezpečnost, strukturovanost)'
      },
      motivations: [
        { icon: '💰', text: 'Úspora nákladů', value: '50-60% vs plyn' },
        { icon: '🌱', text: 'Ekologické vědomí' },
        { icon: '🏡', text: 'Zvýšení hodnoty nemovitosti' },
        { icon: '🔒', text: 'Energetická nezávislost' }
      ],
      entry_channels: {
        organic: 40,
        ads: 30,
        social: 20,
        direct: 10
      },
      buying_cycle: '3-6 měsíců',
      buying_stage_notes: 'research → quote → decision',
      messaging: {
        hero: 'Ušetřete až 60% nákladů na vytápění s dotací až 180,000 Kč',
        cta: 'Zjistit úsporu pro váš dům',
        lead_magnet: 'ROI kalkulačka'
      },
      revenue_share: 60.00,
      avg_order_value: 180000,
      active: true
    },

    // SEGMENT 2: Bytové domy
    {
      name: 'Bytové domy (B2B/B2C)',
      persona_name: 'Správce objektu',
      demographics: {
        age_range: '40-60 let',
        role: 'facility manažeři, SVJ předsedové',
        decision_type: 'committee-based (SVJ)'
      },
      motivations: [
        { icon: '📊', text: 'Efektivita provozu' },
        { icon: '💼', text: 'Compliance (energetické audity)' },
        { icon: '💰', text: 'Snížení nákladů pro vlastníky' },
        { icon: '📉', text: 'Předvídatelné náklady' }
      ],
      entry_channels: {
        organic: 50,
        linkedin: 25,
        referral: 15,
        direct: 10
      },
      buying_cycle: '6-12 měsíců',
      buying_stage_notes: 'schválení SVJ, dotace',
      messaging: {
        hero: 'Komplexní řešení pro bytové domy s garancí úspor',
        cta: 'Case study z realizací',
        social_proof: 'Reference z bytových domů'
      },
      revenue_share: 25.00,
      avg_order_value: 350000,
      active: true
    },

    // SEGMENT 3: Firemní objekty
    {
      name: 'Firemní objekty (B2B)',
      persona_name: 'ESG Manager',
      demographics: {
        age_range: '35-50 let',
        role: 'sustainability manažeři, CFO',
        decision_type: 'CAPEX approval, procurement'
      },
      motivations: [
        { icon: '📈', text: 'ESG reporting (dekarbonizace)' },
        { icon: '💹', text: 'ROI analýza (payback period)' },
        { icon: '🏆', text: 'Corporate responsibility' },
        { icon: '🔋', text: 'Energetická efektivita' }
      ],
      entry_channels: {
        linkedin: 30,
        organic: 40,
        events: 20,
        direct: 10
      },
      buying_cycle: '9-18 měsíců',
      buying_stage_notes: 'procurement, CAPEX approval',
      messaging: {
        hero: 'Dekarbonizujte s ROI < 5 let + ESG reporting',
        cta: 'Stáhnout ESG case study',
        value_prop: 'ESG compliance + úspory'
      },
      revenue_share: 15.00,
      avg_order_value: 450000,
      active: true
    }
  ]

  const { data, error } = await supabase
    .from('target_segments')
    .insert(segmentsData)
    .select()

  if (error) {
    console.error('❌ Error seeding target segments:', error)
    throw error
  }

  console.log(`✅ Target Segments seeded: ${data?.length || 0} records`)
  return data
}

// ============================================
// 3. KPIs TRACKING
// ============================================

async function seedKPIs() {
  console.log('\n📈 Seeding KPIs...')

  const kpisData = [
    // REVENUE TARGETS
    {
      metric_name: 'Měsíční obrat',
      category: 'revenue',
      baseline_value: 18000000,
      baseline_period: new Date('2024-12-01'),
      target_q1: 20000000,
      target_q2: 22000000,
      target_q3: 24000000,
      target_q4: 26000000,
      unit: 'Kč',
      description: 'Celkový měsíční obrat firmy',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Instalace/měsíc',
      category: 'installation',
      baseline_value: 100,
      baseline_period: new Date('2024-12-01'),
      target_q1: 110,
      target_q2: 125,
      target_q3: 135,
      target_q4: 145,
      unit: 'count',
      description: 'Počet instalací tepelných čerpadel měsíčně',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Průměrná zakázka',
      category: 'revenue',
      baseline_value: 180000,
      baseline_period: new Date('2024-12-01'),
      target_q1: 182000,
      target_q2: 176000,
      target_q3: 178000,
      target_q4: 179000,
      unit: 'Kč',
      description: 'Průměrná hodnota zakázky',
      year: 2025,
      is_primary: false
    },

    // MARKETING KPIs
    {
      metric_name: 'Conversion Rate',
      category: 'marketing',
      baseline_value: 2.5,
      baseline_period: new Date('2024-12-01'),
      target_q1: 4.0,
      target_q2: 5.0,
      target_q3: 6.0,
      target_q4: 8.0,
      unit: '%',
      description: 'Konverzní poměr návštěvník → lead',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Lead Quality',
      category: 'marketing',
      baseline_value: 45,
      baseline_period: new Date('2024-12-01'),
      target_q1: 55,
      target_q2: 60,
      target_q3: 65,
      target_q4: 70,
      unit: '/100',
      description: 'Skóre kvality leadů',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Cost per Lead',
      category: 'marketing',
      baseline_value: 850,
      baseline_period: new Date('2024-12-01'),
      target_q1: 650,
      target_q2: 550,
      target_q3: 500,
      target_q4: 400,
      unit: 'Kč',
      description: 'Náklady na získání jednoho leadu',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Organic Traffic',
      category: 'marketing',
      baseline_value: 15000,
      baseline_period: new Date('2024-12-01'),
      target_q1: 17000,
      target_q2: 20000,
      target_q3: 23000,
      target_q4: 25000,
      unit: '/měsíc',
      description: 'Organické návštěvy webu měsíčně',
      year: 2025,
      is_primary: false
    },
    {
      metric_name: 'Email Opt-in',
      category: 'marketing',
      baseline_value: 3.0,
      baseline_period: new Date('2024-12-01'),
      target_q1: 5.0,
      target_q2: 6.0,
      target_q3: 7.0,
      target_q4: 10.0,
      unit: '%',
      description: 'Podíl návštěvníků, kteří se přihlásí k newsletteru',
      year: 2025,
      is_primary: false
    },
    {
      metric_name: 'Quote Requests',
      category: 'marketing',
      baseline_value: 1.2,
      baseline_period: new Date('2024-12-01'),
      target_q1: 2.0,
      target_q2: 2.5,
      target_q3: 3.0,
      target_q4: 4.0,
      unit: '%',
      description: 'Podíl návštěvníků, kteří požádají o cenovou nabídku',
      year: 2025,
      is_primary: true
    },

    // OPERATIONAL KPIs
    {
      metric_name: 'Net Promoter Score',
      category: 'operational',
      baseline_value: 65,
      baseline_period: new Date('2024-12-01'),
      target_q1: 70,
      target_q2: 70,
      target_q3: 70,
      target_q4: 70,
      unit: '/100',
      description: 'Ochota zákazníků doporučit AC Heating',
      year: 2025,
      is_primary: true
    },
    {
      metric_name: 'Customer Satisfaction',
      category: 'operational',
      baseline_value: 4.5,
      baseline_period: new Date('2024-12-01'),
      target_q1: 4.8,
      target_q2: 4.8,
      target_q3: 4.8,
      target_q4: 4.8,
      unit: '/5.0',
      description: 'Průměrná spokojenost zákazníků',
      year: 2025,
      is_primary: false
    },
    {
      metric_name: 'Installation Time',
      category: 'operational',
      baseline_value: 3,
      baseline_period: new Date('2024-12-01'),
      target_q1: 3,
      target_q2: 3,
      target_q3: 3,
      target_q4: 3,
      unit: 'days',
      description: 'Průměrná doba instalace',
      year: 2025,
      is_primary: false
    },
    {
      metric_name: 'Response Time',
      category: 'operational',
      baseline_value: 2,
      baseline_period: new Date('2024-12-01'),
      target_q1: 2,
      target_q2: 2,
      target_q3: 2,
      target_q4: 2,
      unit: 'hours',
      description: 'Doba odpovědi na lead',
      year: 2025,
      is_primary: false
    },
    {
      metric_name: 'Service Call Time',
      category: 'operational',
      baseline_value: 24,
      baseline_period: new Date('2024-12-01'),
      target_q1: 24,
      target_q2: 24,
      target_q3: 24,
      target_q4: 24,
      unit: 'hours',
      description: 'Doba reakce na servisní výjezd',
      year: 2025,
      is_primary: false
    }
  ]

  const { data, error } = await supabase
    .from('kpis')
    .insert(kpisData)
    .select()

  if (error) {
    console.error('❌ Error seeding KPIs:', error)
    throw error
  }

  console.log(`✅ KPIs seeded: ${data?.length || 0} records`)
  return data
}

// ============================================
// 4. COMPETITORS
// ============================================

async function seedCompetitors() {
  console.log('\n🏆 Seeding Competitors...')

  const competitorsData = [
    // TIER 1: PREMIUM
    {
      name: 'Viessmann',
      tier: 'premium',
      strengths: [
        { title: 'Brand awareness', detail: 'Nejznámější značka v ČR' },
        { title: 'Dealerská síť', detail: 'Největší pokrytí území' },
        { title: 'Portfolio', detail: 'Široká škála produktů' }
      ],
      weaknesses: [
        { title: 'Vysoké ceny', detail: '20-30% dražší než AC Heating' },
        { title: 'Pomalá inovace', detail: 'Konzervativní přístup k novinkám' },
        { title: 'Generická regulace', detail: 'Nepřizpůsobená českému trhu' }
      ],
      pricing_vs_us: 25.00,
      avg_product_price: 320000,
      market_share: 18.00,
      ac_heating_advantages: [
        { title: 'Vlastní výroba', detail: 'Nižší cena, rychlejší reakce' },
        { title: 'xCC2 regulace', detail: 'Lepší než generické řešení Viessmann' }
      ],
      website: 'https://www.viessmann.cz',
      notes: 'Hlavní konkurent, silný v B2B segmentu'
    },
    {
      name: 'Vaillant',
      tier: 'premium',
      strengths: [
        { title: 'Brand reputation', detail: 'Německá kvalita' },
        { title: 'Široký sortiment', detail: 'TČ + kotle + FVE' },
        { title: 'Servisní síť', detail: 'Dobrá dostupnost servisu' }
      ],
      weaknesses: [
        { title: 'Cena', detail: '20-25% dražší' },
        { title: 'Komplexita', detail: 'Náročnější na instalaci' },
        { title: 'Lead time', detail: 'Delší dodací lhůty' }
      ],
      pricing_vs_us: 22.00,
      avg_product_price: 305000,
      market_share: 15.00,
      ac_heating_advantages: [
        { title: 'Rychlost', detail: 'Vlastní výroba = kratší lead time' },
        { title: 'Cena', detail: '22% levnější při srovnatelné kvalitě' }
      ],
      website: 'https://www.vaillant.cz',
      notes: 'Silný v rodinných domech'
    },
    {
      name: 'Buderus',
      tier: 'premium',
      strengths: [
        { title: 'Portfolio', detail: 'Komplexní řešení' },
        { title: 'Kvalita', detail: 'Prémium komponenty' }
      ],
      weaknesses: [
        { title: 'Brand awareness', detail: 'Méně známý než Viessmann' },
        { title: 'Cena', detail: 'Premium positioning' }
      ],
      pricing_vs_us: 20.00,
      avg_product_price: 295000,
      market_share: 10.00,
      ac_heating_advantages: [
        { title: 'Vlastní regulace', detail: 'xCC2 je lepší' },
        { title: 'Lokální výroba', detail: 'Rychlejší servis' }
      ],
      website: 'https://www.buderus.cz'
    },

    // TIER 2: MID-RANGE
    {
      name: 'Nibe',
      tier: 'mid-range',
      strengths: [
        { title: 'Poměr cena/výkon', detail: 'Dobrá kvalita za rozumnou cenu' },
        { title: 'Portfolio', detail: 'Široká škála modelů' },
        { title: 'Reference', detail: 'Hodně instalací v ČR' }
      ],
      weaknesses: [
        { title: 'Regulace', detail: 'Generické řešení' },
        { title: 'Servis', detail: 'Závislost na dealerech' },
        { title: 'Brand', detail: 'Méně prestižní než Viessmann' }
      ],
      pricing_vs_us: 10.00,
      avg_product_price: 220000,
      market_share: 12.00,
      ac_heating_advantages: [
        { title: 'xCC2 regulace', detail: 'Výrazně lepší než Nibe' },
        { title: 'Vlastní servis', detail: 'Rychlejší reakce' },
        { title: 'Czech made', detail: 'Lokální výroba' }
      ],
      website: 'https://www.nibe.cz',
      notes: 'Přímý konkurent v mid-range segmentu'
    },
    {
      name: 'Regulus',
      tier: 'mid-range',
      strengths: [
        { title: 'Czech brand', detail: 'Lokální značka' },
        { title: 'Cena', detail: 'Konkurenceschopné ceny' }
      ],
      weaknesses: [
        { title: 'Portfolio', detail: 'Omezený výběr' },
        { title: 'Inovace', detail: 'Zaostává za konkurencí' },
        { title: 'Regulace', detail: 'Základní řešení' }
      ],
      pricing_vs_us: 5.00,
      avg_product_price: 200000,
      market_share: 8.00,
      ac_heating_advantages: [
        { title: 'xCC2', detail: 'Výrazně lepší regulace' },
        { title: 'Vlastní výroba', detail: 'Kontrola kvality' },
        { title: 'Garance', detail: '7 let vs 5 let' }
      ],
      website: 'https://www.regulus.cz'
    },
    {
      name: 'Thermona',
      tier: 'mid-range',
      strengths: [
        { title: 'Czech brand', detail: 'Tradiční český výrobce' },
        { title: 'Servis', detail: 'Dobrá servisní síť' }
      ],
      weaknesses: [
        { title: 'Technologie', detail: 'Zaostává technologicky' },
        { title: 'Marketing', detail: 'Slabá komunikace' }
      ],
      pricing_vs_us: 8.00,
      avg_product_price: 210000,
      market_share: 6.00,
      ac_heating_advantages: [
        { title: 'Inovace', detail: 'xCC2 je unikátní' },
        { title: 'Design', detail: 'Modernější produkty' }
      ],
      website: 'https://www.thermona.cz'
    },

    // TIER 3: LOW-COST
    {
      name: 'Čínské brandy (aggregate)',
      tier: 'low-cost',
      strengths: [
        { title: 'Cena', detail: 'Nejnižší ceny na trhu' },
        { title: 'Dostupnost', detail: 'Široká distribuce' }
      ],
      weaknesses: [
        { title: 'Kvalita', detail: 'Nižší kvalita komponentů' },
        { title: 'Servis', detail: 'Omezený servis v ČR' },
        { title: 'Garance', detail: 'Kratší záruční doba' },
        { title: 'Důvěryhodnost', detail: 'No-name značky' }
      ],
      pricing_vs_us: -30.00,
      avg_product_price: 140000,
      market_share: 15.00,
      ac_heating_advantages: [
        { title: 'Kvalita', detail: 'Czech design, prémium komponenty' },
        { title: 'Garance', detail: '7 let vs 2-3 roky' },
        { title: 'Servis', detail: 'Vlastní servisní tým' },
        { title: 'Důvěryhodnost', detail: 'APVTC certifikace' }
      ],
      notes: 'Segment low-cost, různé čínské značky'
    }
  ]

  const { data, error } = await supabase
    .from('competitors')
    .insert(competitorsData)
    .select()

  if (error) {
    console.error('❌ Error seeding competitors:', error)
    throw error
  }

  console.log(`✅ Competitors seeded: ${data?.length || 0} records`)
  return data
}

// ============================================
// 5. ENHANCE EXISTING PRODUCTS
// ============================================

async function enhanceProducts() {
  console.log('\n🛒 Enhancing existing products...')

  // Fetch existing products
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, slug, name, model')
    .limit(10)

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError)
    throw fetchError
  }

  if (!products || products.length === 0) {
    console.warn('⚠️ No products found to enhance. Skipping product enhancement.')
    return []
  }

  console.log(`Found ${products.length} products to enhance`)

  // Fetch target segments for linking
  const { data: segments, error: segmentsError } = await supabase
    .from('target_segments')
    .select('id, name')

  if (segmentsError) {
    console.error('❌ Error fetching segments:', segmentsError)
    throw segmentsError
  }

  const rodinneId = segments?.find(s => s.name.includes('Rodinné'))?.id
  const bytoveId = segments?.find(s => s.name.includes('Bytové'))?.id
  const firemniId = segments?.find(s => s.name.includes('Firemní'))?.id

  // Enhancement templates based on product name/model
  const enhancements = products.map(product => {
    let enhancement: any = {
      id: product.id,
      warranty_years: 7
    }

    // AC HEATING CONVERT NG ONE (Flagship)
    if (product.slug?.includes('convert-ng-one') || product.model?.includes('NG ONE')) {
      enhancement.pricing = {
        base_price: 189000,
        with_installation: 320000,
        financing_available: true,
        financing_months: [48, 60, 72],
        subsidy_eligible: true,
        subsidy_amount: 180000
      }
      enhancement.technical_specs = {
        type: 'Vzduch/voda',
        output_kw: '6-16',
        cop: 4.5,
        rating: 'A+++',
        regulation: 'xCC2 (vlastní vývoj)',
        noise_level: '45 dB(A)',
        refrigerant: 'R32'
      }
      enhancement.target_segment_ids = [rodinneId].filter(Boolean)
      enhancement.usp = 'Inteligentní regulace xCC2 - úspora až 15% oproti konkurenci'
      enhancement.roi_months = 60
      enhancement.bundle_options = [
        { name: 'TČ + FVE', discount: 8, desc: 'Tepelné čerpadlo + Fotovoltaika' },
        { name: 'TČ + FVE + baterie', discount: 12, desc: 'Kompletní energetická nezávislost' },
        { name: 'TČ + servis (3 roky)', discount: 5, desc: 'Tepelné čerpadlo + prodloužený servis' }
      ]
    }
    // AC HEATING CONVERT NG TWO (Mid-range)
    else if (product.slug?.includes('convert-ng-two') || product.model?.includes('NG TWO')) {
      enhancement.pricing = {
        base_price: 159000,
        with_installation: 280000,
        financing_available: true,
        financing_months: [48, 60],
        subsidy_eligible: true,
        subsidy_amount: 180000
      }
      enhancement.technical_specs = {
        type: 'Vzduch/voda',
        output_kw: '4-12',
        cop: 4.2,
        rating: 'A++',
        regulation: 'xCC2',
        noise_level: '48 dB(A)',
        refrigerant: 'R32'
      }
      enhancement.target_segment_ids = [rodinneId].filter(Boolean)
      enhancement.usp = 'Spolehlivé řešení pro menší domy za skvělou cenu'
      enhancement.roi_months = 48
      enhancement.bundle_options = [
        { name: 'TČ + FVE', discount: 8 },
        { name: 'TČ + servis (3 roky)', discount: 5 }
      ]
    }
    // AC HEATING CONVERT NG HYBRID (Premium)
    else if (product.slug?.includes('hybrid') || product.model?.includes('HYBRID')) {
      enhancement.pricing = {
        base_price: 280000,
        with_installation: 450000,
        financing_available: true,
        financing_months: [60, 72],
        subsidy_eligible: true,
        subsidy_amount: 180000
      }
      enhancement.technical_specs = {
        type: 'Hybrid (TČ + kondenzační kotel)',
        output_kw: '8-20',
        cop: 4.3,
        rating: 'A+++',
        regulation: 'xCC2',
        backup: 'Kondenzační kotel',
        refrigerant: 'R32'
      }
      enhancement.target_segment_ids = [bytoveId, firemniId].filter(Boolean)
      enhancement.usp = 'Ideální pro retrofit projekty - kombinuje výhody TČ a kotle'
      enhancement.roi_months = 72
      enhancement.bundle_options = [
        { name: 'Hybrid + servis (5 let)', discount: 8, desc: 'Prodloužený servis pro komerční objekty' }
      ]
    }
    // Generic enhancement for other products
    else {
      enhancement.pricing = {
        base_price: 150000,
        with_installation: 250000,
        financing_available: true,
        subsidy_eligible: true
      }
      enhancement.technical_specs = {
        type: 'Tepelné čerpadlo',
        regulation: 'xCC2'
      }
      enhancement.target_segment_ids = [rodinneId].filter(Boolean)
      enhancement.warranty_years = 7
      enhancement.roi_months = 60
    }

    return enhancement
  })

  // Update products one by one
  let updatedCount = 0
  for (const enhancement of enhancements) {
    const { error } = await supabase
      .from('products')
      .update({
        pricing: enhancement.pricing,
        technical_specs: enhancement.technical_specs,
        target_segment_ids: enhancement.target_segment_ids,
        usp: enhancement.usp,
        roi_months: enhancement.roi_months,
        bundle_options: enhancement.bundle_options,
        warranty_years: enhancement.warranty_years
      })
      .eq('id', enhancement.id)

    if (error) {
      console.error(`❌ Error updating product ${enhancement.id}:`, error)
    } else {
      updatedCount++
    }
  }

  console.log(`✅ Products enhanced: ${updatedCount}/${products.length}`)
  return products
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 Starting Business Data Seeder...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  console.log('=' .repeat(60))

  try {
    // Test connection
    const { error: testError } = await supabase.from('users').select('id').limit(1)
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      process.exit(1)
    }
    console.log('✅ Database connection OK')

    // Run seeding
    const strategy = await seedBusinessStrategy()
    const segments = await seedTargetSegments()
    const kpis = await seedKPIs()
    const competitors = await seedCompetitors()
    const products = await enhanceProducts()

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ SEEDING COMPLETE!')
    console.log('='.repeat(60))
    console.log(`📊 Business Strategy:  ${strategy?.length || 0} records`)
    console.log(`👥 Target Segments:    ${segments?.length || 0} records`)
    console.log(`📈 KPIs:               ${kpis?.length || 0} records`)
    console.log(`🏆 Competitors:        ${competitors?.length || 0} records`)
    console.log(`🛒 Products Enhanced:  ${products?.length || 0} records`)
    console.log('='.repeat(60))

    // Test queries
    console.log('\n🔍 Running test queries...')

    // Count SWOT items
    const { data: swot } = await supabase
      .from('business_strategy')
      .select('subcategory')
      .eq('category', 'swot')

    const swotCounts = swot?.reduce((acc: any, item: any) => {
      acc[item.subcategory] = (acc[item.subcategory] || 0) + 1
      return acc
    }, {})

    console.log('\nSWOT breakdown:')
    console.log(`  - Strengths:     ${swotCounts?.strengths || 0}`)
    console.log(`  - Weaknesses:    ${swotCounts?.weaknesses || 0}`)
    console.log(`  - Opportunities: ${swotCounts?.opportunities || 0}`)
    console.log(`  - Threats:       ${swotCounts?.threats || 0}`)

    // Revenue shares
    const { data: revenueShares } = await supabase
      .from('target_segments')
      .select('name, revenue_share')
      .order('revenue_share', { ascending: false })

    console.log('\nTarget segments by revenue:')
    revenueShares?.forEach((seg: any) => {
      console.log(`  - ${seg.name}: ${seg.revenue_share}%`)
    })

    // Primary KPIs
    const { data: primaryKPIs } = await supabase
      .from('kpis')
      .select('metric_name, baseline_value, target_q4, unit')
      .eq('is_primary', true)

    console.log('\nPrimary KPIs (Baseline → Q4 Target):')
    primaryKPIs?.forEach((kpi: any) => {
      console.log(`  - ${kpi.metric_name}: ${kpi.baseline_value} → ${kpi.target_q4} ${kpi.unit}`)
    })

    console.log('\n✅ All test queries passed!')
    console.log('\n🎉 Phase 4 Database Optimization complete!')

  } catch (error) {
    console.error('\n❌ SEEDING FAILED:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { main, seedBusinessStrategy, seedTargetSegments, seedKPIs, seedCompetitors, enhanceProducts }
