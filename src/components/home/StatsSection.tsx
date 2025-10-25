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
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <StatCard number={stats.articles} label="Článků" />
        <StatCard number={stats.products} label="Produktů" />
        <StatCard number={`${stats.installations}+`} label="Instalací" />
        <StatCard number={`${stats.experience}+`} label="Let zkušeností" />
      </div>
    </section>
  );
}

function StatCard({ number, label }: { number: number | string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="text-center p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
        {number}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
}
