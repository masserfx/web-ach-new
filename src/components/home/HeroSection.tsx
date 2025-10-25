'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Award, Zap, CheckCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-accent to-brand-accent/80 text-white rounded-full shadow-lg mb-8"
          >
            <Award className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wide">
              🏆 20 LET ZKUŠENOSTÍ V OBORU
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent drop-shadow-sm">
              Chytré vytápění
            </span>
            <br />
            <span className="text-gray-900 drop-shadow-sm">
              pro váš domov
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8 max-w-3xl mx-auto">
            Řešíme moderní vytápění pro rodinné, bytové i komerční domy.
            <span className="block mt-2 text-brand-primary font-bold">
              Česká firma s vlastním vývojem, výrobou a servisem po celé ČR
            </span>
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-brand-secondary" />
              <span className="font-semibold text-gray-700">7 let záruka</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-brand-secondary" />
              <span className="font-semibold text-gray-700">Vlastní výroba</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-brand-secondary" />
              <span className="font-semibold text-gray-700">1000+ instalací</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/pripravit-rozpocet"
                className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-brand-accent to-brand-accent/90 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-accent/50 transition-all border-2 border-brand-accent/20"
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
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-primary/30 border-2 border-brand-primary transition-all"
              >
                Naše produkty
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
