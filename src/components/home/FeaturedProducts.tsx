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
    <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Naše produkty
          </span>
        </h2>
        <p className="text-xl text-gray-600">
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
        <Link
          href="/produkty"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-secondary text-white rounded-xl font-semibold hover:bg-brand-secondary/90 transition-colors"
        >
          Zobrazit všechny produkty
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const mainImage = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
    >
      {/* Image */}
      <Link href={`/produkty/${product.slug}`} className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-6xl">🏷️</span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-sm text-brand-primary font-semibold mb-2 uppercase tracking-wide">
          {product.category.replace('-', ' ')}
        </div>

        {/* Name */}
        <Link href={`/produkty/${product.slug}`}>
          <h3 className="text-2xl font-bold mb-1 text-gray-900 group-hover:text-brand-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Model */}
        {product.model && (
          <p className="text-gray-600 text-sm mb-3">
            Model: {product.model}
          </p>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-brand-secondary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        {product.price_from && (
          <div className="mb-4">
            <span className="text-2xl font-bold text-brand-primary">
              od {product.price_from.toLocaleString('cs-CZ')} Kč
            </span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/produkty/${product.slug}`}
          className="block w-full px-4 py-3 bg-brand-primary text-white rounded-lg font-semibold text-center hover:bg-brand-primary/90 transition-colors"
        >
          Detail produktu
        </Link>
      </div>
    </motion.div>
  );
}
