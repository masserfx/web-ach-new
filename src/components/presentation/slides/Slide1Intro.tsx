'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Globe, Zap } from 'lucide-react';

interface Slide1IntroProps {
  isDark?: boolean;
}

export default function Slide1Intro({ isDark = true }: Slide1IntroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      {/* Main headline */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h2 className={`text-7xl font-bold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Převzetí správy webu
        </h2>
        <p className={`text-4xl font-semibold transition-colors ${
          isDark ? 'text-cyan-300' : 'text-cyan-600'
        }`}>
          Vlastními silami
        </p>
      </motion.div>

      {/* Comparison */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8 mt-12">
        {/* Current state */}
        <div className={`p-8 rounded-lg border ${
          isDark
            ? 'bg-red-900/20 border-red-700/50'
            : 'bg-red-100 border-red-300'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-red-300' : 'text-red-600'
          }`}>
            <Globe size={28} />
            Nyní
          </h3>
          <ul className={`space-y-3 text-lg font-semibold transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <li>❌ Závislost na externí agentuře</li>
            <li>❌ Pomalé nasazení změn (týdny)</li>
            <li>❌ Vysoké náklady (50 000+ Kč měsíčně)</li>
            <li>❌ Omezená kontrola nad daty</li>
            <li>❌ Legacy PHP (650+ stránek)</li>
          </ul>
        </div>

        {/* Target state */}
        <div className={`p-8 rounded-lg border ${
          isDark
            ? 'bg-green-900/20 border-green-700/50'
            : 'bg-green-100 border-green-300'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
            isDark ? 'text-green-300' : 'text-green-600'
          }`}>
            <Zap size={28} />
            Cíl
          </h3>
          <ul className={`space-y-3 text-lg font-semibold transition-colors ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <li>✅ Plná kontrola in-house</li>
            <li>✅ Změny za minuty (ne týdny)</li>
            <li>✅ 80% úspora nákladů</li>
            <li>✅ 100% vlastnictví dat a kódu</li>
            <li>✅ Moderní Next.js + AI automatizace</li>
          </ul>
        </div>
      </motion.div>

      {/* Key metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 mt-12">
        <div className={`text-center p-6 rounded-lg transition-colors ${
          isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'
        }`}>
          <p className={`text-5xl font-bold transition-colors ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>650+</p>
          <p className={`text-base mt-2 transition-colors font-semibold ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Stránek na webu</p>
        </div>
        <div className={`text-center p-6 rounded-lg transition-colors ${
          isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'
        }`}>
          <p className={`text-5xl font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}>358</p>
          <p className={`text-base mt-2 transition-colors font-semibold ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Migrovaných článků</p>
        </div>
        <div className={`text-center p-6 rounded-lg transition-colors ${
          isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-300'
        }`}>
          <p className={`text-5xl font-bold transition-colors ${
            isDark ? 'text-green-300' : 'text-green-600'
          }`}>8</p>
          <p className={`text-base mt-2 transition-colors font-semibold ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Produktových linií</p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={itemVariants}
        className={`text-center mt-12 p-8 rounded-lg border transition-colors ${
          isDark
            ? 'bg-blue-900/30 border-blue-700/50'
            : 'bg-blue-100 border-blue-300'
        }`}
      >
        <p className={`text-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <CheckCircle2 size={24} className={isDark ? 'text-green-300' : 'text-green-600'} />
          Cíl: Převzít web a snížit náklady na správu o 80%
        </p>
      </motion.div>
    </motion.div>
  );
}
