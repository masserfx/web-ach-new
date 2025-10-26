'use client';

import { motion } from 'framer-motion';
import { Bus } from 'lucide-react';

export function SymbolSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const iconVariants = {
    hidden: { x: -100, opacity: 0, rotate: -15 },
    visible: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-3xl p-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Animovaná ikona autobusu - symbol svobody a nezávislosti */}
          <motion.div
            className="flex justify-center mb-6"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Bus icon s animací */}
            <motion.div
              className="inline-block"
              animate={{
                x: [0, 20, -20, 15, -15, 10, -10, 0],
                y: [0, -10, 10, -8, 8, -5, 5, 0],
                rotate: [0, 5, -5, 8, -8, 3, -3, 0],
                scale: [1, 1.05, 1.08, 1.05, 1.08, 1.05, 1.03, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <Bus className="w-20 h-20 text-brand-primary drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Animovaný nadpis */}
          <motion.h2
            className="text-3xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Náš symbol - RTO 706
          </motion.h2>

          {/* Animovaný text */}
          <motion.p
            className="text-lg text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Historický autobus RTO 706 s lodí je naším symbolem svobody a nezávislosti.
            Připomíná nám odvahu jít vlastní cestou a hledat inovativní řešení -
            stejně jako když naši zakladatelé v roce 2006 postavili první tepelné
            čerpadlo vlastníma rukama.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
