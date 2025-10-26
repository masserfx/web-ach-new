import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { StatsSection } from '@/components/home/StatsSection';
import { Testimonials } from '@/components/home/Testimonials';
import { InstallationProcess } from '@/components/home/InstallationProcess';
import { Certifications } from '@/components/home/Certifications';
import { EnergySavingsCalculator } from '@/components/cro/EnergySavingsCalculator';
import { ObjectionHandler, commonObjections } from '@/components/cro/ObjectionHandler';
import { SocialProofSection, TrustBadges } from '@/components/cro/SocialProof';

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
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        <HeroSection />
        <FeatureGrid />
        <InstallationProcess />
        <FeaturedProducts products={featuredProducts} />
        <TrustBadges />

        {/* CRO Section: Energy Savings Calculator */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <EnergySavingsCalculator />
          </div>
        </section>

        <Testimonials />
        <Certifications />
        <StatsSection stats={stats} />

        {/* CRO Section: Objection Handler */}
        <section className="bg-gray-50">
          <ObjectionHandler objections={commonObjections} />
        </section>

        <LatestBlogPosts posts={latestPosts} />
      </main>
    </>
  );
}
