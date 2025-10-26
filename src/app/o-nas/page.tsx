import { Metadata } from 'next';
import { Award, Users, Target, Heart, Bus, Lightbulb, Shield } from 'lucide-react';
import { getCompanyYears } from '@/lib/utils';
import { SymbolSection } from '@/components/about/SymbolSection';

export const metadata: Metadata = {
  title: 'O nás',
  description: 'KUFI INT s.r.o. (AC Heating) – česká firma s více než 18letou tradicí v oblasti instalace tepelných čerpadel a fotovoltaiky. Více než 7500 domácností po celé Evropě.',
};

export default function AboutPage() {
  const yearsInBusiness = getCompanyYears();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                O nás
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Jsme česká firma s více než {yearsInBusiness}letou tradicí v oblasti instalace tepelných čerpadel a fotovoltaiky.
              Pomáháme rodinám i firmám po celé Evropě šetřit energie a chránit životní prostředí.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Náš příběh
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Vše začalo v roce 2006, když Michal Fiala hledal řešení vytápění pro chatu svého
              otce. Po neúspěšné zkušenosti s dodavatelem, který odmítl projekt kvůli malé
              zakázce, se Michal rozhodl vytvořit tepelné čerpadlo sám. Společně se svým
              spolužákem Lubomírem Kuchynkou založili firmu KUFI INT s.r.o.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              První tepelné čerpadlo nainstalovali v roce 2006 - a fungovalo tak dobře, že
              otec dodnes využívá stejný systém. Tato první zakázka položila základy naší
              filozofie: žádná zakázka není příliš malá, každý zákazník si zaslouží stejnou
              péči a kvalitu.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Dnes jsme expandovali po celé Evropě s více než 100 zaměstnanci. Každoročně
              instalujeme přes 1 500 tepelných čerpadel a celkem již více než 7 500 domácností
              využívá naše systémy. V roce 2022 jsme rozšířili portfolio o fotovoltaiku a
              solární systémy.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Naším symbolem je historický autobus RTO 706 s lodí - připomíná nám cestu
              za svobodou, nezávislostí a odvahu jít vlastní cestou. Stejně jako naši
              zakladatelé tehdy, i dnes hledáme inovativní řešení a nejsme spokojeni
              s průměrem.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Naše hodnoty
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <ValueCard
              icon={<Lightbulb className="w-12 h-12" />}
              title="Svoboda a nezávislost"
              description="Hledáme vlastní cesty a inovativní řešení. Nejsme spokojeni s průměrem."
              gradient="from-brand-accent to-orange-600"
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Péče o zákazníka"
              description="Žádná zakázka není příliš malá. Každý zákazník si zaslouží stejnou kvalitu."
              gradient="from-brand-primary to-amber-700"
            />
            <ValueCard
              icon={<Target className="w-12 h-12" />}
              title="Inovace"
              description="Od roku 2006 neustále vylepšujeme naše technologie a rozšiřujeme portfolio."
              gradient="from-brand-secondary to-green-600"
            />
            <ValueCard
              icon={<Shield className="w-12 h-12" />}
              title="Certifikace"
              description="Držíme certifikace APVTC, CFA a CTI pro nejvyšší standardy kvality."
              gradient="from-purple-600 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Čísla o nás
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number={`${yearsInBusiness}+`} label="Let na trhu" />
            <StatCard number="7 500+" label="Domácností" />
            <StatCard number="1 500+" label="Instalací ročně" />
            <StatCard number="100+" label="Zaměstnanců" />
          </div>
        </div>
      </section>

      {/* Symbol Section */}
      <SymbolSection />

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete vědět více?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rádi vám poradíme s výběrem správného řešení pro váš domov nebo firmu.
          </p>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
          >
            Kontaktujte nás
          </a>
        </div>
      </section>
    </main>
  );
}

function ValueCard({
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
    <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 group">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
      <div className="text-4xl md:text-5xl font-black text-brand-primary mb-2">
        {number}
      </div>
      <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
