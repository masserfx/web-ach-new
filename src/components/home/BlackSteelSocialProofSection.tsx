'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  city: string;
  rating: number;
  quote: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Klára Bodláková',
    city: 'Praha',
    rating: 5,
    quote: 'Díky AC Heating jsme snížili náklady na vytápění o více než 50 %. Profesionální instalace a výborný servis.',
    initials: 'KB',
  },
  {
    id: 2,
    name: 'Zdeněk Zoubek',
    city: 'Plzeň',
    rating: 5,
    quote: 'Opravdoví profíci. Výborná komunikace, rychlá instalace, férové jednání. Všem bych doporučil.',
    initials: 'ZZ',
  },
  {
    id: 3,
    name: 'Michal Rada',
    city: 'Ostrava',
    rating: 5,
    quote: 'Nejlepší zkušenost z rekonstrukce domu. Skvělý poměr výkon/cena. Velmi spokojený.',
    initials: 'MR',
  },
];

export function BlackSteelSocialProofSection() {
  return (
    <section className="relative w-full bg-carbon py-20 px-6 md:px-12 overflow-hidden">
      {/* Background Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40 -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Skuteční lidé. Skutečné úspory.
          </h2>
          <p className="text-lg text-steel max-w-2xl mx-auto">
            Tisíce spokojených zákazníků po celé České republice
          </p>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16"
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-accent mb-2">5 234+</p>
            <p className="text-steel text-sm">Instalací po Česku</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-accent mb-2">4.9/5</p>
            <p className="text-steel text-sm">Průměrné hodnocení</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-black text-accent mb-2">15+</p>
            <p className="text-steel text-sm">Nabídek dnes</p>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl group-hover:border-accent/30 transition-all duration-300" />

              {/* Hover Glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-accent/30 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{testimonial.name}</h3>
                    <p className="text-steel text-sm">{testimonial.city}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-accent text-lg">⭐</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/80 italic leading-relaxed text-base">
                  "{testimonial.quote}"
                </p>
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
          className="text-center"
        >
          <Link
            href="/o-spolecnosti"
            className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all duration-300 text-lg group"
          >
            <span>Podívej se na všechny reference</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
