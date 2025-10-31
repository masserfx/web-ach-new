import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlackSteelPageLayout } from '@/components/layout/BlackSteelPageLayout';
import { ProductsContent } from '@/components/products/ProductsContent';

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

  return (
    <BlackSteelPageLayout
      title="Naše produkty"
      subtitle="Moderní tepelná čerpadla a fotovoltaické systémy pro váš domov či firmu. Kvalita, spolehlivost a úspora energií."
      fullWidth={true}
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
        <ProductsContent products={products} />
      </div>
    </BlackSteelPageLayout>
  );
}
