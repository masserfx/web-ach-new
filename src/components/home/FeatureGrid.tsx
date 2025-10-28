'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Award } from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="relative container mx-auto px-4 py-16 bg-gradient-to-b from-carbon to-graphite/50">
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Shield className="w-12 h-12" />}
          title="7 let záruka"
          description="Komplexní záruka na všechny naše produkty"
          gradient="from-brand-accent to-orange-500"
          iconBg="bg-brand-accent/10"
        />
        <FeatureCard
          icon={<Zap className="w-12 h-12" />}
          title="Vlastní vývoj"
          description="Výroba a vývoj přímo v České republice"
          gradient="from-accent-dark to-green-500"
          iconBg="bg-accent-dark/10"
        />
        <FeatureCard
          icon={<Award className="w-12 h-12" />}
          title="Pokrytí celé ČR"
          description="Instalace a servis po celé České republice"
          gradient="from-accent to-amber-700"
          iconBg="bg-accent/10"
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="relative p-10 bg-carbon rounded-2xl shadow-2xl hover:shadow-3xl transition-all border-2 border-accent/15 overflow-hidden group"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`relative inline-flex p-4 rounded-xl ${iconBg} mb-6`}>
        <div className={`text-transparent bg-gradient-to-br ${gradient} bg-clip-text`}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="relative text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="relative text-steel-dim leading-relaxed">{description}</p>

      {/* Decorative element */}
      <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
    </motion.div>
  );
}
