import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlackSteelPageLayout } from '@/components/layout/BlackSteelPageLayout';
import { ProductsContent } from '@/components/products/ProductsContent';

export const metadata: Metadata = {
  title: 'Produkty - Tepelná čerpadla Convert NG One a fotovoltaika | AC Heating',
  description: 'Kompletní nabídka tepelných čerpadel Convert NG One (6-28 kW) a fotovoltaických systémů. Profesionální instalace s 7 lety záruky. SCOP až 5.4, tichý provoz, ekologická chladiva R290/R32.',
  keywords: 'tepelná čerpadla Convert, NG One, fotovoltaika, vzduch-voda, instalace, AC Heating, SCOP, R290, R32, úspora energie',
  openGraph: {
    title: 'Produkty - Tepelná čerpadla a fotovoltaika | AC Heating',
    description: 'Kompletní nabídka tepelných čerpadel Convert NG One (6-28 kW) a fotovoltaických systémů s profesionální instalací a 7 lety záruky.',
    type: 'website',
    url: 'https://www.ac-heating.cz/produkty',
    images: [
      {
        url: '/images/products/ng-one.webp',
        width: 800,
        height: 800,
        alt: 'Convert NG One tepelné čerpadlo',
      },
    ],
  },
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
