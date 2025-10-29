import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShareButton } from '@/components/ShareButton';
import { siteConfig } from '@/lib/site.config';
import Link from 'next/link';
import { ArrowLeft, Check, Download, Mail } from 'lucide-react';

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

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images?.[0];

  return (
    <main className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/produkty"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na produkty
        </Link>
      </div>

      {/* Product Detail */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 bg-accent text-white text-sm font-semibold rounded-full capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              {mainImage && (
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-graphite to-carbon mb-6 border border-graphite-light/50">
                  <img src={mainImage.url} alt={mainImage.alt || product.name} className="w-full h-full object-contain" />
                </div>
              )}

              {/* Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image: any, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-graphite cursor-pointer hover:ring-2 hover:ring-accent transition-all border border-graphite-light/50"
                    >
                      <img src={image.url}
                        alt={image.alt || `${product.name} ${index + 2}`} className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div>
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-steel mb-4">
                {product.name}
              </h1>

              {/* Model */}
              {product.model && (
                <p className="text-xl text-steel-dim mb-6">
                  Model: <span className="font-semibold text-steel">{product.model}</span>
                </p>
              )}

              {/* Description */}
              <p className="text-lg text-steel-dim mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-steel">Klíčové vlastnosti</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-steel-dim">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="mb-8 p-6 bg-graphite rounded-xl shadow-lg border border-graphite-light/50">
                  <h2 className="text-2xl font-bold mb-4 text-steel">Technické parametry</h2>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-graphite-light/50 last:border-0">
                        <span className="text-steel-dim capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-steel">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {product.price_from && (
                <div className="mb-8 p-6 bg-gradient-to-r from-accent to-accent-dark rounded-xl text-white shadow-lg border border-accent/30">
                  <div className="text-sm opacity-90 mb-1">Cena od</div>
                  <div className="text-4xl font-bold">
                    {product.price_from.toLocaleString('cs-CZ')} Kč
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pripravit-rozpocet"
                  className="flex-1 px-6 py-4 bg-accent text-white rounded-xl font-semibold text-center hover:bg-accent-dark transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Nezávazná poptávka
                </Link>
                <Link
                  href="/kontakt"
                  className="flex-1 px-6 py-4 border-2 border-accent text-accent rounded-xl font-semibold text-center hover:bg-accent hover:text-white transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Kontaktovat
                </Link>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-graphite-light/50">
                <ShareButton
                  title={product.name}
                  text={product.description || ''}
                  url={`${siteConfig.url}/produkty/${product.slug}`}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {product.content && (
            <div className="mt-16 max-w-4xl mx-auto prose prose-lg prose-invert">
              <div dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          )}

          {/* Related Products */}
          <div className="mt-16 text-center">
            <Link
              href="/produkty"
              className="inline-block px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors"
            >
              Zobrazit další produkty
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
