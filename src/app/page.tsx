import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { StatsSection } from '@/components/home/StatsSection';
import { Testimonials } from '@/components/home/Testimonials';
import { InstallationProcess } from '@/components/home/InstallationProcess';
import { Certifications } from '@/components/home/Certifications';

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
    installations: 1000,
    experience: 20,
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
    name: 'AC Heating s.r.o.',
    legalName: 'AC Heating s.r.o.',
    url: 'https://www.ac-heating.cz',
    logo: 'https://www.ac-heating.cz/logo.png',
    description: 'Česká firma s vlastním vývojem, výrobou a servisem tepelných čerpadel. 20 let zkušeností, 7 let záruka, pokrytí celé ČR.',
    foundingDate: '2004',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420-123-456-789',
      contactType: 'Zákaznické centrum',
      email: 'info@ac-heating.cz',
      areaServed: 'CZ',
      availableLanguage: 'cs',
    },
    sameAs: [
      'https://www.facebook.com/ac-heating',
      'https://www.linkedin.com/company/ac-heating',
      'https://www.instagram.com/ac-heating',
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
        <Testimonials />
        <Certifications />
        <StatsSection stats={stats} />
        <LatestBlogPosts posts={latestPosts} />
      </main>
    </>
  );
}
