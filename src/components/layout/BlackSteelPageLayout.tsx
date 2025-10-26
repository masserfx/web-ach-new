'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BlackSteelPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function BlackSteelPageLayout({
  title,
  subtitle,
  children,
  fullWidth = false,
}: BlackSteelPageLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Page Header with Black Steel Design */}
      <div className="relative overflow-hidden bg-gradient-to-b from-carbon via-graphite to-carbon py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-steel mb-4 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-steel-dim max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className={fullWidth ? '' : 'bg-black'}>
        <div className={fullWidth ? '' : 'max-w-7xl mx-auto px-6 md:px-12 py-20'}>
          {children}
        </div>
      </div>
    </div>
  );
}
