'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Target } from 'lucide-react';

interface Slide5RoadmapProps {
  isDark?: boolean;
}

export default function Slide5Roadmap({ isDark = true }: Slide5RoadmapProps) {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const categories = [
    {
      icon: '🎯',
      title: 'Vize',
      desc: 'Brand Positioning',
      tasks: 3,
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: '💬',
      title: 'Mise',
      desc: 'Komunikace hodnot',
      tasks: 2,
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: '📊',
      title: 'Cíle',
      desc: 'Obchodní metriky',
      tasks: 1,
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: '🏠',
      title: 'Obchod',
      desc: '3 segmenty trhu',
      tasks: 4,
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: '🔍',
      title: 'SEO',
      desc: 'Viditelnost & traffic',
      tasks: 4,
      color: 'from-yellow-600 to-orange-600',
    },
    {
      icon: '✨',
      title: 'Personalizace',
      desc: 'Obsah & UX',
      tasks: 6,
      color: 'from-pink-600 to-rose-600',
    },
  ];

  const timeline = [
    { week: 'Prosinec 2025', phase: 'Vize & Mise', progress: 100, status: '✓ Done' },
    { week: 'Prosinec 2025', phase: 'Obchod & Cíle', progress: 75, status: '🔄 In Progress' },
    { week: 'Leden 2026', phase: 'SEO & Content', progress: 40, status: '⏳ Start 1.1.2026' },
    { week: 'Leden-Únor 2026', phase: 'Personalizace', progress: 10, status: '⏳ Planned' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Headline */}
      <motion.h2
        variants={itemVariants}
        className={`text-5xl font-bold text-center transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Implementační Roadmap (Start 1.1.2026)
      </motion.h2>

      {/* Category cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg bg-gradient-to-br ${cat.color} border transition-colors ${
              isDark ? 'border-gray-600' : 'border-gray-400'
            }`}
          >
            <p className="text-3xl mb-2">{cat.icon}</p>
            <h3 className="font-bold text-2xl text-white">{cat.title}</h3>
            <p className="text-base mb-2 text-white font-semibold">{cat.desc}</p>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-white" />
              <span className="text-sm font-bold text-white">{cat.tasks} úkolů</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className={`text-3xl font-bold mb-6 transition-colors ${
          isDark ? 'text-cyan-300' : 'text-cyan-600'
        }`}>Timeline</h3>

        {timeline.map((item, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-gray-900/70 border-gray-700'
                : 'bg-white border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className={`font-bold text-lg transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.week}</p>
                <p className={`text-base font-semibold transition-colors ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                }`}>{item.phase}</p>
              </div>
              <span className="text-2xl">{item.status}</span>
            </div>

            {/* Progress bar */}
            <div className={`w-full rounded-full h-3 transition-colors ${
              isDark ? 'bg-gray-700' : 'bg-gray-300'
            }`}>
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ delay: 0.3, duration: 1 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50'
            : 'bg-blue-100 border-blue-300'
        }`}
      >
        <div className="flex items-start gap-4">
          <CheckCircle2 size={32} className="text-green-300 flex-shrink-0 mt-1" />
          <div>
            <p className={`font-bold mb-2 text-xl transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Celkem 20 tasků s AI automatizací</p>
            <p className={`text-lg font-semibold transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Každý task má assigned AI agenta (Claude Sonnet 4.5) pro automatické plnění a monitoring
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
