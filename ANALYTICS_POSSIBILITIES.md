# 🚀 Analytics Agent - Všechny Možnosti Využití

**Status**: ✅ Plně funkční self-hosted AI agent  
**Model**: Claude 3.5 Haiku  
**Access**: https://91.99.126.53:3102/admin/analytics

---

## 📊 **CO AGENT UMÍ (Technicky)**

### **1. SQL Queries na Supabase**
- ✅ Přístup k celé databázi (products, leads, analytics_events, blog_posts)
- ✅ Agregace, JOIN, GROUP BY, subqueries
- ✅ Časové řady (den, týden, měsíc, rok)
- ✅ Konverze do Pandas DataFrames

### **2. Python Data Analysis**
- ✅ Pandas (zpracování dat)
- ✅ NumPy (matematika, statistika)
- ✅ Calculations (průměry, mediány, percentily)
- ✅ Data transformace

### **3. Vizualizace**
- ✅ Bar charts (sloupcové grafy)
- ✅ Line charts (časové řady)
- ✅ Pie charts (podíly)
- ✅ Matplotlib + Seaborn styling
- ✅ Uložení do PNG (analytics/outputs/charts/)

### **4. AI Insights**
- ✅ Pattern recognition (najde trendy)
- ✅ Anomaly detection (neobvyklé hodnoty)
- ✅ Recommendations (actionable doporučení)
- ✅ Czech language responses

---

## 💡 **PRAKTICKÉ PŘÍPADY POUŽITÍ**

### **KATEGORIE 1: LEAD INTELLIGENCE** 🎯

#### **1.1 Lead Quality Analysis**
```
"Analyzuj kvalitu leadů za posledních 30 dní:
- Kolik leadů celkem?
- Jak rychle odpovídáme?
- Které leady mají nejvyšší potenciál?
- Vytvoř scoring model (0-100 bodů)"
```

**Co agent udělá:**
- SQL: Stáhne všechny leady za 30 dní
- Python: Spočítá průměrný response time
- AI: Vyhodnotí kvalitu podle property_size, budget, urgency
- Output: Lead scoring s doporučeními

#### **1.2 Conversion Funnel**
```
"Analyzuj conversion funnel:
1. Kolik lidí navštíví web?
2. Kolik použije kalkulačku?
3. Kolik otevře chatbot?
4. Kolik vyplní lead form?
5. Kde nejvíc odpadají?"
```

**Výstup:**
- Funnel visualization
- Drop-off rates
- Bottleneck identifikace
- Doporučení na zlepšení

#### **1.3 Source Attribution**
```
"Odkud přicházejí nejlepší leady?
- Google Ads vs Facebook vs Organic
- Které UTM kampaně konvertují nejlépe?
- ROI jednotlivých zdrojů"
```

---

### **KATEGORIE 2: PRODUCT INTELLIGENCE** 🏠

#### **2.1 Product Performance**
```
"Které produkty jsou nejpopulárnější?
- Top 5 podle page views
- Top 5 podle CTA kliků
- Top 5 podle lead mentions
- Které produkty generují nejvíc leadů?"
```

#### **2.2 Product Bundling**
```
"Analyzuj které produkty lidé kombinují:
- TČ + FVE = kolik %?
- TČ + rekuperace = kolik %?
- Doporuč produktové balíčky"
```

#### **2.3 Pricing Intelligence**
```
"Analyzuj rozpočty leadů:
- Jaké jsou typické rozpočty pro TČ?
- Jaké pro FVE?
- Kde je sweet spot pro naše nabídky?"
```

---

### **KATEGORIE 3: CUSTOMER BEHAVIOR** 👥

#### **3.1 User Journey Analysis**
```
"Jak vypadá typická cesta zákazníka?
1. První stránka (landing)
2. Kolik stránek navštíví?
3. Jak dlouho zůstane na webu?
4. Co si přečte před kontaktem?"
```

#### **3.2 Calculator Insights**
```
"Analyzuj použití kalkulačky:
- Kolik lidí ji spustí?
- Kolik jich dokončí výpočet?
- Jaké jsou typické hodnoty (spotřeba, plocha)?
- Které výsledky vedou k lead form?"
```

#### **3.3 Chatbot Analytics**
```
"Jak lidé používají chatbot?
- Nejčastější otázky
- Průměrná délka konverzace
- Kolik zpráv před konverzí?
- Satisfaction rate"
```

---

### **KATEGORIE 4: CONTENT OPTIMIZATION** ✍️

#### **4.1 Blog Performance**
```
"Které články na blogu fungují nejlép?
- Top 5 podle views
- Top 5 podle času čtení
- Které články vedou k leadům?
- Doporuč témata nových článků"
```

#### **4.2 SEO Analysis**
```
"Analyzuj SEO performance:
- Které stránky mají nejvíc organic traffic?
- Které keywords přivádějí leady?
- Kde jsou příležitosti na zlepšení?"
```

