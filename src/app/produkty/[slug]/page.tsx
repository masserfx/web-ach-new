import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShareButton } from '@/components/ShareButton';
import Link from 'next/link';
import { ArrowLeft, Check, X, Download, Mail, Calculator, Clock, Shield, TrendingDown, Phone } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Produkt nenalezen',
    };
  }

  const title = product.meta_title || `${product.name} | AC Heating`;
  const description = product.meta_description || product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images?.[0];
  const formatPrice = (price: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

  // Product Schema.org JSON-LD
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: mainImage?.url,
    brand: {
      '@type': 'Brand',
      name: 'AC Heating',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'AC Heating s.r.o.',
    },
    category: product.category,
    ...(product.model && { mpn: product.model }),
    ...(product.average_price && {
      offers: {
        '@type': 'AggregateOffer',
        url: `https://www.ac-heating.cz/produkty/${product.slug}`,
        priceCurrency: 'CZK',
        lowPrice: product.price_min || product.average_price,
        highPrice: product.price_max || product.average_price,
        price: product.average_price,
        availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    }),
    ...(product.warranty_years && {
      warranty: `P${product.warranty_years}Y`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-zinc-50">
        {/* Breadcrumb & Back */}
        <div className="bg-white border-b border-zinc-200">
          <div className="container mx-auto px-4 py-4">
            <Link 
              href="/produkty" 
              className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na produkty
            </Link>
          </div>
        </div>

        {/* Product Hero */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Product Image */}
              <div className="relative aspect-square bg-zinc-100 rounded-2xl overflow-hidden">
                {mainImage?.url ? (
                  <img 
                    src={mainImage.url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <p>Obrázek produktu</p>
                    </div>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Doporučujeme
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-4">
                  <span className="inline-block bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                  {product.model && (
                    <span className="ml-2 inline-block bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full text-sm">
                      {product.model}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-zinc-900 mb-4">
                  {product.name}
                </h1>

                <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Price */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-baseline gap-3 mb-2">
                    {product.price_min && product.price_max && product.price_min !== product.price_max ? (
                      <>
                        <span className="text-3xl font-bold text-zinc-900">
                          {formatPrice(product.price_min)}
                        </span>
                        <span className="text-zinc-600">–</span>
                        <span className="text-3xl font-bold text-zinc-900">
                          {formatPrice(product.price_max)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-zinc-900">
                        od {formatPrice(product.average_price || product.price_min || 0)}
                      </span>
                    )}
                  </div>
                  {product.savings_percentage && (
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-semibold">Úspora až {product.savings_percentage}% nákladů</span>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {product.warranty_years && (
                    <div className="text-center p-4 bg-zinc-50 rounded-lg">
                      <Shield className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-zinc-900">{product.warranty_years}</div>
                      <div className="text-sm text-zinc-600">let záruky</div>
                    </div>
                  )}
                  {product.installation_time_days && (
                    <div className="text-center p-4 bg-zinc-50 rounded-lg">
                      <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-zinc-900">{product.installation_time_days}</div>
                      <div className="text-sm text-zinc-600">dní instalace</div>
                    </div>
                  )}
                  {product.in_stock && (
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-green-700">Skladem</div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link 
                    href={`/kontakt?product=${product.slug}`}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-center transition-all hover:scale-105"
                  >
                    Nezávazná poptávka
                  </Link>
                  <Link 
                    href="/kontakt?type=callback"
                    className="flex-1 border-2 border-zinc-300 hover:border-red-600 text-zinc-900 px-8 py-4 rounded-xl font-semibold text-center transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Zavolejte mi
                  </Link>
                </div>

                <ShareButton
                  title={product.name}
                  text={product.description}
                  url={`https://ac-heating.cz/produkty/${product.slug}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Pros */}
              {product.pros && product.pros.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    Výhody
                  </h2>
                  <ul className="space-y-3">
                    {product.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {product.cons && product.cons.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <X className="w-6 h-6 text-orange-600" />
                    </div>
                    Co zvážit
                  </h2>
                  <ul className="space-y-3">
                    {product.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.technical_specs && Object.keys(product.technical_specs).length > 0 && (
          <div className="py-16 bg-zinc-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-zinc-900 mb-8">Technické parametry</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <dl className="grid md:grid-cols-2 gap-6">
                  {Object.entries(product.technical_specs).map(([key, value]) => (
                    <div key={key} className="border-b border-zinc-100 pb-4">
                      <dt className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-lg font-medium text-zinc-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Subsidies & Financing */}
        {(product.subsidies || product.financing_options) && (
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Subsidies */}
                {product.subsidies && Object.keys(product.subsidies).length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4">Dotace</h3>
                    <ul className="space-y-3">
                      {Object.entries(product.subsidies).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-zinc-900">{key.replace(/_/g, ' ')}</div>
                            <div className="text-zinc-700">{String(value)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Financing */}
                {product.financing_options && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4">Financování</h3>
                    <ul className="space-y-3">
                      {Object.entries(product.financing_options).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold text-zinc-900 capitalize">{key}</div>
                            <div className="text-zinc-700">{typeof value === 'boolean' ? (value ? 'Ano' : 'Ne') : String(value)}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="py-16 bg-gradient-to-br from-red-600 to-orange-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Máte zájem o {product.name}?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Kontaktujte nás pro nezávaznou konzultaci a cenovou nabídku na míru.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/kontakt?product=${product.slug}`}
                className="bg-white text-red-600 hover:bg-zinc-100 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Nezávazná poptávka
              </Link>
              <Link 
                href="/kontakt?type=callback"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Zavolejte mi zpět
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
