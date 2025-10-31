'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, PieChart, X } from 'lucide-react';
import { useState } from 'react';

interface Slide6InvestmentProps {
  isDark?: boolean;
}

export default function Slide6Investment({ isDark = true }: Slide6InvestmentProps) {
  const [selectedCost, setSelectedCost] = useState<number | null>(null);

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

  const costs = [
    {
      label: 'VPS Hetzner',
      value: 1000,
      period: 'Kč/měsíc',
      color: 'from-orange-600 to-red-600',
      detail: 'Serverové prostředí pro hosting naší Next.js aplikace a databází. 2 vCPU, 4GB RAM, 80GB SSD. Lokální VPS v Česku s best-in-class uptime.'
    },
    {
      label: 'VPS AC-Heating',
      value: 0,
      period: 'vlastní',
      color: 'from-cyan-600 to-teal-600',
      detail: 'Vlastní dedikovaný server AC Heating s plnou kontrolou nad hardwarem a infrastrukturou. Nulové měsíční náklady na hosting. Enterprise-grade výkon a bezpečnost.'
    },
    {
      label: 'Supabase',
      value: 625,
      period: 'Kč/měsíc',
      color: 'from-green-600 to-emerald-600',
      detail: 'PostgreSQL database s real-time synchronizací, automatickými zálohami, RLS policies a REST API. Scalable od startup po enterprise.'
    },
    {
      label: 'AI API (Claude)',
      value: 2500,
      period: 'Kč/měsíc',
      color: 'from-purple-600 to-pink-600',
      detail: '4x Claude Sonnet 4.5 agenti pro: SEO optimalizaci, generování obsahu, analytiku a strategii. 200k context tokens pro deep analysis.'
    },
    {
      label: 'Doména + SSL',
      value: 500,
      period: 'Kč/měsíc',
      color: 'from-blue-600 to-cyan-600',
      detail: 'Premium doména ac-heating.cz s automatickým SSL certifikátem (Let\'s Encrypt), DNS management a DDoS ochranou.'
    },
  ];

  const monthlyTotal = 1000 + 625 + 2500 + 500; // 4 625 Kč
  const agencyCost = 50000; // 50k Kč/měsíc (2000 EUR)
  const savingsMonthly = agencyCost - monthlyTotal;

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
        Investice & ROI Kalkulace
      </motion.h2>

      {/* Cost breakdown */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 gap-8">
        {/* Monthly costs */}
        <motion.div variants={itemVariants}>
          <h3 className={`text-3xl font-bold mb-6 flex items-center gap-2 transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}>
            <PieChart size={32} />
            Měsíční náklady (vlastní řešení)
          </h3>

          <div className="space-y-3">
            {costs.map((cost, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, translateX: 4 }}
                onClick={() => setSelectedCost(idx)}
                className={`w-full text-left p-4 rounded-lg bg-gradient-to-r ${cost.color} border transition-colors cursor-pointer hover:shadow-lg ${
                  isDark ? 'border-gray-600' : 'border-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-white">{cost.label}</span>
                  <span className="text-2xl font-bold text-white">
                    {cost.value.toLocaleString('cs-CZ')} Kč <span className="text-base text-white font-semibold">{cost.period}</span>
                  </span>
                </div>
                <p className="text-xs mt-2 text-white font-semibold">
                  💡 Klikni pro detaily
                </p>
              </motion.button>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className={`mt-6 p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-gray-900 border-gray-700'
                : 'bg-gray-50 border-gray-400'
            }`}
          >
            <p className={`text-base mb-2 font-semibold transition-colors ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>Celkem měsíčně</p>
            <p className={`text-5xl font-bold transition-colors ${
              isDark ? 'text-green-300' : 'text-green-600'
            }`}>{monthlyTotal.toLocaleString('cs-CZ')} Kč</p>
          </motion.div>
        </motion.div>

        {/* ROI Calculation */}
        <motion.div variants={itemVariants}>
          <h3 className={`text-3xl font-bold mb-6 flex items-center gap-2 transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}>
            <TrendingUp size={32} />
            ROI vs. Agentura
          </h3>

          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-red-900/20 border-red-700/50'
                : 'bg-red-100 border-red-300'
            }`}>
              <p className={`text-base mb-2 font-semibold transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>Náklady agenturou/měsíc</p>
              <p className={`text-4xl font-bold transition-colors ${
                isDark ? 'text-red-300' : 'text-red-600'
              }`}>50 000 Kč</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-green-900/20 border-green-700/50'
                : 'bg-green-100 border-green-300'
            }`}>
              <p className={`text-base mb-2 font-semibold transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>Úspora měsíčně</p>
              <p className={`text-4xl font-bold transition-colors ${
                isDark ? 'text-green-300' : 'text-green-600'
              }`}>{savingsMonthly.toLocaleString('cs-CZ')} Kč</p>
              <p className={`text-base mt-2 font-semibold transition-colors ${
                isDark ? 'text-green-200' : 'text-green-700'
              }`}>({((savingsMonthly / agencyCost) * 100).toFixed(1)}% snížení)</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-blue-900/20 border-blue-700/50'
                : 'bg-blue-100 border-blue-300'
            }`}>
              <p className={`text-base mb-2 font-semibold transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>Úspora za rok</p>
              <p className={`text-4xl font-bold transition-colors ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}>{(savingsMonthly * 12).toLocaleString('cs-CZ')} Kč</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className={`p-4 rounded-lg border transition-colors ${
              isDark
                ? 'bg-cyan-900/20 border-cyan-700/50'
                : 'bg-cyan-100 border-cyan-300'
            }`}>
              <p className={`text-base mb-2 font-semibold transition-colors ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>Payback period</p>
              <p className={`text-4xl font-bold transition-colors ${
                isDark ? 'text-cyan-300' : 'text-cyan-600'
              }`}>~1 měsíc</p>
              <p className={`text-base mt-2 font-semibold transition-colors ${
                isDark ? 'text-cyan-200' : 'text-cyan-700'
              }`}>(Setup investice se vrátí velmi rychle)</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Risk mitigation */}
      <motion.div
        variants={itemVariants}
        className={`p-6 rounded-lg border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50'
            : 'bg-yellow-100 border-yellow-300'
        }`}
      >
        <p className={`font-bold mb-3 text-xl transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>🔒 Mitigace rizik</p>
        <ul className={`space-y-3 text-lg font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <li>✓ Automatické zálohování (daily snapshots)</li>
          <li>✓ Rollback plán (vrátit se k předchozí verzi za minuty)</li>
          <li>✓ Monitoring 24/7 (alerty na selhání)</li>
          <li>✓ Supabase redundance (PostgreSQL clustering)</li>
        </ul>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCost !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCost(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-2xl rounded-xl shadow-2xl z-50 ${
                isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className={`text-3xl font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {costs[selectedCost].label}
                    </h3>
                    <p className={`text-2xl font-bold mt-2 transition-colors ${
                      isDark ? 'text-green-300' : 'text-green-600'
                    }`}>
                      {costs[selectedCost].value.toLocaleString('cs-CZ')} Kč/měsíc
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCost(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Detail content */}
                <p className={`text-lg leading-relaxed font-semibold transition-colors ${
                  isDark ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {costs[selectedCost].detail}
                </p>

                {/* Additional info by type */}
                {selectedCost === 0 && (
                  <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-orange-900/20 border-orange-700/50'
                      : 'bg-orange-100 border-orange-300'
                  }`}>
                    <p className={`font-semibold transition-colors ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                      ℹ️ Specifikace VPS
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• Procesor: AMD EPYC 2 vCPU @ 3.2GHz</li>
                      <li>• RAM: 4GB DDR4</li>
                      <li>• SSD: 80GB NVMe</li>
                      <li>• Bandwidth: 20Gbps shared</li>
                      <li>• Lokace: Česko, Brno datacenter</li>
                    </ul>
                  </div>
                )}

                {selectedCost === 1 && (
                  <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-cyan-900/20 border-cyan-700/50'
                      : 'bg-cyan-100 border-cyan-300'
                  }`}>
                    <p className={`font-semibold transition-colors ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                      ℹ️ Specifikace vlastního serveru
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• Dedikovaný hardware v naší kontrole</li>
                      <li>• Neomezená kapacita pro škálování</li>
                      <li>• Žádné měsíční poplatky za hosting</li>
                      <li>• Plný fyzický i logický přístup</li>
                      <li>• Enterprise-grade bezpečnost</li>
                    </ul>
                  </div>
                )}

                {selectedCost === 2 && (
                  <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-green-900/20 border-green-700/50'
                      : 'bg-green-100 border-green-300'
                  }`}>
                    <p className={`font-semibold transition-colors ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                      ℹ️ Databázové features
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• PostgreSQL 16 s přes 100GB storage</li>
                      <li>• Real-time subscriptions</li>
                      <li>• Automatické zálohování (point-in-time recovery)</li>
                      <li>• RLS policies pro bezpečnost</li>
                    </ul>
                  </div>
                )}

                {selectedCost === 3 && (
                  <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-purple-900/20 border-purple-700/50'
                      : 'bg-purple-100 border-purple-300'
                  }`}>
                    <p className={`font-semibold transition-colors ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                      ℹ️ AI Agenti
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• 1 Agent: SEO optimalizace & keyword research</li>
                      <li>• 1 Agent: Generování obsahu & copywriting</li>
                      <li>• 1 Agent: Analytics & metriky</li>
                      <li>• 1 Agent: Strategie & business planning</li>
                    </ul>
                  </div>
                )}

                {selectedCost === 4 && (
                  <div className={`mt-6 p-4 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-blue-900/20 border-blue-700/50'
                      : 'bg-blue-100 border-blue-300'
                  }`}>
                    <p className={`font-semibold transition-colors ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                      ℹ️ Bezpečnostní features
                    </p>
                    <ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <li>• SSL certifikát s Let's Encrypt automatizací</li>
                      <li>• DNSSEC & DNS records management</li>
                      <li>• DDoS ochrana (CloudFlare)</li>
                      <li>• HTTPS redirection & HSTS headers</li>
                    </ul>
                  </div>
                )}

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCost(null)}
                  className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition-colors ${
                    isDark
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                  }`}
                >
                  Zavřít
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
