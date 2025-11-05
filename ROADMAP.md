# 🗺️ AC Heating Vision - Roadmap

## ✅ Hotovo (Fáze 1-2)

### Core Features - COMPLETE
- [x] 8 produktů v databázi (seeded)
- [x] Dynamic product pages s kompletními daty
- [x] Kalkulačka úspor (frontend + backend)
- [x] Lead generation system (3-step wizard)
- [x] Lead submission API + Supabase storage
- [x] Admin dashboard pro správu leadů
- [x] AI chatbot (floating modal)
- [x] Python FastAPI backend
- [x] API proxy routes (CORS-free)
- [x] HTTPS deployment na Hetzner
- [x] PM2 process management

---

## 🎯 Co nás čeká dál

### Fáze 3: Notifikace & Komunikace (Priority: HIGH)

#### 1. Email Notifikace
**Cíl**: Okamžité upozornění na nové leady

**Implementace**:
- [ ] SendGrid / Mailgun / Resend integrace
- [ ] Email templates (HTML):
  - Nový lead → admin notifikace
  - Potvrzení odeslání → zákazník
  - Status update → zákazník
- [ ] Email scheduler (cron)
- [ ] Email logs & tracking

**Benefit**: Rychlá reakce na leady = vyšší konverze

---

#### 2. Real Anthropic AI pro Chatbot
**Cíl**: Inteligentní odpovědi místo mock responses

**Implementace**:
- [ ] Anthropic API key setup
- [ ] Claude 3.5 Sonnet integrace
- [ ] System prompt s product knowledge:
  - 8 produktů (specs, ceny, výhody)
  - Dotace (NZÚ, OPPIK)
  - FAQ databáze
- [ ] Context window management
- [ ] Response streaming (optional)
- [ ] Fallback na mock při API erroru

**Benefit**: Lepší zákaznická zkušenost, 24/7 podpora

---

### Fáze 4: Admin Enhancements (Priority: MEDIUM)

#### 3. Lead Management UI
**Cíl**: Kompletní správa leadů v adminu

**Features**:
- [ ] Lead detail page (`/admin/leads/[id]`)
  - Full lead info
  - Timeline aktivit
  - Notes/comments section
  - Status history
- [ ] Status update dropdown
  - Změna statusu přímo v listu
  - Bulk status update
  - Reason for lost/archived
- [ ] Lead assignment
  - Přiřazení obchodníkovi (user_id)
  - Filter by assigned user
  - Unassigned leads view
- [ ] Search & Filters
  - Hledat: email, telefon, jméno
  - Filtr: status, property_type, urgency
  - Date range picker

**Benefit**: Efektivní práce s leady, lepší organizace

---

#### 4. Lead Export & Reporting
**Cíl**: Data export a analytics

**Features**:
- [ ] Export do CSV/Excel
  - All leads nebo filtered
  - Custom column selection
- [ ] Lead analytics dashboard
  - Conversion funnel visualization
  - Monthly trends (graf)
  - Revenue projection (sum conversion_value)
  - Source attribution (odkud leady chodí)
- [ ] Performance metrics
  - Response time tracking
  - Lead velocity (kolik za den/týden)
  - Win rate by property type

**Benefit**: Data-driven rozhodování

---

### Fáze 5: CRM Integration (Priority: MEDIUM)

#### 5. HubSpot / Pipedrive Integrace
**Cíl**: Sync leadů s existující CRM

**Implementace**:
- [ ] HubSpot API integration
  - Create contact on lead submission
  - Sync status updates
  - Webhook for bidirectional sync
- [ ] Pipedrive (alternativa)
  - Similar workflow
- [ ] Mapping configuration
  - Lead fields → CRM fields
  - Custom properties
- [ ] Error handling & retry logic

**Benefit**: Unified sales workflow

---

### Fáze 6: Performance & SEO (Priority: MEDIUM)

