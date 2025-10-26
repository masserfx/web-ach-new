import { Metadata } from 'next';
import { Award, Users, Target, Shield, Briefcase, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompanyYears } from '@/lib/utils';
import Link from 'next/link';
import { BlackSteelPageLayout } from '@/components/layout/BlackSteelPageLayout';

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
    <BlackSteelPageLayout
      title="O společnosti"
      subtitle="KUFI INT s.r.o. je česká firma zaměřená na moderní energetická řešení. Pomáháme domácnostem a firmám po celé Evropě šetřit energii a chránit životní prostředí."
    >
      {/* Company Overview */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-steel">
                Kdo jsme?
              </h2>
              <p className="text-lg text-steel mb-4">
                Jsme skupina profesionálů s více než {yearsInBusiness}letou zkušeností v oboru tepelných čerpadel
                a fotovoltaiky. Naše cesta začala v roce 2006, kdy jsme postavili první
                tepelné čerpadlo vlastníma rukama.
              </p>
              <p className="text-lg text-steel mb-4">
                Dnes jsme rozrostlí na tým přes 100 zaměstnanců a instalujeme více než
                1 500 systémů ročně. Více než 7 500 domácností po celé Evropě věří naším
                řešením.
              </p>
              <p className="text-lg text-steel">
                Naším posláním je poskytnout čistou, efektivní a bezpečnou energii všem,
                kdo si ji přejí.
              </p>
            </div>
            <div className="bg-gradient-to-br from-graphite to-graphite-light rounded-3xl p-12 text-center border border-graphite-light/50">
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-black text-accent mb-2">
                    {yearsInBusiness}+
                  </div>
                  <div className="text-steel-dim font-semibold">Let na trhu</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-accent mb-2">
                    7 500+
                  </div>
                  <div className="text-steel-dim font-semibold">Spokojených domácností</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-accent mb-2">
                    100+
                  </div>
                  <div className="text-steel-dim font-semibold">Zaměstnanců</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Naše hodnoty
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard
              icon={<Target className="w-12 h-12" />}
              title="Inovace"
              description="Nepřestáváme zdokonalovat naše technologie. Od roku 2006 patříme k průkopníkům v oboru."
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Tým"
              description="Naší silou je zkušený a oddaný tým profesionálů. Pracujeme společně pro vaše pohodlí."
            />
            <ValueCard
              icon={<Shield className="w-12 h-12" />}
              title="Kvalita"
              description="Držíme certifikace APVTC, CFA a CTI. Kvalita je pro nás priorita číslo jedna."
            />
            <ValueCard
              icon={<Globe className="w-12 h-12" />}
              title="Ekologie"
              description="Chráníme životní prostředí prostřednictvím čistých energií. Budoucnost závisí na nás všech."
            />
            <ValueCard
              icon={<Briefcase className="w-12 h-12" />}
              title="Profesionalismus"
              description="V každém projektu si odsloužíme profesionalismus. Podrobné poradenství a bezpečná instalace."
            />
            <ValueCard
              icon={<Award className="w-12 h-12" />}
              title="Spolehlivost"
              description="Na nás můžete spoléhat. Jsme tu pro vás v dlouhodobém horizontu s podporou a servisem."
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
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
        </motion.div>
      </section>

      {/* Certification Section */}
      <section className="py-20 rounded-2xl border border-graphite-light/50 bg-graphite/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-steel">
            Certifikace a standardy
          </h2>
          <p className="text-lg text-steel-dim mb-8">
            Naše práce splňuje nejvyšší standardy kvality a bezpečnosti. Jsme akreditovány
            pro práci s tepelnými čerpadly a solárními systémy.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <CertItem label="APVTC" description="Asociace podnikatelů v tepelné technice" />
            <CertItem label="CFA" description="Česká asociace fotovoltaických firem" />
            <CertItem label="CTI" description="Česká technická inspekce" />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-accent to-accent-dark py-20 rounded-2xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-steel mb-6">
            Chcete se na nás obrátit?
          </h2>
          <p className="text-xl text-steel-dim mb-8 max-w-2xl mx-auto">
            Jsme tu pro vás. Nezávazně si objednejte konzultaci a dozvíte se, jak vám
            můžeme pomoci šetřit energii a chránit životní prostředí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all"
            >
              Nezávazná poptávka
            </Link>
            <Link
              href="/kontakt"
              className="px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all border-2 border-white"
            >
              Kontaktujte nás
            </Link>
          </div>
        </motion.div>
      </section>
    </BlackSteelPageLayout>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative p-6 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all group"
    >
      <div className="inline-flex p-3 rounded-xl bg-accent text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-steel">{title}</h3>
      <p className="text-steel-dim leading-relaxed">{description}</p>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-8 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all"
    >
      <h3 className="text-xl font-bold mb-3 text-steel">{title}</h3>
      <p className="text-steel-dim leading-relaxed">{description}</p>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="p-6 bg-graphite rounded-xl border border-graphite-light/50"
    >
      <div className="text-2xl font-black text-accent mb-2">{label}</div>
      <div className="text-sm text-steel-dim">{description}</div>
    </motion.div>
  );
}
