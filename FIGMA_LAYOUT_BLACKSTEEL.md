# 🎨 AC HEATING – FIGMA LAYOUT: HOMEPAGE (BLACK STEEL EDITION)
**Verze:** 1.0 **Datum:** 26.10.2025
**Design System:** Black Steel (AC Heating Rebrand 2025)

---

## 🖥️ STRUKTURA STRÁNKY (FRAME 1920×1080)

### 🧭 1️⃣ HERO SECTION — "Convert NG One"

**Rozložení:**
- Frame: `1920 × 880 px`
- Background: `linear-gradient(135deg, #0D0D0D, #2B2B2B 40%, #F36F21 100%)`
- Layer: Glass Reflection overlay (`opacity 0.15`, blur 40px)
- Product render: 3D model Convert NG One (nerez + černé sklo, perspektivní nasvícení zleva)
- Button cluster: CTA vpravo dole hero

**Textové bloky:**
```
H1: Tepelné čerpadlo bez kompromisů.
Subheadline: Convert NG One – výkon, design, ticho.
CTA Primary: [Zjisti, kolik ušetríš] (orange glow)
CTA Secondary: [Porovnat varianty] (outline)
Meta info: "Vyrobeno v Česku • Záruka 7 let • Dotace až 180 000 Kč"
```

**UI akcenty:**
- Hover efekty: skleněný efekt, světelný „heat shimmer" při pohybu myši
- Mikrointerakce: animovaný odraz po skle (`opacity 0.15 → 0.3`)

---

### 🧱 2️⃣ VALUE PROPOSITION SECTION — "Proč AC Heating"

**Rozložení:**
- Frame: `1920 × 720 px`
- Background: `#111111`
- Grid: 3 columns (640 px each), gap 40 px
- Heading: „Proč si zákazníci vybírají právě nás"

**Karty (3 columns):**

| Ikona | Titulek | Text | CTA |
|-------|----------|------|-----|
| 🧰 | **Vlastní vývoj a výroba** | Tepelné čerpadlo Convert NG One je 100% český produkt s precizním zpracováním z nerezové oceli. | [Zjistit více] |
| ⚙️ | **Komplexní řešení na klíč** | Od návrhu po instalaci – včetně FVE, regulace, servisu a dotačního poradenství. | [Naše služby] |
| 🧡 | **7 let garance a servis** | Naše péče nekončí montáží. Sledování 24/7 a rychlá reakce zajišťují dlouhou životnost systému. | [Servisní záruka] |

**Styl:**
- Cards: `background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;`
- Ikony: monotone gradient `#F36F21 → #FF8F3C`
- Hover: oranžový glow `0 0 20px rgba(243,111,33,0.4)`

---

### 💬 3️⃣ SOCIAL PROOF SECTION — "Naši spokojení zákazníci"

**Rozložení:**
- Frame: `1920 × 900 px`
- Background: `#0D0D0D`
- Heading: „Skuteční lidé. Skutečné úspory."
- Carousel (auto-slide): 3 testimonály v řadě

**Obsah karet:**

| Foto | Jméno | Hodnocení | Citace | Město |
|------|--------|------------|---------|--------|
| 👩‍🦰 | Klára Bodláková | ⭐⭐⭐⭐⭐ | „Díky AC Heating jsme snížili náklady o více než 50 %. Profesionální instalace a výborný servis." | Praha |
| 👨‍🔧 | Zdeněk Zoubek | ⭐⭐⭐⭐⭐ | „Opravdoví profíci. Výborná komunikace, rychlá instalace, férové jednání." | Plzeň |
| 👨‍💼 | Michal Rada | ⭐⭐⭐⭐⭐ | „Nejlepší zkušenost z rekonstrukce domu. Skvělý poměr výkon/cena." | Ostrava |

**Dynamické prvky:**
- Live counter: „5 234 instalací • 4.9/5 hodnocení • 15 nabídek dnes"
- Animation: fade-in při scrollu (`opacity 0 → 1`, `translateY 20px`)
- CTA pod karuselem: `[Podívej se na všechny reference →]`

---

### 🧭 4️⃣ CTA FOOTER — "Připravíme nabídku do 24 hodin"

**Rozložení:**
- Frame: `1920 × 400 px`
- Background: gradient `linear-gradient(90deg,#F36F21,#FF8F3C)`
- Text center:

```
H2: Jste připraveni ušetřit na vytápění?
CTA: [Nezávazná kalkulace zdarma] (white button → hover orange glow)
Kontakt: ☎ +420 725 539 825 • 📧 info@ac-heating.cz
```

**Styl:**
- Text: bílý na oranžovém přechodu
- CTA: skleněný button `background: rgba(255,255,255,0.15)` + border white

---

## 📐 Figma layers (naming)

```
📁 AC_Heating_BlackSteel_Homepage
├── 🟥 Hero_Section
│     ├── Background_Gradient
│     ├── Product_Render
│     ├── Headline_Group
│     ├── CTA_Primary
│     └── Meta_Info
├── 🟧 Value_Propositions
│     ├── Heading
│     ├── Cards_Group (3)
│     └── CTA_LearnMore
├── 🟦 Social_Proof
│     ├── Testimonials_Carousel
│     ├── Live_Counter
│     └── CTA_References
└── 🟩 CTA_Footer
      ├── Text_Block
      └── Button_Calc
```

