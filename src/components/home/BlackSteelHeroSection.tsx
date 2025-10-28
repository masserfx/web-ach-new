'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { getCompanyYears } from '@/lib/utils';
import Image from 'next/image';

/**
 * RESPONSIVE HERO SECTION RULES:
 * 
 * 1. Background Image:
 *    - Mobile: object-position left (show heat pump on left)
 *    - Desktop: object-position center
 * 
 * 2. Layout:
 *    - Mobile: Stack vertically, text above image area
 *    - Tablet: 60/40 split (text/image space)
 *    - Desktop: 50/50 grid
 * 
 * 3. Overlays:
 *    - Mobile: Stronger gradient (90% opacity) for readability
 *    - Desktop: Lighter gradient (70% opacity) to show more image
 * 
 * 4. Typography:
 *    - Mobile: text-4xl (36px)
 *    - Tablet: text-5xl (48px)
 *    - Desktop: text-6xl/7xl (60-72px)
 * 
 * 5. Spacing:
 *    - Mobile: px-4 py-16 (compact)
 *    - Tablet: px-6 py-20
 *    - Desktop: px-12 py-24 (spacious)
 */

export function BlackSteelHeroSection() {
  const yearsSinceFoundation = useMemo(() => {
    return getCompanyYears();
  }, []);

  return (
    <section className="relative w-full min-h-[100svh] overflow-hidden flex items-center">
      {/* Background Image with Responsive Overlays */}
      <div className="absolute inset-0">
        {/* NG ONE Hero Image - Responsive object position */}
        <Image
          src="/images/hero-ng-one.jpg"
          alt="AC Heating NG ONE tepelné čerpadlo"
          fill
          className="object-cover object-left md:object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        
        {/* Mobile: Strong dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/95 via-carbon/90 to-carbon/85 md:hidden" />
        
        {/* Tablet+: Left-to-right gradient (stronger on text side) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-carbon/90 via-carbon/75 to-carbon/50 lg:from-carbon/85 lg:via-carbon/65 lg:to-carbon/40" />
        
        {/* Subtle orange accent - visible on all sizes */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
      </div>

      {/* Main Content Container - Responsive Padding */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24">
        {/* Text Content - Responsive Width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-4 sm:space-y-6 max-w-full md:max-w-xl lg:max-w-2xl"
        >
          {/* Main Headline - Responsive Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]"
          >
            Tepelné čerpadlo bez kompromisů.
          </motion.h1>

          {/* Subheadline - Responsive Typography */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-steel font-normal leading-relaxed drop-shadow-lg"
          >
            Convert NG One – výkon, design, ticho.
          </motion.p>

          {/* CTA Buttons - Responsive Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
          >
            {/* Primary CTA - Responsive Sizing */}
            <Link
              href="/pripravit-rozpocet"
              className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#F36F21] to-[#FF8F3C] text-white font-bold text-sm sm:text-base rounded-lg shadow-[0_4px_20px_rgba(243,111,33,0.4)] hover:shadow-[0_8px_30px_rgba(243,111,33,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Získejte nabídku</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA - Responsive Sizing */}
            <Link
              href="/produkty"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-graphite/80 backdrop-blur-sm border-2 border-white/30 text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-graphite hover:border-white/50 transition-all duration-300 active:scale-95"
            >
              <span>Porovnat varianty</span>
            </Link>
          </motion.div>

          {/* Trust Badges - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6"
          >
            <div className="px-3 sm:px-4 py-2 bg-graphite/70 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-xs sm:text-sm font-semibold text-steel">✓ 7 let záruka</span>
            </div>
            <div className="px-3 sm:px-4 py-2 bg-graphite/70 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-xs sm:text-sm font-semibold text-steel">✓ {yearsSinceFoundation}+ let zkušeností</span>
            </div>
            <div className="px-3 sm:px-4 py-2 bg-graphite/70 backdrop-blur-sm rounded-lg border border-white/10">
              <span className="text-xs sm:text-sm font-semibold text-steel">✓ 7 500+ instalací</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-carbon to-transparent pointer-events-none" />
      
      {/* Scroll indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 text-steel/50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