#### 6. Lighthouse Optimization
**Cíl**: Score 95+ na všech metrikách

**Tasks**:
- [ ] Image optimization
  - Next.js Image component všude
  - WebP/AVIF format
  - Responsive images
  - Lazy loading
- [ ] Code splitting
  - Dynamic imports pro heavy components
  - Route-based splitting
- [ ] Bundle size reduction
  - Tree shaking
  - Remove unused deps
  - Analyze bundle (webpack-bundle-analyzer)
- [ ] Performance monitoring
  - Core Web Vitals tracking
  - Real User Monitoring (RUM)

**Benefit**: Lepší UX, vyšší SEO ranking

---

#### 7. SEO Enhancements
**Cíl**: Top pozice v Google pro klíčová slova

**Tasks**:
- [ ] Enhanced metadata
  - Dynamické OG images (pro každý produkt)
  - Twitter cards
  - Breadcrumb schema
- [ ] Sitemap improvements
  - XML sitemap s priority
  - Product sitemap (Google Merchant)
  - Image sitemap
- [ ] Structured data
  - Product schema pro všech 8 produktů
  - FAQ schema
  - LocalBusiness schema
  - Review/Rating schema (až budou recenze)
- [ ] Content optimization
  - Keyword research
  - Meta descriptions optimization
  - Internal linking strategy
- [ ] Technical SEO
  - robots.txt optimization
  - Canonical URLs
  - Hreflang (pokud SK verze)

**Benefit**: Organický traffic, nižší CAC

---

### Fáze 7: Testing & Quality (Priority: MEDIUM)

#### 8. Automated Testing
**Cíl**: Confidence při deploymentu

**Implementace**:
- [ ] E2E testing (Playwright)
  - Critical paths:
    - Homepage → Produkty → Detail → Poptávka
    - Kalkulačka → Submit
    - Chatbot → Conversation
  - Admin flows:
    - Login → Leads list → Detail
- [ ] API testing
  - Jest/Vitest pro API routes
  - Integration tests (Supabase mocking)
- [ ] Component testing
  - React Testing Library
  - Key components (Form, Calculator, Chatbot)
- [ ] Visual regression
  - Percy / Chromatic (optional)

**Benefit**: Prevence bugů, rychlejší iterace

---

#### 9. Error Monitoring & Logging
**Cíl**: Proaktivní bug fixing

**Tools**:
- [ ] Sentry / Rollbar setup
  - Frontend error tracking
  - Backend error tracking
  - Source maps
  - Release tracking
- [ ] Structured logging
  - Winston / Pino pro Python backend
  - Log aggregation (Logtail / Papertrail)
  - Log levels (error, warn, info, debug)
- [ ] Performance monitoring
  - API response times
  - Database query performance
  - Third-party API monitoring (Anthropic, SendGrid)
- [ ] Uptime monitoring
  - UptimeRobot / Pingdom
  - Status page (optional)

**Benefit**: Rychlá reakce na incidenty

---

### Fáze 8: Advanced Features (Priority: LOW)

#### 10. A/B Testing Platform
**Cíl**: Data-driven optimalizace konverzí

**Implementace**:
- [ ] Vercel Edge Middleware pro A/B testing
- [ ] Variant management:
  - CTA button colors
  - Form layouts (1-step vs 3-step)
  - Product page layouts
  - Pricing displays
- [ ] Analytics integration
  - Segment / Amplitude
  - Custom events tracking
  - Conversion funnels
- [ ] Winner determination
  - Statistical significance calculator

**Benefit**: Continuous conversion optimization

---

#### 11. Content Management System
**Cíl**: Editace obsahu bez code changes

**Features**:
- [ ] Sanity CMS integration (nebo vlastní)
  - Blog posts
  - Product descriptions
  - Homepage sections
- [ ] AI content generation
  - GPT-4 pro blog drafts
  - Product description generator
  - SEO meta descriptions
- [ ] Media library
  - Image upload & optimization
  - Video hosting