---

## 🎯 TAILWIND CSS KOMPONENTY (PŘÍMO Z FIGMA)

### Hero Section Component
```tsx
<section className="relative w-full h-screen bg-gradient-to-br from-carbon via-graphite to-accent overflow-hidden">
  {/* Glass Reflection Overlay */}
  <div className="absolute inset-0 bg-white/15 backdrop-blur-[40px] opacity-0 hover:opacity-100 transition-opacity duration-300" />

  {/* Content */}
  <div className="relative z-10 h-full flex flex-col justify-between items-center text-center px-8 py-16">
    <h1 className="text-7xl font-black text-white max-w-4xl">
      Tepelné čerpadlo bez kompromisů.
    </h1>
    <p className="text-2xl text-white/90 mt-4">
      Convert NG One – výkon, design, ticho.
    </p>

    {/* CTA Buttons */}
    <div className="flex gap-6 mt-12">
      <button className="px-10 py-5 bg-accent text-white font-bold rounded-lg shadow-glow hover:shadow-[0_0_30px_rgba(243,111,33,0.6)] transition-all">
        Zjisti, kolik ušetříš
      </button>
      <button className="px-10 py-5 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all">
        Porovnat varianty
      </button>
    </div>

    {/* Meta Info */}
    <p className="text-sm text-steel mt-12">
      Vyrobeno v Česku • Záruka 7 let • Dotace až 180 000 Kč
    </p>
  </div>
</section>
```

### Value Props Cards
```tsx
<section className="w-full bg-gray-900 py-20 px-8">
  <h2 className="text-4xl font-black text-white text-center mb-16">
    Proč si zákazníci vybírají právě nás
  </h2>

  <div className="grid grid-cols-3 gap-10 max-w-6xl mx-auto">
    {[
      { icon: '🧰', title: 'Vlastní vývoj a výroba', desc: 'Tepelné čerpadlo Convert NG One je 100% český produkt...' },
      { icon: '⚙️', title: 'Komplexní řešení na klíč', desc: 'Od návrhu po instalaci – včetně FVE, regulace, servisu...' },
      { icon: '🧡', title: '7 let garance a servis', desc: 'Naše péče nekončí montáží. Sledování 24/7...' }
    ].map((card) => (
      <div key={card.title} className="group p-8 bg-white/5 border border-white/10 rounded-3xl hover:shadow-glow transition-all">
        <div className="text-5xl mb-4">{card.icon}</div>
        <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
        <p className="text-steel text-sm leading-relaxed">{card.desc}</p>
      </div>
    ))}
  </div>
</section>
```

### Social Proof Carousel
```tsx
<section className="w-full bg-carbon py-20 px-8">
  <h2 className="text-4xl font-black text-white text-center mb-16">
    Skuteční lidé. Skutečné úspory.
  </h2>

  {/* Live Counter */}
  <div className="text-center mb-12 text-steel">
    <span className="text-accent font-bold">5 234 instalací</span> •
    <span className="text-accent font-bold"> 4.9/5 hodnocení</span> •
    <span className="text-accent font-bold"> 15 nabídek dnes</span>
  </div>

  {/* Carousel - 3 visible items */}
  <div className="flex gap-6 max-w-6xl mx-auto overflow-x-auto">
    {testimonials.map((t) => (
      <div key={t.id} className="flex-shrink-0 w-80 p-6 bg-graphite rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <img src={t.photo} className="w-12 h-12 rounded-full" />
          <div>
            <h4 className="text-white font-bold">{t.name}</h4>
            <p className="text-steel text-sm">{t.city}</p>
          </div>
        </div>
        <div className="text-accent mb-3">{'⭐'.repeat(5)}</div>
        <p className="text-white/80 text-sm italic">"{t.quote}"</p>
      </div>
    ))}
  </div>
</section>
```

### CTA Footer
```tsx
<section className="w-full bg-gradient-to-r from-accent to-[#FF8F3C] py-20 px-8 text-center">
  <h2 className="text-4xl font-black text-white mb-6">
    Jste připraveni ušetřit na vytápění?
  </h2>

  <button className="px-12 py-5 bg-white/15 border-2 border-white text-white font-bold rounded-lg hover:bg-white/25 shadow-lg transition-all backdrop-blur-sm">
    Nezávazná kalkulace zdarma
  </button>

  <div className="mt-12 text-white/90 space-y-2">
    <p>☎ +420 725 539 825</p>
    <p>📧 info@ac-heating.cz</p>
  </div>
</section>
```

---

## 🧠 DOPORUČENÍ PRO FIGMA PROTOTYP
- Použít **Smart Animate** pro přechod hover stavů (tlačítka, carousel).
- Přidat **scroll interactions**: hero → blur glass overlay → reveal value props.
- Použít **Component Variants**: CTA (light/dark), Card (hover/base), Testimonial (3 varianty).
- Export design tokens (Tailwind variables) pro přímé využití v kódu.

---

**AC HEATING © 2025 – Figma Layout Specification v1.0**
