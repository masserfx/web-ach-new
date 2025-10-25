import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/content/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back to Home */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na homepage
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">
              Naše produkty
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Moderní tepelná čerpadla a fotovoltaické systémy pro váš domov či firmu.
            Kvalita, spolehlivost a úspora energií.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-primary mb-2">{products.length}</div>
            <div className="text-sm text-gray-600">Produktů</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-secondary mb-2">{categories.length}</div>
            <div className="text-sm text-gray-600">Kategorií</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-accent mb-2">20+</div>
            <div className="text-sm text-gray-600">Let zkušeností</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-primary mb-2">1000+</div>
            <div className="text-sm text-gray-600">Instalací</div>
          </div>
        </div>

        {/* Products by Category */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Zatím nejsou k dispozici žádné produkty.</p>
            <Link
              href="/"
              className="mt-6 inline-block px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              Zpět na homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => {
              const categoryProducts = products.filter(p => p.category === category);

              return (
                <div key={category}>
                  <h2 className="text-3xl font-bold mb-8 capitalize">
                    {category.replace('-', ' ')}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
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
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
