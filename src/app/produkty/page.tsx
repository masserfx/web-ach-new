import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, TrendingDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Produkty - Tepelná čerpadla a fotovoltaika | AC Heating',
  description: 'Kompletní nabídka tepelných čerpadel Convert NG ONE a fotovoltaických systémů pro rodinné domy, bytové domy a firmy. Vlastní výroba, 18+ let zkušeností.',
  keywords: 'tepelná čerpadla, fotovoltaika, Convert NG ONE, rodinné domy, bytové domy, komunitní energetika',
};

async function getProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('average_price', { ascending: true });

  return products || [];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(price);
};

const getMarketLabel = (market: string) => {
  const labels: Record<string, string> = {
    residential: 'Rodinné domy',
    commercial: 'Bytové domy',
    developer: 'Developeři & Firmy',
    partner: 'Partneři',
  };
  return labels[market] || market;
};

export default async function ProductsPage() {
  const products = await getProducts();

  // Group products by target market
  type Product = typeof products[0];
  const groupedProducts = products.reduce((acc, product) => {
    const market = product.target_market || 'other';
    if (!acc[market]) acc[market] = [];
    acc[market].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Produkty a řešení pro vaši energetickou nezávislost
            </h1>
            <p className="text-xl text-white/90">
              Tepelná čerpadla vlastní výroby, fotovoltaika a komplexní energetická řešení. 
              18+ let zkušeností, 7500+ spokojených zákazníků.
            </p>
          </div>
        </div>
      </div>

      {/* Products by Market */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {Object.entries(groupedProducts).map(([market, marketProducts]) => {
            const products = marketProducts as Product[];
            return (
            <div key={market} className="mb-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">
                  {getMarketLabel(market)}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: Product) => (
                  <Link
                    key={product.id}
                    href={`/produkty/${product.slug}`}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-zinc-200 hover:border-red-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-video bg-zinc-100 overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={800}
                          height={600}
                          loading="lazy"
                          quality={85}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          lang="cs"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl">📦</div>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Doporučujeme
                        </div>
                      )}
                      {product.savings_percentage && (
                        <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Úspora {product.savings_percentage}%
                        </div>
                      )}
                    </div>

                    {/* Product Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="inline-block bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2">
                        <Link 
                          href={`/produkty/${product.slug}`}
                          className="text-zinc-900 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:rounded"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      {product.model && (
                        <p className="text-sm text-zinc-600 mb-3">{product.model}</p>
                      )}

                      <p className="text-zinc-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Key Features */}
                      {product.pros && product.pros.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {product.pros.slice(0, 3).map((pro: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Price */}
                      <div className="mb-4 pt-4 border-t border-zinc-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-zinc-600">od</span>
                          <span className="text-2xl font-bold text-zinc-900">
                            {formatPrice(product.price_min || product.average_price || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="flex items-center justify-between text-xs text-zinc-600 mb-4">
                        {product.warranty_years && (
                          <div className="flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {product.warranty_years} let záruky
                          </div>
                        )}
                        {product.installation_time_days && (
                          <div>{product.installation_time_days} dní instalace</div>
                        )}
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/produkty/${product.slug}`}
                        className="flex items-center justify-between text-red-600 font-semibold hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded"
                      >
                        <span>Zjistit více</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Nevíte, které řešení je pro vás nejvhodnější?
          </h2>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Kontaktujte nás pro nezávaznou konzultaci. Pomůžeme vám vybrat optimální řešení pro vaši situaci.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakt"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Nezávazná konzultace
            </Link>
            <Link
              href="/kalkulacka"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all"
            >
              Online kalkulačka úspor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
