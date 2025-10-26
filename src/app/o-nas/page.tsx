import { Metadata } from 'next';
import { Award, Users, Target, Heart, Bus, Lightbulb, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompanyYears } from '@/lib/utils';
import { BlackSteelPageLayout } from '@/components/layout/BlackSteelPageLayout';
import { SymbolSection } from '@/components/about/SymbolSection';

export const metadata: Metadata = {
  title: 'O nás - AC Heating',
  description: 'KUFI INT s.r.o. (AC Heating) – česká firma s více než 18letou tradicí v oblasti instalace tepelných čerpadel a fotovoltaiky. Více než 7500 domácností po celé Evropě.',
};

export default function AboutPage() {
  const yearsInBusiness = getCompanyYears();

  return (
    <BlackSteelPageLayout
      title="Naše příběh"
      subtitle={`Česká firma s více než ${yearsInBusiness}letou tradicí v instalaci tepelných čerpadel a fotovoltaiky. Pomáháme rodinám i firmám po celé Evropě šetřit energie a chránit životní prostředí.`}
    >
      {/* Story Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none text-steel space-y-6"
          >
            <p className="text-lg leading-relaxed mb-6 text-steel">
              Vše začalo v roce 2006, když Michal Fiala hledal řešení vytápění pro chatu svého
              otce. Po neúspěšné zkušenosti s dodavatelem, který odmítl projekt kvůli malé
              zakázce, se Michal rozhodl vytvořit tepelné čerpadlo sám. Společně se svým
              spolužákem Lubomírem Kuchynkou založili firmu KUFI INT s.r.o.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-steel">
              První tepelné čerpadlo nainstalovali v roce 2006 - a fungovalo tak dobře, že
              otec dodnes využívá stejný systém. Tato první zakázka položila základy naší
              filozofie: žádná zakázka není příliš malá, každý zákazník si zaslouží stejnou
              péči a kvalitu.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-steel">
              Dnes jsme expandovali po celé Evropě s více než 100 zaměstnanci. Každoročně
              instalujeme přes 1 500 tepelných čerpadel a celkem již více než 7 500 domácností
              využívá naše systémy. V roce 2022 jsme rozšířili portfolio o fotovoltaiku a
              solární systémy.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-steel">
              Naším symbolem je historický autobus RTO 706 s lodí - připomíná nám cestu
              za svobodou, nezávislostí a odvahu jít vlastní cestou. Stejně jako naši
              zakladatelé tehdy, i dnes hledáme inovativní řešení a nejsme spokojeni
              s průměrem.
            </p>
          </motion.div>
        </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <ValueCard
              icon={<Lightbulb className="w-12 h-12" />}
              title="Svoboda a nezávislost"
              description="Hledáme vlastní cesty a inovativní řešení. Nejsme spokojeni s průměrem."
            />
            <ValueCard
              icon={<Users className="w-12 h-12" />}
              title="Péče o zákazníka"
              description="Žádná zakázka není příliš malá. Každý zákazník si zaslouží stejnou kvalitu."
            />
            <ValueCard
              icon={<Target className="w-12 h-12" />}
              title="Inovace"
              description="Od roku 2006 neustále vylepšujeme naše technologie a rozšiřujeme portfolio."
            />
            <ValueCard
              icon={<Shield className="w-12 h-12" />}
              title="Certifikace"
              description="Držíme certifikace APVTC, CFA a CTI pro nejvyšší standardy kvality."
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Čísla o nás
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number={`${yearsInBusiness}+`} label="Let na trhu" />
            <StatCard number="7 500+" label="Domácností" />
            <StatCard number="1 500+" label="Instalací ročně" />
            <StatCard number="100+" label="Zaměstnanců" />
          </div>
        </motion.div>
      </section>

      {/* Symbol Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SymbolSection />
      </motion.div>

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
            Chcete vědět více?
          </h2>
          <p className="text-xl text-steel-dim mb-8 max-w-2xl mx-auto">
            Rádi vám poradíme s výběrem správného řešení pro váš domov nebo firmu.
          </p>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all"
          >
            Kontaktujte nás
          </a>
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-2xl border border-graphite-light/50"
    >
      <div className="text-4xl md:text-5xl font-black text-accent mb-2">
        {number}
      </div>
      <div className="text-sm font-semibold text-steel-dim uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
