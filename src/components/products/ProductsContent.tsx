'use client';

import { motion } from 'framer-motion';
import { ProductCard, ProductCardProps } from '@/components/content/ProductCard';
import { FeaturedProductHero } from './FeaturedProductHero';
import { ProductFilter } from './ProductFilter';
import Link from 'next/link';

// Use ProductCardProps type for consistency
interface Product extends ProductCardProps {
  features?: string[];
  price_from?: number;
  featured?: boolean;
  specifications?: any;
  images?: any;
}

interface ProductsContentProps {
  products: Product[];
}

export function ProductsContent({ products }: ProductsContentProps) {
  // Find featured product (CONVERT NG ONE with slug 'produkty')
  const featuredProduct = products.find(p => p.slug === 'produkty');

  // Filter out the featured product from the grid
  const gridProducts = products.filter(p => p.slug !== 'produkty');

  // Group by category
  const categories = Array.from(new Set(gridProducts.map(p => p.category)));

  return (
    <>
      {/* Featured Product Hero */}
      {featuredProduct && (
        <div className="mb-20">
          <FeaturedProductHero product={featuredProduct} />
        </div>
      )}

      {/* Product Filter */}
      <ProductFilter />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          viewport={{ once: true }}
          className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-xl border border-graphite-light/50"
        >
          <div className="text-3xl font-bold text-accent mb-2">{gridProducts.length}</div>
          <div className="text-sm text-steel-dim">Produktů</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-xl border border-graphite-light/50"
        >
          <div className="text-3xl font-bold text-accent mb-2">{categories.length}</div>
          <div className="text-sm text-steel-dim">Kategorií</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-xl border border-graphite-light/50"
        >
          <div className="text-3xl font-bold text-accent mb-2">20+</div>
          <div className="text-sm text-steel-dim">Let zkušeností</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-xl border border-graphite-light/50"
        >
          <div className="text-3xl font-bold text-accent mb-2">1000+</div>
          <div className="text-sm text-steel-dim">Instalací</div>
        </motion.div>
      </div>

      {/* Products by Category */}
      {gridProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-steel-dim">Zatím nejsou k dispozici žádné produkty.</p>
          <Link
            href="/"
            className="mt-6 inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            Zpět na homepage
          </Link>
        </div>
      ) : (
        <div className="space-y-16 w-full">
          {categories.map((category, categoryIndex) => {
            const categoryProducts = gridProducts.filter(p => p.category === category);

            return (
              <div key={category} className="w-full">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold mb-8 text-steel capitalize"
                >
                  {category.replace('-', ' ')}
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                  {categoryProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
