import { Metadata } from 'next';
import { Award, Users, Target, Shield, Briefcase, Globe } from 'lucide-react';
import { getCompanyYears } from '@/lib/utils';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'O společnosti - AC Heating',
  description: 'KUFI INT s.r.o. (AC Heating) – česká firma s více než 18letou tradicí. Instalace tepelných čerpadel, fotovoltaiky a energetických řešení.',
  openGraph: {
    title: 'O společnosti - AC Heating',
    description: 'Poznáte si firmu stojící za moderními energetickými řešeními. Více než 18 let zkušeností, 7500+ domácností, 100+ zaměstnanců.',
    type: 'website',
  },
};

export default function AboutCompanyPage() {
  const yearsInBusiness = getCompanyYears();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                O společnosti
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              KUFI INT s.r.o. je česká firma zaměřená na moderní energetická řešení. Pomáháme
              domácnostem a firmám po celé Evropě šetřit energii a chránit životní prostředí.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Kdo jsme?
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Jsme skupina profesionálů s více než {yearsInBusiness}letou zkušeností v oboru tepelných čerpadel
                a fotovoltaiky. Naše cesta začala v roce 2006, kdy jsme postavili první
                tepelné čerpadlo vlastníma rukama.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Dnes jsme rozrostlí na tým přes 100 zaměstnanců a instalujeme více než
                1 500 systémů ročně. Více než 7 500 domácností po celé Evropě věří naším
                řešením.
              </p>
              <p className="text-lg text-gray-700">
                Naším posláním je poskytnout čistou, efektivní a bezpečnou energii všem,
                kdo si ji přejí.
              </p>
            </div>
            <div className="bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-3xl p-12 text-center">
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-black text-brand-primary mb-2">
                    {yearsInBusiness}+
                  </div>
                  <div className="text-gray-700 font-semibold">Let na trhu</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-brand-secondary mb-2">
                    7 500+
                  </div>
                  <div className="text-gray-700 font-semibold">Spokojených domácností</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-brand-primary mb-2">
                    100+
                  </div>
                  <div className="text-gray-700 font-semibold">Zaměstnanců</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Naše hodnoty
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon={<Target className="w-12 h-12" />}
              title="Inovace"
              description="Nepřestáváme zdokonalovat naše technologie. Od roku 2006 patříme k průkopníkům v oboru."
              gradient="from-brand-accent to-orange-600"
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Tým"
              description="Naší silou je zkušený a oddaný tým profesionálů. Pracujeme společně pro vaše pohodlí."
              gradient="from-brand-primary to-amber-700"
            />
            <ValueCard
              icon={<Shield className="w-12 h-12" />}
              title="Kvalita"
              description="Držíme certifikace APVTC, CFA a CTI. Kvalita je pro nás priorita číslo jedna."
              gradient="from-brand-secondary to-green-600"
            />
            <ValueCard
              icon={<Globe className="w-12 h-12" />}
              title="Ekologie"
              description="Chráníme životní prostředí prostřednictvím čistých energií. Budoucnost závisí na nás všech."
              gradient="from-purple-600 to-pink-600"
            />
            <ValueCard
              icon={<Briefcase className="w-12 h-12" />}
              title="Profesionalismus"
              description="V každém projektu si odsloužíme profesionalismus. Podrobné poradenství a bezpečná instalace."
              gradient="from-blue-600 to-cyan-600"
            />
            <ValueCard
              icon={<Award className="w-12 h-12" />}
              title="Spolehlivost"
              description="Na nás můžete spoléhat. Jsme tu pro vás v dlouhodobém horizontu s podporou a servisem."
              gradient="from-rose-600 to-red-600"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Co nabízíme
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ServiceItem
              title="Tepelná čerpadla"
              description="Instalace, servis a údržba tepelných čerpadel všech typů. Individuální poradenství a dotace."
            />
            <ServiceItem
              title="Fotovoltaika"
              description="Solární panely a kompletní fotovoltaické systémy. Maximální úspora energie."
            />
            <ServiceItem
              title="Regulace xCC"
              description="Inteligentní řízení energií. Automatická optimalizace a dálkový dohled."
            />
            <ServiceItem
              title="Poradenství"
              description="Bezplatné posouzení vašeho domu. Návrh řešení a informace o dostupných dotacích."
            />
            <ServiceItem
              title="Servis"
              description="Pravidelný servis a údržba. Dispečink hlídá váš systém 24/7."
            />
            <ServiceItem
              title="Financování"
              description="Pomoc s financováním a dotacemi. Flexibilní podmínky a nízké úroky."
            />
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Certifikace a standardy
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Naše práce splňuje nejvyšší standardy kvality a bezpečnosti. Jsme akreditovány
              pro práci s tepelnými čerpadly a solárními systémy.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <CertItem label="APVTC" description="Asociace podnikatelů v tepelné technice" />
              <CertItem label="CFA" description="Česká asociace fotovoltaických firem" />
              <CertItem label="CTI" description="Česká technická inspekce" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete se na nás obrátit?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Jsme tu pro vás. Nezávazně si objednejte konzultaci a dozvíte se, jak vám
            můžeme pomoci šetřit energii a chránit životní prostředí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Nezávazná poptávka
            </Link>
            <Link
              href="/kontakt"
              className="px-10 py-5 bg-brand-primary/20 text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white/20 transition-all"
            >
              Kontaktujte nás
            </Link>
          </div>
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

function ServiceItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-brand-primary/50 transition-all">
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CertItem({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
      <div className="text-2xl font-black text-brand-primary mb-2">{label}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
}
