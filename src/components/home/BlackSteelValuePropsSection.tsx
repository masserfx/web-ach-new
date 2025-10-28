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
    <section className="relative w-full bg-carbon py-20 px-6 md:px-12 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Proč si zákazníci vybrali právě nás
          </h2>
        </motion.div>

        {/* Cards Grid - Black boxes like mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {valuePropCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Black Card Background like mockup */}
              <div className="relative bg-graphite rounded-2xl p-8 hover:bg-graphite-light transition-all duration-300">
                {/* Icon with Orange Accent */}
                <div className="flex items-center justify-start mb-6">
                  <div className="text-[#F36F21]">
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* CTA Link with Orange Color */}
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 text-[#F36F21] font-bold hover:gap-3 transition-all duration-300 group/link text-sm"
                >
                  <span>{card.cta}</span>
                  <span className="text-lg group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
