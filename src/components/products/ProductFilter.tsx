'use client';

import { motion } from 'framer-motion';
import { Home, Building, Building2 } from 'lucide-react';
import Link from 'next/link';

export function ProductFilter() {
  const filters = [
    {
      icon: Home,
      title: 'Malý dům',
      area: 'obytná plocha 90 - 120 m²',
      power: 'nebo tepelná ztráta 5 - 8 kW',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Building,
      title: 'Běžný dům',
      area: 'obytná plocha 100 - 200 m²',
      power: 'nebo tepelná ztráta 8 - 15 kW',
      color: 'from-accent to-accent-dark',
    },
    {
      icon: Building2,
      title: 'Velký dům',
      area: 'obytná plocha 180 - 400 m²',
      power: 'nebo tepelná ztráta 15 - 30 kW',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="mb-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8 text-steel text-center"
      >
        Filtr produktů
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {filters.map((filter, index) => {
          const Icon = filter.icon;
          return (
            <motion.div
              key={filter.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-graphite to-graphite-light border border-graphite-light/50 hover:border-accent/50 transition-all cursor-pointer p-8"
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${filter.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10">
                <Icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-steel mb-3">
                  {filter.title}
                </h3>
                <p className="text-steel-dim text-sm mb-1">{filter.area}</p>
                <p className="text-steel-dim text-sm">{filter.power}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          href="/pruvodce-vyberem"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-dark transition-colors font-semibold"
        >
          Chcete pomoci vybrat od profíků? Přejděte na Průvodce výběrem →
        </Link>
      </motion.div>
    </div>
  );
}
