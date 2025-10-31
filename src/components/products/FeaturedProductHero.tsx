'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Download, Mail } from 'lucide-react';

interface FeaturedProductHeroProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    features?: any;
    specifications?: any;
    images?: any;
  };
}

export function FeaturedProductHero({ product }: FeaturedProductHeroProps) {
  const mainImage = product.images?.[0];
  const features = Array.isArray(product.features) ? product.features.slice(0, 4) : [];
  const scop = product.specifications?.scop || '5.4';

  return (
    <div className="relative mb-20 overflow-hidden">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block mb-6"
      >
        <div className="px-6 py-2 bg-gradient-to-r from-accent to-accent-dark text-white rounded-full font-bold text-sm tracking-wider">
          NOVINKA
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-steel">
            {product.name}
          </h1>
          <p className="text-2xl text-steel-dim mb-8 leading-relaxed">
            Tepelné čerpadlo bez kompromisů mezi výkonem a designem
          </p>

          {/* Features */}
          {features.length > 0 && (
            <ul className="space-y-4 mb-10">
              {features.map((feature: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Check className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-lg text-steel-dim">{feature}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href={`/produkty/${product.slug}`}
              className="px-8 py-4 bg-accent text-white rounded-xl font-semibold text-lg hover:bg-accent-dark transition-colors inline-flex items-center justify-center gap-2"
            >
              DETAIL ČERPADLA
            </Link>
            <Link
              href="/pripravit-rozpocet"
              className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-semibold text-lg hover:bg-accent hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              CHCI NABÍDKU
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Product Image + Badges */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Main Image */}
          {mainImage && (
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-graphite via-graphite-light to-carbon border border-graphite-light/50 shadow-2xl">
              <img
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                className="w-full h-full object-contain p-8"
              />

              {/* Floating Badges */}
              <div className="absolute top-6 right-6 space-y-3">
                {/* Energy Class Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg text-center"
                >
                  <div className="text-3xl font-bold text-green-600">A+++</div>
                  <div className="text-xs text-gray-600 mt-1">Třída</div>
                </motion.div>

                {/* Refrigerant Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg text-center"
                >
                  <div className="text-sm font-bold text-green-600">Ekologické</div>
                  <div className="text-sm font-bold text-green-600">chladivo</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">R290</div>
                </motion.div>

                {/* SCOP Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg text-center"
                >
                  <div className="text-xs text-gray-600 mb-1">SCOP</div>
                  <div className="text-3xl font-bold text-accent">{scop}</div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
