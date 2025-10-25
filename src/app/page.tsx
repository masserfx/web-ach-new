import { createClient } from '@/lib/supabase/server';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { StatsSection } from '@/components/home/StatsSection';

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <HeroSection />
      <FeatureGrid />
      <StatsSection stats={stats} />
      <LatestBlogPosts posts={latestPosts} />
      <FeaturedProducts products={featuredProducts} />
    </main>
  );
}
