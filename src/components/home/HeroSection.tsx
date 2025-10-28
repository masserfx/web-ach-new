'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Award, Zap, CheckCircle } from 'lucide-react';
import { useMemo } from 'react';
import { getCompanyYears } from '@/lib/utils';
import Image from 'next/image';

export function HeroSection() {
  // Dynamicky počítáme roky od založení (1.1.2006)
  const yearsSinceFoundation = useMemo(() => {
    return getCompanyYears();
  }, []);

  return (
    <section className="relative overflow-hidden bg-carbon min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-ng-one.jpg"
          alt="AC Heating NG ONE tepelné čerpadlo"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/95 via-carbon/85 to-carbon/75" />
        {/* Subtle accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-dark/10" />
      </div>

      {/* Animated accent orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-4 w-96 h-96 bg-accent/20 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-40 -right-4 w-96 h-96 bg-accent-dark/15 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-accent/15 rounded-full mix-blend-overlay filter blur-3xl opacity-25 animate-blob animation-delay-4000" />
      </div>

      <div className="relative container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/90 backdrop-blur-sm text-carbon rounded-full shadow-lg mb-8 border border-accent"
          >
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide">
              {yearsSinceFoundation}+ LET ZKUŠENOSTÍ V OBORU
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="text-accent drop-shadow-[0_2px_10px_rgba(255,159,67,0.5)]">
              Chytré vytápění
            </span>
            <br />
            <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
              pro váš domov
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-steel font-medium mb-4 max-w-3xl drop-shadow-lg">
            Řešíme moderní vytápění pro rodinné, bytové i komerční domy.
          </p>
          <p className="text-lg md:text-xl text-accent font-bold mb-8 max-w-3xl drop-shadow-lg">
            Česká firma s {yearsSinceFoundation}letou tradicí - instalace tepelných čerpadel a fotovoltaiky po celé Evropě
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-3 bg-graphite/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="font-semibold text-steel">7 let záruka</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-graphite/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="font-semibold text-steel">100+ zaměstnanců</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-graphite/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="font-semibold text-steel">7 500+ domácností</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/pripravit-rozpocet"
                className="inline-flex items-center gap-2 px-10 py-5 bg-accent hover:bg-accent-dark text-carbon rounded-xl font-bold text-lg shadow-2xl hover:shadow-accent/50 transition-all border-2 border-accent"
              >
                <Zap className="w-6 h-6" fill="currentColor" />
                Nezávazná poptávka
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/produkty"
                className="inline-flex items-center gap-2 px-10 py-5 bg-graphite/90 backdrop-blur-sm hover:bg-graphite text-accent rounded-xl font-bold text-lg shadow-2xl hover:shadow-accent/30 border-2 border-accent transition-all"
              >
                Naše produkty
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-carbon to-transparent" />
    </section>
  );
}
