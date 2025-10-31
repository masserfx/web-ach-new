'use client';

import { motion } from 'framer-motion';
import AnimatedCounter from '../AnimatedCounter';

interface Slide4MetricsProps {
  isDark?: boolean;
}

export default function Slide4Metrics({ isDark = true }: Slide4MetricsProps) {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const metrics = [
    {
      category: 'Revenue Targets 2025',
      items: [
        { label: 'Měsíční obrat', baseline: 18, target: 26, unit: 'M Kč' },
        { label: 'Instalace/měsíc', baseline: 100, target: 145, unit: '' },
        { label: 'Průměrná zakázka', baseline: 180, target: 179, unit: 'k Kč' },
      ],
    },
    {
      category: 'Marketing KPIs',
      items: [
        { label: 'Conversion Rate', baseline: 2.5, target: 8, unit: '%' },
        { label: 'Cost per Lead', baseline: 850, target: 400, unit: 'Kč' },
        { label: 'Organic Traffic', baseline: 15, target: 25, unit: 'k/měs' },
      ],
    },
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
        Business Metriky & Cíle 2025
      </motion.h2>

      {/* Metrics grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 gap-8">
        {metrics.map((section, sectionIdx) => (
          <motion.div key={sectionIdx} variants={itemVariants}>
            <h3 className={`text-3xl font-bold mb-6 transition-colors ${
              isDark ? 'text-cyan-300' : 'text-cyan-600'
            }`}>
              {section.category}
            </h3>

            <div className="space-y-4">
              {section.items.map((metric, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-gray-900/70 border-gray-700 hover:border-gray-500'
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className={`text-base mb-3 font-semibold transition-colors ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>{metric.label}</p>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className={`text-base font-semibold transition-colors ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>Nyní:</p>
                      <p className={`text-3xl font-bold transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {metric.baseline}{metric.unit}
                      </p>
                    </div>
                    <div className={`text-3xl font-bold transition-colors ${
                      isDark ? 'text-green-300' : 'text-green-600'
                    }`}>→</div>
                    <div>
                      <p className={`text-base font-semibold transition-colors ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>Cíl Q4:</p>
                      <p className={`text-3xl font-bold transition-colors ${
                        isDark ? 'text-cyan-300' : 'text-cyan-600'
                      }`}>
                        <AnimatedCounter
                          from={metric.baseline}
                          to={metric.target}
                          duration={2}
                        />
                        {metric.unit}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={`mt-4 w-full rounded-full h-2 transition-colors ${
                    isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((metric.target - metric.baseline) / metric.baseline) * 20}%`,
                      }}
                      transition={{ delay: 0.5, duration: 1.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Key insight */}
      <motion.div
        variants={itemVariants}
        className={`p-8 rounded-lg text-center border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50'
            : 'bg-green-100 border-green-300'
        }`}
      >
        <p className={`text-xl font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="font-bold">Cíl: +43% revenue</span> a
          <span className={`font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}> +220% conversion rate</span> do Q4 2025
        </p>
      </motion.div>
    </motion.div>
  );
}
