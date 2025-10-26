'use client';

import { CheckCircle, Zap, Cloud, Shield, Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/site.config';

export default function RegulatePage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carbon via-graphite to-carbon py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-steel mb-6 leading-tight">
              Regulace xCC
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim leading-relaxed mb-8">
              Inteligentní řízení tepelného čerpadla. Vyvíjíme ji od roku 2009 na základě analýzy
              tisíců instalovaných systémů. Je intuitivní, efektivní a zcela automatizovaná.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pripravit-rozpocet"
                className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Nezávazná poptávka
              </a>
              <a
                href="#features"
                className="px-8 py-4 bg-graphite text-accent border-2 border-accent rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
              >
                Více o funkcích
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Klíčové vlastnosti
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Chytré řízení energie"
              description="Regulace xCC optimalizuje propojení vyrobené energie z FVE s potřebou spotřebičů. Automaticky spravuje energii za nejlepší podmínky."
              gradient="from-accent to-accent-dark"
            />
            <FeatureCard
              icon={<Activity className="w-12 h-12" />}
              title="Automatická diagnostika"
              description="Kontinuální monitoring vašeho tepelného čerpadla. Systém automaticky detekuje problémy dřív, než se stanovy kritickými."
              gradient="from-accent to-accent-dark"
            />
            <FeatureCard
              icon={<Cloud className="w-12 h-12" />}
              title="Dálková správa (AC Connectivity)"
              description="Bezpečné připojení k internetu s dálkovým dohledem. Dispečink hlídá váš systém 24/7. Data uložena na vlastních serverech."
              gradient="from-accent to-accent-dark"
            />
            <FeatureCard
              icon={<Eye className="w-12 h-12" />}
              title="Aplikace na mobil"
              description="Ovládejte svůj systém kdykoliv a odkudkoliv. Intuitivní rozhraní zobrazuje spotřebu, teploty a poskytuje doporučení."
              gradient="from-accent to-accent-dark"
            />
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="bg-graphite/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
              Chytré funkce
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {smartFeatures.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-accent mt-1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-steel">
                      {feature.title}
                    </h3>
                    <p className="text-steel-dim">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Variants/Plans */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-steel">
            Varianty regulace xCC
          </h2>
          <p className="text-center text-steel-dim mb-12 max-w-2xl mx-auto">
            Vyberte si variantu, která odpovídá vašim potřebám. Kdykoliv si můžete přiobjednat další funkce.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-graphite-light/50">
                  <th className="text-left py-4 px-4 font-bold text-steel">
                    Funkce
                  </th>
                  {variants.map((variant) => (
                    <th
                      key={variant.name}
                      className={`text-center py-4 px-4 font-bold ${
                        variant.highlight
                          ? 'bg-accent/10 text-accent'
                          : 'text-steel'
                      }`}
                    >
                      {variant.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureList.map((feature, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-graphite-light/50 hover:bg-graphite/30"
                  >
                    <td className="py-4 px-4 text-steel font-medium">
                      {feature.name}
                    </td>
                    {variants.map((variant) => (
                      <td
                        key={variant.name}
                        className={`text-center py-4 px-4 ${
                          variant.highlight ? 'bg-accent/5' : ''
                        }`}
                      >
                        {(feature as unknown as Record<string, boolean>)[variant.key] === true ? (
                          <CheckCircle className="w-6 h-6 text-accent mx-auto" />
                        ) : (
                          <span className="text-steel-dim/30">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="bg-gradient-to-br from-accent/5 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-steel">
              Propojení se chytrým domem
            </h2>
            <p className="text-lg text-steel-dim mb-8">
              Regulace xCC se bezproblémově integruje se systémem chytrého domu
              <strong> Loxone</strong>. Říďte teplotu, osvětlení, rolety,
              zabezpečení i zavlažování z jednoho místa.
            </p>
            <a
              href="/regulace/loxone"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
            >
              Více o integraci Loxone
            </a>
          </div>
        </div>
      </section>

      {/* FVE Integration */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-steel">
            Ideální kombinace: Tepelné čerpadlo + Fotovoltaika
          </h2>
          <div className="bg-graphite rounded-2xl shadow-lg border border-graphite-light/50 p-8 md:p-12">
            <p className="text-lg text-steel-dim mb-6">
              Regulace xCC zvyšuje efektivitu kombinace tepelného čerpadla s fotovoltaikou.
              Systém automaticky reaguje na:
            </p>
            <ul className="space-y-4">
              {fveFeatures.map((feature, idx) => (
                <li key={idx} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <span className="text-steel-dim">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-graphite-light/50">
              <a
                href="/kombinace-tc-fve"
                className="text-accent font-bold hover:text-accent/80 transition-colors"
              >
                Více o kombinaci TČ + FVE →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-accent to-accent-dark py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete si regulaci vyzkoušet?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Pošleme vám demonstrační přístup. Podívejte se, jak funguje intuitivní
            aplikace na mobil a webové rozhraní.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Nezávazná poptávka
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all border-2 border-accent"
            >
              Zavolat: {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="relative p-8 bg-graphite rounded-2xl shadow-lg hover:shadow-xl transition-all border border-graphite-light/50 group">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-steel">{title}</h3>
      <p className="text-steel-dim leading-relaxed">{description}</p>
    </div>
  );
}

const smartFeatures = [
  {
    title: 'Reaktivní na předpověď počasí',
    description:
      'Systém zná budoucnost. Regulace se automaticky připravuje na změny teploty a počasí.',
  },
  {
    title: 'Optimalizace spotřeby energie',
    description:
      'Využívá nejlevnější elektřinu. Hlídá spotové ceny a automaticky nakupuje za nejlepších podmínek.',
  },
  {
    title: 'Propojení s fotovoltaikou',
    description:
      'Maximálně využije energii z vašich solárních panelů. Inteligentní přepínání zdrojů.',
  },
  {
    title: 'Bezpečnost na prvním místě',
    description:
      'Data uložena na vlastních serverech. Certifikované zabezpečení, šifrování, pravidelné audity.',
  },
  {
    title: 'Ovládání v aplikaci',
    description:
      'Jednoduché rozhraní na mobilu. Nastavte teplotu, podívejte se na spotřebu, přijímejte doporučení.',
  },
  {
    title: 'Dálková správa bez starostí',
    description:
      'Dispečink hlídá váš systém. Když něco není v pořádku, víme to dřív než vy.',
  },
];

const variants = [
  { name: 'Pro', key: 'pro', highlight: false },
  { name: 'Family', key: 'family', highlight: false },
  { name: 'Comfort', key: 'comfort', highlight: true },
  { name: 'Executive', key: 'executive', highlight: false },
];

const featureList = [
  {
    name: 'Ekvitermně řízený přímý topný okruh',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Řízení bivalentního zdroje',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Útlumové programy',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Automatická diagnostika',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Dálková správa',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'PREDICTherma - reakce na předpověď',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Řízení ohřevu užitkové vody',
    pro: true,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'Propojení s Loxone',
    pro: false,
    family: true,
    comfort: true,
    executive: true,
  },
  {
    name: 'AC Connectivity',
    pro: false,
    family: false,
    comfort: true,
    executive: true,
  },
];

const fveFeatures = [
  'Předpověď počasí - zná, kdy budou panely nejproduktivnější',
  'Spotové ceny - nakupuje energii v nejlevnějších chvílích',
  'Vlastní serverů - bezpečné uchovávání dat bez třetích stran',
  'Automatická správa - nemusíte nic řešit, systém rozhoduje sám',
  'Integraci s chytrým domem - Loxone propojuje vše dohromady',
];