- [ ] Preview mode
  - Draft preview
  - Scheduled publishing

**Benefit**: Marketing autonomie

---

#### 12. Customer Portal
**Cíl**: Self-service pro zákazníky

**Features**:
- [ ] Login/Registration
  - Email + password auth
  - Social login (Google)
- [ ] Dashboard
  - Project status tracking
  - Document uploads
  - Invoice access
- [ ] Communication
  - Messages s obchodníkem
  - Notifications
- [ ] Service requests
  - Maintenance scheduling
  - Support tickets

**Benefit**: Lepší zákaznická zkušenost, nižší support load

---

## 📅 Doporučený Timeline

### Týden 1-2 (Immediate)
1. ✅ Email notifikace (HIGH)
   - SendGrid setup
   - Templates
   - Testing

2. ✅ Real AI chatbot (HIGH)
   - Anthropic integration
   - Product knowledge base
   - Testing

### Týden 3-4 (Short-term)
3. Lead Management UI (MEDIUM)
   - Detail page
   - Status updates
   - Filters

4. Performance optimization (MEDIUM)
   - Images
   - Bundle size
   - Lighthouse audit

### Měsíc 2 (Mid-term)
5. CRM Integration (MEDIUM)
6. SEO Enhancements (MEDIUM)
7. Automated Testing (MEDIUM)

### Měsíc 3+ (Long-term)
8. Error Monitoring (LOW)
9. A/B Testing (LOW)
10. CMS Platform (LOW)
11. Customer Portal (LOW)

---

## 🎯 Prioritizace

### Must Have (Launch Blockers)
- ✅ All Core Features (DONE)
- **Email Notifikace** ← START HERE
- **Real AI Chatbot** ← START HERE

### Should Have (1st Month)
- Lead Management UI
- Performance optimization
- Basic SEO

### Nice to Have (Later)
- CRM integration
- A/B testing
- CMS platform
- Customer portal

---

## 💡 Doporučení: Další Krok

### Immediate Action: Email Notifications

**Proč začít s tímto:**
1. **Business impact**: Okamžité upozornění na leady = rychlejší reakce = vyšší close rate
2. **Snadná implementace**: ~2-4 hodiny práce
3. **Viditelný benefit**: Ihned použitelné v produkci

**Implementace**:
```typescript
// 1. SendGrid setup
npm install @sendgrid/mail

// 2. Email template
// - Admin notification: "Nový lead od {firstName} {lastName}"
// - Customer confirmation: "Děkujeme za poptávku"

// 3. Update /api/leads route
await sendEmail({
  to: 'info@ac-heating.cz',
  subject: 'Nový lead',
  html: renderTemplate(lead)
});

// 4. Test & Deploy
```

**Estimated time**: 3-4 hours  
**ROI**: Immediate

---

## 🤔 Alternative: Real AI Chatbot

**Proč toto:**
1. **UX improvement**: Lepší zákaznická zkušenost
2. **24/7 support**: Odpovědi i mimo pracovní dobu
3. **Lead qualification**: AI může pre-qualify leady

**Implementace**:
```python
# Update backend/main.py
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# System prompt s product knowledge
system_prompt = """
Jsi AI asistent pro AC Heating...
Produkty: [8 produktů s cenami]
Dotace: NZÚ až 180k, OPPIK až 50%
"""

# Stream responses
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    system=system_prompt,
    messages=conversation_history
)
```

**Estimated time**: 4-6 hours  
**ROI**: High (better conversions)

---

## ✅ Recommendation

**START WITH**: 
1. **Email Notifications** (Quick win, immediate business value)
2. **Real AI Chatbot** (Better UX, competitive advantage)

Oba můžeme implementovat paralelně nebo postupně podle preferencí.

**Co preferuješ začít?**

---

**Status**: Ready for Phase 3  
**Current**: All core features complete ✅  
**Next**: Email + AI enhancements
