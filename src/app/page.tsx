'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5" />

        <div className="relative container mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-8"
            >
              <Award className="w-4 h-4 text-brand-accent" />
              <span className="text-sm font-medium text-gray-700">
                20 let zkušeností v oboru
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">
                Chytré vytápění
              </span>
              <br />
              <span className="text-gray-900">
                pro váš domov
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Řešíme moderní vytápění pro rodinné, bytové i komerční domy.
              Česká firma s vlastním vývojem, výrobou a servisem po celé ČR.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/pripravit-rozpocet"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Nezávazná poptávka
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/produkty"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-brand-primary transition-all"
                >
                  Naše produkty
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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

      {/* Admin Link (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            href="/admin"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg text-sm font-medium"
          >
            🤖 Admin
          </Link>
        </div>
      )}
    </main>
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
