'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  model?: string;
  category: string;
  description: string;
  images?: any;
  features?: string[];
  price_from?: number;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-carbon via-graphite/30 to-carbon">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
            Naše produkty
          </span>
        </h2>
        <p className="text-xl text-steel-dim font-medium">
          Tepelná čerpadla vyráběná v České republice
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-accent-dark to-green-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-secondary/30 transition-all"
          >
            Zobrazit všechny produkty
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const mainImage = product.images?.[0];

  const categoryColors: Record<string, string> = {
    'tepelna-cerpadla': 'from-brand-accent to-orange-600',
    'fotovoltaika': 'from-yellow-500 to-amber-600',
    'regulace': 'from-accent-dark to-green-600',
    'default': 'from-accent to-amber-700'
  };

  const categoryGradient = categoryColors[product.category] || categoryColors['default'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group bg-carbon rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all border-2 border-accent/10"
    >
      {/* Category badge */}
      <div className={`absolute top-4 right-4 z-10 px-4 py-2 bg-gradient-to-r ${categoryGradient} text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-lg`}>
        {product.category.replace('-', ' ')}
      </div>

      {/* Image */}
      <Link href={`/produkty/${product.slug}`} className="block relative aspect-square bg-gradient-to-br from-graphite-light to-graphite overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-steel-dim">
            <span className="text-6xl">🏷️</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${categoryGradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
      </Link>

      {/* Content */}
      <div className="relative p-6">
        {/* Name */}
        <Link href={`/produkty/${product.slug}`}>
          <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Model */}
        {product.model && (
          <p className="text-steel-dim text-sm font-medium mb-3">
            Model: {product.model}
          </p>
        )}

        {/* Description */}
        <p className="text-steel-dim mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-steel">
                <Check className="w-4 h-4 text-accent-dark mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        {product.price_from && (
          <div className="mb-4">
            <span className={`text-2xl font-black bg-gradient-to-r ${categoryGradient} bg-clip-text text-transparent`}>
              od {product.price_from.toLocaleString('cs-CZ')} Kč
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/produkty/${product.slug}`}
          className={`block w-full px-4 py-3 bg-gradient-to-r ${categoryGradient} text-white rounded-xl font-bold text-center shadow-lg hover:shadow-xl transition-all`}
        >
          Detail produktu
        </Link>

        {/* Decorative element */}
        <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br ${categoryGradient} rounded-full opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`} />
      </div>
    </motion.div>
  );
}