#### **4.3 Form Optimization**
```
"Analyzuj lead form:
- Na kterém poli lidé odpadají?
- Které pole trvá nejdéle vyplnit?
- Jaká je abandonment rate?
- Doporuč zjednodušení"
```

---

### **KATEGORIE 5: BUSINESS INTELLIGENCE** 💼

#### **5.1 Monthly Reports**
```
"Vytvoř měsíční business report:
- Celkové metriky (leady, traffic, conversion)
- MoM growth (měsíc ku měsíci)
- Top performing channels
- Revenue projections
- Action items pro příští měsíc"
```

#### **5.2 Competitive Intelligence** (budoucí)
```
"Porovnej naši performance:
- Benchmark proti industry průměru
- Naše conversion rate vs konkurence
- Kde jsme nejsilnější?"
```

#### **5.3 ROI Analysis**
```
"Spočítej ROI marketing kampaní:
- Cost per lead (CPL) podle zdroje
- Cost per acquisition (CPA)
- Lifetime value (LTV) estimate
- ROI jednotlivých kanálů"
```

---

### **KATEGORIE 6: PREDICTIVE ANALYTICS** 🔮

#### **6.1 Lead Scoring**
```
"Vytvoř prediktivní lead scoring:
- Které faktory predikují uzavření?
- Skóruj leady 0-100 bodů
- Prioritizuj high-value leady"
```

**Faktory:**
- Property type (RD = vyšší score)
- Property size (větší = vyšší score)
- Budget range (vyšší = vyšší score)
- Urgency (immediate = vyšší score)
- Message length (delší = vyšší zájem)
- Source (organic = vyšší score než reklama)

#### **6.2 Churn Prediction**
```
"Predikuj které leady jsou cold:
- Které leady neodpovídají?
- Které jsou stuck v jednání?
- Doporuč re-engagement strategie"
```

#### **6.3 Revenue Forecasting**
```
"Predikcí revenue na Q1 2026:
- Založeno na historických datech
- Current pipeline
- Conversion rates
- Seasonal trends"
```

---

### **KATEGORIE 7: OPERATIONAL INTELLIGENCE** ⚙️

#### **7.1 Response Time Analysis**
```
"Jak rychle odpovídáme na leady?
- Průměrný response time
- Nejrychlejší vs nejpomalejší
- Impact na conversion rate
- Doporuč SLA (service level agreement)"
```

#### **7.2 Team Performance**
```
"Analyzuj performance týmu:
- Kdo zpracoval nejvíc leadů?
- Kdo má nejvyšší win rate?
- Kdo potřebuje podporu?"
```

#### **7.3 Process Optimization**
```
"Kde můžeme ušetřit čas?
- Které kroky trvají nejdéle?
- Kde jsou bottlenecks?
- Automatization opportunities"
```

---

## 🎯 **KONKRÉTNÍ QUERY PŘÍKLADY**

### **Lead Analysis**
```
"Kolik leadů jsme dostali tento měsíc a jaká je konverze?"

"Které leady mají budget nad 500k a urgency 'immediate'?"

"Zobraz mi top 10 leadů podle kvality za Q4 2025"

"Která města generují nejvíc leadů?"
```

### **Product Analysis**
```
"Které 3 produkty mají nejvyšší CTR (click-through rate)?"

"Kolik % leadů se ptá na fotovoltaiku vs tepelná čerpadla?"

"Analyzuj demand pro retrofit vs nové instalace"

"Vytvoř product popularity timeline (leden-listopad 2025)"
```

### **Marketing Analysis**
```
"Jaký je náš conversion rate z Google Ads?"

"Které UTM kampaně mají nejnižší cost per lead?"

"Porovnej Facebook vs Google traffic quality"

"Analyzuj seasonal trends - kdy je nejvíc zájmu o TČ?"
```

### **Content Analysis**
```
"Které blog články vedou k nejvíc konverzím?"

"Jaký je průměrný čas čtení našich článků?"

"Top 5 exit pages (kde lidé opouštějí web)"

"Které FAQ otázky jsou nejčastější v chatbotu?"
```

### **Business Intelligence**
```
"Spočítej průměrný deal size za posledních 6 měsíců"

"Jaká je win rate pro rodinné domy vs firmy?"

"Analyzuj sales cycle length (čas od leadu po uzavření)"

"Vytvoř revenue forecast na Q1 2026"
```

---

## 🔬 **POKROČILÉ ANALÝZY**

### **1. Cohort Analysis**
```
"Analyzuj cohorts podle měsíce registrace:
- Retention rate
- Lifetime value
- Konverze v čase"
```

