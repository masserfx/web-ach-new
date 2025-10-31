'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface Slide3TechnologyProps {
  isDark?: boolean;
}

interface TechItem {
  name: string;
  desc: string;
  color: string;
  preview?: string;
}

export default function Slide3Technology({ isDark = true }: Slide3TechnologyProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  const techStack = [
    {
      category: 'Frontend',
      items: [
        {
          name: 'Next.js 16',
          desc: 'Nejmodernější React framework',
          color: 'from-black to-gray-800',
          preview: 'Turbopack • RSC • App Router • Streaming',
        },
        {
          name: 'React 19',
          desc: 'Latest UI capabilities',
          color: 'from-blue-600 to-cyan-600',
          preview: 'Server Components • Actions • Hooks',
        },
        {
          name: 'TailwindCSS 4',
          desc: 'Modern styling engine',
          color: 'from-cyan-600 to-blue-600',
          preview: 'Utility-first • Dark mode • Animation',
        },
        {
          name: 'Framer Motion',
          desc: 'Smooth animations',
          color: 'from-pink-600 to-purple-600',
          preview: 'Variants • Gestures • Layout animations',
        },
      ],
    },
    {
      category: 'Backend',
      items: [
        {
          name: 'Supabase PostgreSQL',
          desc: 'Real-time database',
          color: 'from-green-600 to-emerald-600',
          preview: 'Real-time • RLS policies • REST API',
        },
        {
          name: 'API Routes',
          desc: 'Serverless functions',
          color: 'from-blue-600 to-indigo-600',
          preview: 'Route handlers • Middleware • Streaming',
        },
        {
          name: 'Next.js Auth',
          desc: 'Secure authentication',
          color: 'from-purple-600 to-pink-600',
          preview: 'JWT • Sessions • OAuth support',
        },
        {
          name: 'Rate Limiting',
          desc: 'Security & performance',
          color: 'from-orange-600 to-red-600',
          preview: 'Token bucket • Redis • DDoS protection',
        },
      ],
    },
    {
      category: 'AI & Analytics',
      items: [
        {
          name: '4x Claude Sonnet',
          desc: 'Content, SEO, Product, Marketing',
          color: 'from-purple-600 to-violet-600',
          preview: 'Vision • 200k context • Real-time',
        },
        {
          name: 'Neo4j Graph DB',
          desc: '33 analytical queries',
          color: 'from-orange-600 to-yellow-600',
          preview: 'Cypher • Graph pattern • Analytics',
        },
        {
          name: 'Google Analytics 4',
          desc: 'Real-time tracking',
          color: 'from-red-600 to-orange-600',
          preview: 'Events • Funnels • Custom reports',
        },
        {
          name: 'CRO Event Tracking',
          desc: 'Conversion optimization',
          color: 'from-green-600 to-teal-600',
          preview: 'Goals • Funnels • Heatmaps',
        },
      ],
    },
    {
      category: 'Infrastructure',
      items: [
        {
          name: 'Hetzner VPS',
          desc: 'Full control server',
          color: 'from-orange-600 to-amber-600',
          preview: '€10/měs • 2 vCPU • 4GB RAM',
        },
        {
          name: 'Vlastní VPS',
          desc: 'Dedicated server (alternativa)',
          color: 'from-red-600 to-orange-600',
          preview: 'Full control • Scaling • High performance',
        },
        {
          name: 'Docker & Compose',
          desc: 'Service orchestration',
          color: 'from-blue-600 to-cyan-600',
          preview: 'Containers • Networks • Volumes',
        },
        {
          name: 'Apache + nginx',
          desc: 'Web servers',
          color: 'from-red-600 to-orange-600',
          preview: 'Reverse proxy • Load balancing • SSL',
        },
        {
          name: 'SSL/TLS',
          desc: 'Security & HTTPS',
          color: 'from-green-600 to-emerald-600',
          preview: 'Let\'s Encrypt • Auto-renewal • Encryption',
        },
      ],
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      {/* Headline */}
      <motion.h2
        variants={itemVariants}
        className={`text-5xl font-bold text-center mb-2 transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Moderní technologický stack
      </motion.h2>
      <motion.p
        variants={itemVariants}
        className={`text-center mb-8 text-xl font-semibold transition-colors ${
          isDark ? 'text-gray-200' : 'text-gray-700'
        }`}
      >
        Postaveno na nejnovějších, nejrychlejších a nejbezpečnějších technologiích
      </motion.p>

      {/* Tech stack grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 gap-6">
        {techStack.map((section, sectionIdx) => (
          <motion.div
            key={sectionIdx}
            variants={itemVariants}
            className="space-y-4"
          >
            <h3 className={`text-3xl font-bold mb-4 transition-colors ${
              isDark ? 'text-cyan-300' : 'text-cyan-600'
            }`}>
              {section.category}
            </h3>

            <div className="space-y-3">
              {section.items.map((tech, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, translateX: 4 }}
                  onHoverStart={() => setHoveredItem(`${sectionIdx}-${idx}`)}
                  onHoverEnd={() => setHoveredItem(null)}
                  onClick={() => {
                    if (tech.name === 'Neo4j Graph DB') {
                      window.open('http://localhost:7474/browser/?cmd=play&arg=concepts', '_blank');
                    }
                  }}
                  className={`p-4 rounded-lg bg-gradient-to-r ${tech.color} border relative transition-colors cursor-pointer ${
                    isDark ? 'border-gray-600' : 'border-gray-400'
                  } ${tech.name === 'Neo4j Graph DB' ? 'hover:ring-2 hover:ring-yellow-400' : ''}`}
                >
                  <p className="font-bold text-lg text-white">
                    {tech.name}
                    {tech.name === 'Neo4j Graph DB' && (
                      <span className="ml-2 text-sm">🔗</span>
                    )}
                  </p>
                  <p className={`text-base font-semibold transition-colors ${
                    isDark ? 'text-white' : 'text-white'
                  }`}>{tech.desc}</p>

                  {/* Preview tooltip */}
                  <AnimatePresence>
                    {hoveredItem === `${sectionIdx}-${idx}` && tech.preview && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -40, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-0 top-0 px-4 py-3 rounded-lg text-base whitespace-nowrap pointer-events-none z-50 font-bold ${
                          isDark
                            ? 'bg-gray-900 border-2 border-cyan-500 text-cyan-300'
                            : 'bg-white border-2 border-cyan-600 text-cyan-600 shadow-lg'
                        }`}
                      >
                        {tech.preview}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Integration highlight */}
      <motion.div
        variants={itemVariants}
        className={`mt-8 p-6 rounded-lg text-center border transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50'
            : 'bg-purple-100 border-purple-300'
        }`}
      >
        <p className={`text-lg font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Všechny komponenty jsou <span className="font-bold">integrované a optimalizované</span> pro
          <span className={`font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}> maximální výkon</span> a <span className={`font-bold transition-colors ${
            isDark ? 'text-green-300' : 'text-green-600'
          }`}>bezpečnost</span>
        </p>
      </motion.div>

      {/* Neo4j Graph Visualization Hint */}
      <motion.div
        variants={itemVariants}
        className={`mt-6 p-4 rounded-lg border text-center transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-orange-700/50'
            : 'bg-orange-100 border-orange-300'
        }`}
      >
        <p className={`text-base font-semibold transition-colors ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <span className="font-bold">Neo4j Graph Database:</span> Vizualizace dostupná na
          <span className={`font-bold transition-colors ${
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          }`}> http://localhost:7474</span> (Credentials: neo4j / ac-heating-2024)
        </p>
      </motion.div>
    </motion.div>
  );
}
