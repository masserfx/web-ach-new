import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/content/ProductCard';
import { BlackSteelPageLayout } from '@/components/layout/BlackSteelPageLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Produkty - AC Heating',
  description: 'Tepelná čerpadla a fotovoltaické systémy od AC Heating.',
};

async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  // Group by category
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <BlackSteelPageLayout
      title="Naše produkty"
      subtitle="Moderní tepelná čerpadla a fotovoltaické systémy pro váš domov či firmu. Kvalita, spolehlivost a úspora energií."
    >
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
                      <ProductCard
                        product={{
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          model: product.model,
                          category: product.category,
                          description: product.description,
                          images: product.images,
                          features: product.features,
                          price_from: product.price_from,
                          featured: product.featured,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </BlackSteelPageLayout>
  );
}
