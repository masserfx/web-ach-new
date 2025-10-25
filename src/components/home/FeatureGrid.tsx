'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Award } from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Shield className="w-12 h-12 text-brand-accent" />}
          title="7 let záruka"
          description="Komplexní záruka na všechny naše produkty"
        />
        <FeatureCard
          icon={<Zap className="w-12 h-12 text-brand-secondary" />}
          title="Vlastní vývoj"
          description="Výroba a vývoj přímo v České republice"
        />
        <FeatureCard
          icon={<Award className="w-12 h-12 text-brand-primary" />}
          title="Pokrytí celé ČR"
          description="Instalace a servis po celé České republice"
        />
      </div>
    </section>
  );
}

function FeatureCard({
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
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
