'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/content/ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  model: string;
  category: string;
  description: string;
  images?: string[];
  features?: string[];
  price_from?: number;
  featured?: boolean;
}

interface ProductsContentProps {
  products: Product[];
}

export function ProductsContent({ products }: ProductsContentProps) {
  // Group by category
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0 }}
          viewport={{ once: true }}
          className="text-center p-6 bg-gradient-to-br from-graphite to-graphite-light rounded-xl border border-graphite-light/50"
        >
          <div className="text-3xl font-bold text-accent mb-2">{products.length}</div>
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
      {products.length === 0 ? (
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
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => {
            const categoryProducts = products.filter(p => p.category === category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-8 text-steel capitalize">
                  {category.replace('-', ' ')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
