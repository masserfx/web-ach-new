import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'AC Heating - Tepelná čerpadla a fotovoltaika | 18+ let zkušeností, 7500+ instalací',
  description: 'Profesionální instalace tepelných čerpadel Convert NG One a fotovoltaiky v ČR a SR. Česká firma s 18letou tradicí, 7500+ spokojených zákazníků, 7 let záruky. Ušetřete až 70% na vytápění.',
  keywords: 'tepelná čerpadla, fotovoltaika, Convert NG One, AC Heating, úspora energie, vytápění, instalace tepelných čerpadel',
  openGraph: {
    title: 'AC Heating - Tepelná čerpadla bez kompromisů | Convert NG One',
    description: 'Profesionální instalace tepelných čerpadel Convert NG One a fotovoltaiky. 18+ let zkušeností, 7500+ instalací, 7 let záruky. Ušetřete až 70% na vytápění.',
    type: 'website',
    url: 'https://www.ac-heating.cz',
    images: [
      {
        url: '/images/hero-ng-one-fullhd.webp',
        width: 1920,
        height: 1080,
        alt: 'AC Heating Convert NG One tepelné čerpadlo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AC Heating - Tepelná čerpadla a fotovoltaika',
    description: 'Profesionální instalace tepelných čerpadel Convert NG One. 18+ let zkušeností, 7500+ instalací, 7 let záruky.',
    images: ['/images/hero-ng-one-fullhd.webp'],
  },
};

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
    .eq('featured', true)
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
      <main id="main-content" className="min-h-screen bg-black">
        {/* BLACK STEEL DESIGN SYSTEM */}
        <BlackSteelHeroSection />
        <BlackSteelValuePropsSection />
        <BlackSteelSocialProofSection />
        <BlackSteelCTAFooterSection />

        {/* Legacy Sections (fallback - can be customized or removed) */}
        <section className="bg-carbon py-20" aria-labelledby="services-heading">
          <div className="container mx-auto px-4">
            <h2 id="services-heading" className="sr-only">Naše služby</h2>
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
        <section className="bg-carbon py-20" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="sr-only">Často kladené otázky</h2>
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
