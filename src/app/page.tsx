import { createClient } from '@/lib/supabase/server';
// Black Steel Components (New Design System)
import { BlackSteelHeroSection } from '@/components/home/BlackSteelHeroSection';
import { BlackSteelValuePropsSection } from '@/components/home/BlackSteelValuePropsSection';
import { BlackSteelSocialProofSection } from '@/components/home/BlackSteelSocialProofSection';
import { BlackSteelCTAFooterSection } from '@/components/home/BlackSteelCTAFooterSection';
// Legacy Components (fallback)
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { EnergySavingsCalculator } from '@/components/cro/EnergySavingsCalculator';
import { ObjectionHandler, commonObjections } from '@/components/cro/ObjectionHandler';

async function getLatestBlogPosts() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      id,
      slug,
      title,
      excerpt,
      featured_image,
      published_at,
      reading_time,
      tags
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(6);

  return posts || [];
}

async function getFeaturedProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  return products || [];
}

async function getStats() {
  const supabase = await createClient();

  const { count: blogCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('published', true);

  return {
    articles: blogCount || 0,
    products: productCount || 0,
    installations: 1500,
    experience: 18,
  };
}

export default async function HomePage() {
  const [latestPosts, featuredProducts, stats] = await Promise.all([
    getLatestBlogPosts(),
    getFeaturedProducts(),
    getStats(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AC Heating',
    legalName: 'KUFI INT, s.r.o.',
    url: 'https://www.ac-heating.cz',
    logo: 'https://www.ac-heating.cz/logo.png',
    description: 'KUFI INT s.r.o. - česká firma s více než 18letou tradicí v instalaci tepelných čerpadel a fotovoltaiky. 7500+ domácností po Evropě.',
    foundingDate: '2006-01-01',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Staroplzenecká 177',
      addressLocality: 'Letkov',
      postalCode: '326 00',
      addressCountry: 'CZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420-725-539-825',
      contactType: 'Zákaznické centrum',
      email: 'info@ac-heating.cz',
      areaServed: ['CZ', 'SK', 'EU'],
      availableLanguage: 'cs',
    },
    sameAs: [
      'https://www.facebook.com/ac.heating.cz',
      'https://www.linkedin.com/company/ac-heating',
      'https://www.instagram.com/ac.heating.cz',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-black">
        {/* BLACK STEEL DESIGN SYSTEM */}
        <BlackSteelHeroSection />
        <BlackSteelValuePropsSection />
        <BlackSteelSocialProofSection />
        <BlackSteelCTAFooterSection />

        {/* Legacy Sections (fallback - can be customized or removed) */}
        <section className="bg-carbon py-20">
          <div className="container mx-auto px-4">
            <FeatureGrid />
          </div>
        </section>

        {/* CRO Section: Energy Savings Calculator */}
        <section className="bg-graphite-light py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <EnergySavingsCalculator />
            </div>
          </div>
        </section>

        {/* CRO Section: Objection Handler */}
        <section className="bg-carbon py-20">
          <ObjectionHandler objections={commonObjections} />
        </section>

        {/* Latest Blog Posts */}
        <section className="bg-graphite-light py-20">
          <LatestBlogPosts posts={latestPosts} />
        </section>
      </main>
    </>
  );
}
