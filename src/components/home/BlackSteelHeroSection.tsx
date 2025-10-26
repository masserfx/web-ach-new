'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { getCompanyYears } from '@/lib/utils';

export function BlackSteelHeroSection() {
  const yearsSinceFoundation = useMemo(() => {
    return getCompanyYears();
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-hero-gradient overflow-hidden flex items-center">
      {/* Glass Reflection Overlay */}
      <div className="absolute inset-0 bg-white/15 backdrop-blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated Background Blobs (optional enhancement) */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 w-fit px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/15 transition-all"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {yearsSinceFoundation}+ LET ZKUŠENOSTI V OBORU
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight"
          >
            Tepelné čerpadlo bez kompromisů.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed max-w-2xl"
          >
            Convert NG One – <span className="text-accent font-bold">výkon, design, ticho.</span>
          </motion.p>

          {/* Meta Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-steel space-y-1"
          >
            <div>✓ Vyrobeno v Česku</div>
            <div>✓ Záruka 7 let</div>
            <div>✓ Dotace až 180 000 Kč</div>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            {/* Primary CTA */}
            <Link
              href="/pripravit-rozpocet"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold text-lg rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-6 h-6" fill="currentColor" />
              <span>Zjisti, kolik ušetříš</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/produkty"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              <span>Porovnat varianty</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Product Render (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-full min-h-[500px] flex items-center justify-center"
        >
          {/* Glass Effect Box for Product */}
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-accent/10 rounded-3xl blur-2xl opacity-60" />

            {/* Glass Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl overflow-hidden group">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Product Placeholder (Can be replaced with actual image) */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                {/* Pseudo 3D Icon */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/30 rounded-3xl blur-3xl opacity-40 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-graphite to-carbon rounded-3xl p-8 border border-white/20">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                      <span className="text-6xl">🔥</span>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <h2 className="text-2xl font-black text-white text-center">
                  Convert NG One
                </h2>

                {/* Key Features */}
                <div className="space-y-3 text-sm text-steel text-center">
                  <div>⚡ Efektivní vytápění</div>
                  <div>🔇 Ultra tichý provoz</div>
                  <div>♻️ Přátelský k prostředí</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave (optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
    </section>
  );
}
