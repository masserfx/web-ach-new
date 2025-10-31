'use client';

import { motion } from 'framer-motion';
import { Zap, DollarSign, Lock, Cpu } from 'lucide-react';

interface Slide2AdvantagesProps {
  isDark?: boolean;
}

export default function Slide2Advantages({ isDark = true }: Slide2AdvantagesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const advantages = [
    {
      icon: Zap,
      title: 'Rychlost',
      color: 'from-yellow-500 to-orange-500',
      points: ['Změny za minuty (ne týdny)', 'Live deployments', 'Okamžitá ověření'],
    },
    {
      icon: DollarSign,
      title: 'Náklady',
      color: 'from-green-500 to-emerald-500',
      points: ['80% úspora vs. agentura', '1 000 Kč/měs VPS', 'Bez setupu agenturou'],
    },
    {
      icon: Lock,
      title: 'Kontrola',
      color: 'from-blue-500 to-cyan-500',
      points: ['100% vlastnictví kódu', 'Plná kontrola dat', 'Žádné licenční vazby'],
    },
    {
      icon: Cpu,
      title: 'AI Automatizace',
      color: 'from-purple-500 to-pink-500',
      points: ['4 Claude Sonnet agenti', '24/7 generování obsahu', 'Intelligentní SEO'],
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto"
    >
      {/* Headline */}
      <motion.h2
        variants={cardVariants}
        className={`text-5xl font-bold text-center mb-12 transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Čtyři pilíře konkurenční výhody
      </motion.h2>

      {/* Advantage cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 gap-8">
        {advantages.map((advantage, index) => {
          const Icon = advantage.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`p-8 rounded-lg border transition-all ${
                isDark
                  ? 'border-gray-700 bg-gradient-to-br from-gray-900/70 to-black/50 hover:border-gray-500'
                  : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:border-gray-400'
              }`}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${advantage.color} mb-4`}>
                <Icon size={28} className="text-white" />
              </div>

              <h3 className={`text-3xl font-bold mb-4 transition-colors ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{advantage.title}</h3>

              <ul className="space-y-3">
                {advantage.points.map((point, idx) => (
                  <li key={idx} className={`flex items-start gap-2 text-lg font-semibold transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className={`mt-1 font-bold transition-colors ${
                      isDark ? 'text-green-300' : 'text-green-600'
                    }`}>✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom summary */}
      <motion.div
        variants={cardVariants}
        className={`mt-12 p-8 rounded-lg border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50'
            : 'bg-blue-100 border-blue-300'
        }`}
      >
        <p className={`text-center text-xl font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="font-bold">Kombinace těchto čtyř pilířů</span> dělá z vlastního řešení
          <span className={`font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}> ekonomicky i technologicky nejlepší volbu</span> pro AC Heating
        </p>
      </motion.div>
    </motion.div>
  );
}
