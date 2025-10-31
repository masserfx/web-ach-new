'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface PresentationSlideProps {
  children: React.ReactNode;
  slideNumber: number;
  totalSlides: number;
  title: string;
  isDark?: boolean;
}

export default function PresentationSlide({
  children,
  slideNumber,
  totalSlides,
  title,
  isDark = true,
}: PresentationSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`w-full h-full flex flex-col justify-between p-16 overflow-hidden transition-colors duration-300 ${
        isDark ? 'border-gray-700' : 'border-gray-300'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between border-b pb-8 mb-12 transition-colors duration-300 ${
        isDark ? 'border-gray-600' : 'border-gray-300'
      }`}>
        <div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <div className={`text-right transition-colors duration-300 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <p className="text-2xl font-bold">{slideNumber} / {totalSlides}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        {children}
      </div>

      {/* Footer */}
      <div className={`mt-12 pt-6 border-t transition-colors duration-300 ${
        isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
      }`}>
        <p className="text-base font-semibold">
          AC Heating Web Transition • Prezentace pro vedení • 2025
        </p>
      </div>
    </motion.div>
  );
}
