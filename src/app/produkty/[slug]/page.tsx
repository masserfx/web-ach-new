import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ShareButton } from '@/components/ShareButton';
import Image from 'next/image';
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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/produkty"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors"
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
            <span className="inline-block px-4 py-1 bg-brand-primary text-white text-sm font-semibold rounded-full capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div>
              {/* Main Image */}
              {mainImage && (
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 mb-6">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt || product.name}
                    fill
                    priority
                    className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}

              {/* Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image: any, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-brand-primary transition-all"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `${product.name} ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div>
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Model */}
              {product.model && (
                <p className="text-xl text-gray-600 mb-6">
                  Model: <span className="font-semibold">{product.model}</span>
                </p>
              )}

              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Klíčové vlastnosti</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-brand-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Technické parametry</h2>
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {product.price_from && (
                <div className="mb-8 p-6 bg-gradient-to-r from-brand-primary to-brand-accent rounded-xl text-white">
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
                  className="flex-1 px-6 py-4 bg-brand-primary text-white rounded-xl font-semibold text-center hover:bg-brand-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Nezávazná poptávka
                </Link>
                <Link
                  href="/kontakt"
                  className="flex-1 px-6 py-4 border-2 border-brand-primary text-brand-primary rounded-xl font-semibold text-center hover:bg-brand-primary/5 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Kontaktovat
                </Link>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ShareButton
                  title={product.name}
                  text={product.description || ''}
                  url={`http://91.99.126.53:3100/produkty/${product.slug}`}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {product.content && (
            <div className="mt-16 max-w-4xl mx-auto prose prose-lg">
              <div dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
          )}

          {/* Related Products */}
          <div className="mt-16 text-center">
            <Link
              href="/produkty"
              className="inline-block px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
            >
              Zobrazit další produkty
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
