'use client';

import { motion } from 'framer-motion';
import { Wrench, Cog, Heart } from 'lucide-react';
import Link from 'next/link';

interface ValuePropCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
}

const valuePropCards: ValuePropCard[] = [
  {
    icon: <Wrench className="w-12 h-12" />,
    title: 'Vlastní vývoj a výroba',
    description: 'Tepelné čerpadlo Convert NG One je 100% český produkt s precizním zpracováním z nerezové oceli. Vyrábíme s důrazem na kvalitu a dlouhodobou spolehlivost.',
    cta: 'Zjistit více',
    href: '/o-spolecnosti',
  },
  {
    icon: <Cog className="w-12 h-12" />,
    title: 'Komplexní řešení na klíč',
    description: 'Od návrhu po instalaci – včetně FVE, regulace xCC, servisu a dotačního poradenství. Jsme vaši partneři v každém kroku implementace.',
    cta: 'Naše služby',
    href: '/produkty',
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: '7 let garance a servis',
    description: 'Naše péče nekončí montáží. Sledování 24/7 a rychlá reakce zajišťují dlouhou životnost vašeho systému a maximální úspory.',
    cta: 'Servisní záruka',
    href: '/kontakt',
  },
];

export function BlackSteelValuePropsSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-black via-graphite to-black py-20 px-6 md:px-12 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30 -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Proč si zákazníci vybírají právě nás
          </h2>
          <p className="text-lg text-steel max-w-2xl mx-auto">
            Kombinace inovace, kvalité a osobního přístupu, která nás odlišuje od konkurence.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {valuePropCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative h-full"
            >
              {/* Glass Card Background */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl group-hover:border-accent/30 transition-all duration-300" />

              {/* Gradient Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

              {/* Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/40 to-accent/0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between space-y-6">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 group-hover:from-accent/50 group-hover:to-accent/20 transition-all duration-300">
                  <div className="text-accent group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-white group-hover:text-accent transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-steel text-base leading-relaxed flex-grow">
                  {card.description}
                </p>

                {/* CTA Link */}
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all duration-300 group/link"
                >
                  <span>{card.cta}</span>
                  <span className="text-xl group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-steel mb-6 text-lg">
            Chcete se dozvědět více o našem přístupu?
          </p>
          <Link
            href="/o-spolecnosti"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
          >
            <span>Více o AC Heating</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
