'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ExternalLink, Download } from 'lucide-react';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  model?: string;
  category: string;
  description: string;
  images?: {
    url: string;
    alt?: string;
  }[];
  features?: string[];
  price_from?: number;
  featured?: boolean;
}

export function ProductCard({ product }: { product: ProductCardProps }) {
  const mainImage = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
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

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-brand-accent text-white text-sm font-bold rounded-full shadow-lg">
              DOPORUČUJEME
            </span>
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
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
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

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/produkty/${product.slug}`}
            className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-lg font-semibold text-center hover:bg-brand-primary/90 transition-colors inline-flex items-center justify-center gap-2"
          >
            Detail produktu
            <ExternalLink className="w-4 h-4" />
          </Link>

          <Link
            href="/pripravit-rozpocet"
            className="px-4 py-3 border-2 border-brand-primary text-brand-primary rounded-lg font-semibold hover:bg-brand-primary/5 transition-colors inline-flex items-center gap-2"
            title="Nezávazná poptávka"
          >
            <Download className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
