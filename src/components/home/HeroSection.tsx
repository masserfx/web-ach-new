'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';

export function HeroSection() {
  return (
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
  );
}
