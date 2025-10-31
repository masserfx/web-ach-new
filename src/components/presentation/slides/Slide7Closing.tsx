'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Users, Zap } from 'lucide-react';

interface Slide7ClosingProps {
  isDark?: boolean;
}

export default function Slide7Closing({ isDark = true }: Slide7ClosingProps) {
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const approvals = [
    {
      icon: CheckCircle2,
      title: 'Schválení převzetí webu',
      desc: 'Od agentury k in-house správě',
      status: '⏳',
    },
    {
      icon: Zap,
      title: 'Schválení investice',
      desc: '4 625 Kč/měs infrastruktura + AI',
      status: '⏳',
    },
    {
      icon: Calendar,
      title: 'Schválení roadmapu',
      desc: '9 týdnů implementace, 20 tasků',
      status: '⏳',
    },
    {
      icon: Users,
      title: 'Přidělení týmu',
      desc: 'Dev + QA + Content team',
      status: '⏳',
    },
  ];

  const timeline = [
    { week: '1. týden', action: 'Setup infrastruktury & training' },
    { week: '2-3. týden', action: 'Vize & Mise implementace' },
    { week: '4-5. týden', action: 'Obchod & Business goals' },
    { week: '6-9. týden', action: 'SEO & Personalizace' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Main heading */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h2 className={`text-6xl font-bold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Příští kroky</h2>
        <p className="text-3xl text-cyan-300 font-semibold">Schválení a Go-Live plán</p>
      </motion.div>

      {/* Approvals needed */}
      <motion.div variants={containerVariants} className="space-y-4">
        <h3 className={`text-3xl font-bold mb-6 transition-colors ${
          isDark ? 'text-cyan-300' : 'text-cyan-600'
        }`}>Schválení potřebná</h3>

        <div className="grid grid-cols-2 gap-6">
          {approvals.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-lg border hover:border-cyan-500/50 transition-colors ${
                  isDark
                    ? 'bg-gradient-to-br from-gray-900 to-black border-gray-700'
                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon size={32} className="text-cyan-300" />
                  <span className="text-4xl">{item.status}</span>
                </div>
                <h4 className={`font-bold mb-2 text-xl transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.title}</h4>
                <p className={`text-lg font-semibold transition-colors ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Go-Live timeline */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className={`text-3xl font-bold mb-6 transition-colors ${
          isDark ? 'text-cyan-300' : 'text-cyan-600'
        }`}>Go-Live Timeline</h3>

        <div className="space-y-3">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`p-4 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-700/50'
                  : 'bg-blue-100 border-blue-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg transition-colors ${
                  isDark ? 'bg-cyan-500 text-gray-900' : 'bg-cyan-600 text-white'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className={`font-bold text-lg transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.week}</p>
                  <p className={`text-base font-semibold transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{item.action}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        variants={itemVariants}
        className="mt-12 text-center space-y-6"
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          className={`px-12 py-4 rounded-lg text-white font-bold text-2xl transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600'
          }`}
        >
          Schválit a Spustit
        </motion.button>

        <div className={`space-y-2 font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <p className="text-lg">Otázky? Přejdeme si celou strategii v detailu</p>
          <p className="text-base">
            Kontakt: CTO / Tech Lead | Email: dev@ac-heating.cz | Next meeting: TBA
          </p>
        </div>
      </motion.div>

      {/* Final message */}
      <motion.div
        variants={itemVariants}
        className={`mt-8 p-8 rounded-lg text-center border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50'
            : 'bg-purple-100 border-purple-300'
        }`}
      >
        <p className={`text-2xl font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <span className={`font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}>Nyní máme příležitost</span> převzít plnou kontrolu nad naším web pojetím,
          <span className={`font-bold transition-colors ${
            isDark ? 'text-green-300' : 'text-green-600'
          }`}> snížit náklady o 80%</span> a
          <span className={`font-bold transition-colors ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}> zrychlit inovace</span> bez závislosti na externí agentuře.
        </p>
      </motion.div>
    </motion.div>
  );
}
