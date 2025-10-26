import { Metadata } from 'next';
import { CheckCircle, Zap, Cloud, Shield, Eye, Activity } from 'lucide-react';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: 'Regulace xCC - Inteligentní řízení tepelného čerpadla',
  description: 'Regulace xCC od AC Heating. Chytré řízení energií, automatická diagnostika, dálková správa. Reaktivní na předpověď počasí. Více informací tady.',
  openGraph: {
    title: 'Regulace xCC - Inteligentní řízení',
    description: 'Chytré řízení energií v domě. Optimalizace spotřeby, automatická správa, bezpečné připojení.',
    type: 'website',
  },
};

export default function RegulatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Regulace xCC
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Inteligentní řízení tepelného čerpadla. Vyvíjíme ji od roku 2009 na základě analýzy
              tisíců instalovaných systémů. Je intuitivní, efektivní a zcela automatizovaná.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pripravit-rozpocet"
                className="px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Nezávazná poptávka
              </a>
              <a
                href="#features"
                className="px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary rounded-xl font-bold hover:bg-brand-primary/5 transition-all"
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
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Klíčové vlastnosti
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12" />}
              title="Chytré řízení energie"
              description="Regulace xCC optimalizuje propojení vyrobené energie z FVE s potřebou spotřebičů. Automaticky spravuje energii za nejlepší podmínky."
              gradient="from-brand-accent to-orange-600"
            />
            <FeatureCard
              icon={<Activity className="w-12 h-12" />}
              title="Automatická diagnostika"
              description="Kontinuální monitoring vašeho tepelného čerpadla. Systém automaticky detekuje problémy dřív, než se stanovy kritickými."
              gradient="from-brand-primary to-amber-700"
            />
            <FeatureCard
              icon={<Cloud className="w-12 h-12" />}
              title="Dálková správa (AC Connectivity)"
              description="Bezpečné připojení k internetu s dálkovým dohledem. Dispečink hlídá váš systém 24/7. Data uložena na vlastních serverech."
              gradient="from-brand-secondary to-green-600"
            />
            <FeatureCard
              icon={<Eye className="w-12 h-12" />}
              title="Aplikace na mobil"
              description="Ovládejte svůj systém kdykoliv a odkudkoliv. Intuitivní rozhraní zobrazuje spotřebu, teploty a poskytuje doporučení."
              gradient="from-purple-600 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Chytré funkce
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {smartFeatures.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-brand-secondaryDark mt-1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700">{feature.description}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Varianty regulace xCC
          </h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Vyberte si variantu, která odpovídá vašim potřebám. Kdykoliv si můžete přiobjednat další funkce.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">
                    Funkce
                  </th>
                  {variants.map((variant) => (
                    <th
                      key={variant.name}
                      className={`text-center py-4 px-4 font-bold ${
                        variant.highlight
                          ? 'bg-brand-secondary/10 text-brand-primary'
                          : 'text-gray-900'
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
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-900 font-medium">
                      {feature.name}
                    </td>
                    {variants.map((variant) => (
                      <td
                        key={variant.name}
                        className={`text-center py-4 px-4 ${
                          variant.highlight ? 'bg-brand-secondary/5' : ''
                        }`}
                      >
                        {(feature as unknown as Record<string, boolean>)[variant.key] === true ? (
                          <CheckCircle className="w-6 h-6 text-brand-secondaryDark mx-auto" />
                        ) : (
                          <span className="text-gray-300">−</span>
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
      <section className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Propojení se chytrým domem
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Regulace xCC se bezproblémově integruje se systémem chytrého domu
              <strong> Loxone</strong>. Říďte teplotu, osvětlení, rolety,
              zabezpečení i zavlažování z jednoho místa.
            </p>
            <a
              href="/regulace/loxone"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-secondary text-white rounded-xl font-bold hover:bg-brand-secondary/90 transition-all"
            >
              Více o integraci Loxone
            </a>
          </div>
        </div>
      </section>

      {/* FVE Integration */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Ideální kombinace: Tepelné čerpadlo + Fotovoltaika
          </h2>
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 md:p-12">
            <p className="text-lg text-gray-700 mb-6">
              Regulace xCC zvyšuje efektivitu kombinace tepelného čerpadla s fotovoltaikou.
              Systém automaticky reaguje na:
            </p>
            <ul className="space-y-4">
              {fveFeatures.map((feature, idx) => (
                <li key={idx} className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-brand-secondaryDark flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <a
                href="/kombinace-tc-fve"
                className="text-brand-primary font-bold hover:text-brand-primary/80 transition-colors"
              >
                Více o kombinaci TČ + FVE →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
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
              className="px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Nezávazná poptávka
            </a>
            <a
              href={`tel:${siteConfig.contact.phoneRaw}`}
              className="px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all border-2 border-brand-primary"
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
    <div className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 group">
      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
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