### **2. A/B Testing Analysis**
```
"Porovnej dvě verze lead formu:
- Verze A (dlouhý) vs Verze B (krátký)
- Conversion rate difference
- Statistical significance"
```

### **3. Multi-Touch Attribution**
```
"Analyzuj customer journey s více touchpoints:
- První kontakt (Google)
- Blog článek
- Calculator
- Chatbot
- Lead form
Který touchpoint měl největší impact?"
```

### **4. RFM Analysis**
```
"Segmentuj leady podle RFM:
- Recency (jak nedávno)
- Frequency (jak často interagují)
- Monetary (jaký budget)
Vytvoř segmenty: Champions, Loyal, At Risk, Lost"
```

### **5. Sentiment Analysis** (budoucí)
```
"Analyzuj sentiment zpráv v lead forms:
- Pozitivní vs negativní tón
- Urgency level z textu
- Pain points identifikace"
```

---

## 🤖 **AUTOMATIZOVANÉ REPORTY**

### **Daily Report (každé ráno 8:00)**
```yaml
Includes:
- Nové leady (včera)
- Top performing products
- Traffic overview
- Conversion rate
- Alerts (anomalies)
- Action items (top 3 priorities)
```

### **Weekly Report (každé pondělí)**
```yaml
Includes:
- Week-over-week growth
- Sales pipeline status
- Marketing channel performance
- Content performance
- Team activity
```

### **Monthly Report (1. v měsíci)**
```yaml
Includes:
- Month-over-month comparison
- Revenue analysis
- Product trends
- Customer acquisition cost
- ROI breakdown
- Strategic recommendations
```

---

## 📈 **BUSINESS VALUE**

### **Co Agent Přináší:**

1. **🎯 Data-Driven Decisions**
   - Rozhodování založené na datech, ne na "feelingu"
   - Identifikace skutečných patterns
   - Eliminace biasu

2. **⚡ Speed**
   - Analýza za 5-30 sekund (vs hodiny manuálně)
   - Real-time insights
   - Instant reports

3. **💰 Cost Savings**
   - Žádný data analyst ($4000-8000/měsíc)
   - Žádné BI tools ($500-2000/měsíc)
   - Self-hosted = $50/měsíc
   - **Savings: $4500-10000/měsíc**

4. **🔍 Deep Insights**
   - AI najde patterns které human nevidí
   - Cross-correlation analysis
   - Predictive capabilities

5. **📊 Actionable Recommendations**
   - Nejen "co se stalo"
   - Ale "co s tím udělat"
   - Prioritized action items

---

## 🚀 **NEXT STEPS - Co Můžeme Přidat**

### **Phase 1 (Tento Týden)**
```
✅ Přidat SUPABASE_SERVICE_ROLE_KEY
✅ Otestovat real-data queries
✅ Setup daily report cron (8 AM)
✅ Create lead_scoring.py query
```

### **Phase 2 (Příští Týden)**
```
⏳ Email delivery pro reports
⏳ Create funnel_analysis.py
⏳ Create product_performance.py
⏳ Add more pre-built queries
```

### **Phase 3 (Příští Měsíc)**
```
⏳ Real-time dashboard (live metrics)
⏳ Alert system (anomaly detection)
⏳ Predictive models (ML)
⏳ Custom metrics tracking
```

---

## 💡 **TIP: Jak Začít**

### **1. Jednoduché Dotazy (Warm Up)**
```
"Kolik leadů máme celkem?"
"Které 3 produkty jsou nejpopulárnější?"
"Jaká je konverze z calculator na lead?"
```

### **2. Střední Obtížnost**
```
"Analyzuj lead quality za říjen 2025"
"Porovnej traffic zdroje podle conversion rate"
"Vytvoř product performance report"
```

### **3. Pokročilé**
```
"Vytvoř prediktivní lead scoring model"
"Analyzuj multi-touch attribution customer journey"
"Predikcí revenue na Q1 2026 s confidence intervals"
```

---

## 📚 **DOKUMENTACE**

- **Admin UI**: https://91.99.126.53:3102/admin/analytics
- **API Docs**: /api/analytics-agent/analyze
- **Code**: ~/ac-heating-web-vision/analytics/
- **Charts**: ~/ac-heating-web-vision/analytics/outputs/charts/
- **Reports**: ~/ac-heating-web-vision/analytics/outputs/reports/

---

## 🎓 **LEARNING RESOURCES**

Agent může také:
- Vysvětlit SQL queries (pro learning)
- Ukázat Python code (pro transparentnost)
- Naučit tě data analysis
- Dokumentovat svoje analýzy

---

**Status**: ✅ **READY TO USE**  
**Model**: Claude 3.5 Haiku  
**Cost**: ~$0.25 per 1M tokens input, ~$1.25 per 1M tokens output  
**Typical Query Cost**: $0.01-0.05  

🔥 **Self-hosted, powerful, cost-effective!**
