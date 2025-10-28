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
    city: 'Specialista na tepelná čerpadla',
    rating: 5,
    quote: '15 let zkušeností v oboru. Specializuji se na návrh a instalaci ekologických řešení pro domácnosti.',
    initials: 'KB',
  },
  {
    id: 2,
    name: 'Zdeněk Zoubek',
    city: 'Technický ředitel',
    rating: 5,
    quote: 'Vedoucí vývojového týmu Convert NG. Dbám na kvalitu a inovace v každém detailu.',
    initials: 'ZZ',
  },
  {
    id: 3,
    name: 'Michal Rada',
    city: 'Servisní technik',
    rating: 5,
    quote: 'Poskytujeme 24/7 podporu a rychlou reakci. Vaše spokojenost je naší prioritou.',
    initials: 'MR',
  },
];

export function BlackSteelSocialProofSection() {
  return (
    <section className="relative w-full bg-carbon py-20 px-6 md:px-12 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Skuteční lidé. Skutečné úspory.
          </h2>
        </motion.div>

        {/* Team Grid - Like mockup */}
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
              {/* Black Card Background like mockup */}
              <div className="relative bg-graphite rounded-2xl p-8 text-center">
                {/* Avatar - Large circular photo placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F36F21] to-[#FF8F3C] flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">{testimonial.initials}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-white font-bold text-lg mb-2">{testimonial.name}</h3>

                {/* Rating Stars */}
                <div className="flex gap-1 justify-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-[#F36F21] text-xl">⭐</span>
                  ))}
                </div>

                {/* Position/Title */}
                <p className="text-white/70 text-sm mb-4">{testimonial.city}</p>

                {/* Quote */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
