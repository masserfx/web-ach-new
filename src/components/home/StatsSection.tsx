'use client';

import { motion } from 'framer-motion';

interface StatsSectionProps {
  stats: {
    articles: number;
    products: number;
    installations: number;
    experience: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="relative container mx-auto px-4 py-16 bg-gradient-to-br from-brand-primary/15 via-white to-brand-secondary/12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <StatCard number={stats.articles} label="Články" gradient="from-brand-primary to-amber-700" />
        <StatCard number={stats.products} label="Produktů" gradient="from-brand-secondaryDark to-green-700" />
        <StatCard number={`${stats.installations}+`} label="Instalací" gradient="from-brand-accentDarker to-orange-700" />
        <StatCard number={`${stats.experience}+`} label="Let zkušeností" gradient="from-purple-700 to-pink-700" />
      </div>
    </section>
  );
}

function StatCard({ number, label, gradient }: { number: number | string; label: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.08, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative text-center p-10 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all border-2 border-brand-primary/10 overflow-hidden group"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-15 group-hover:opacity-25 transition-opacity`} />

      <div className={`relative text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
        {number}
      </div>
      <div className="relative text-sm font-semibold text-gray-700 uppercase tracking-wide">{label}</div>

      {/* Decorative circle */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-10 blur-2xl`} />
    </motion.div>
  );
}
