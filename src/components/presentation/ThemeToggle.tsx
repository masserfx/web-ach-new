'use client';

import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all ${
        isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }`}
      title={`Přepnout na ${isDark ? 'světlý' : 'tmavý'} režim (T)`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </motion.div>
    </motion.button>
  );
}
