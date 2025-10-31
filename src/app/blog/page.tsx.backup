import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogPostCard } from '@/components/content/BlogPostCard';
import { SearchBar } from '@/components/blog/SearchBar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Blog - AC Heating',
  description: 'Články o tepelných čerpadlech, fotovoltaice a úsporách energií.',
};

async function getBlogPosts(searchQuery?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:categories(slug, name)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50);

  // Add search if query exists
  if (searchQuery && searchQuery.trim()) {
    query = query.textSearch('search_text', searchQuery.trim());
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return posts || [];
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const posts = await getBlogPosts(params.q);

  return (
    <main className="min-h-screen bg-black">
      {/* Back to Home */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na homepage
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carbon via-graphite to-carbon py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-steel mb-6 leading-tight">
              Náš blog
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim mb-8">
              Objevte novinky z oblasti tepelných čerpadel, fotovoltaiky a úspor energií.
              Praktické rady, tipy a zkušenosti z realizací.
            </p>

            {/* Search Bar */}
            <Suspense fallback={<div className="h-16" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">{posts.length}</div>
            <div className="text-sm text-steel-dim">Článků</div>
          </div>
          <div className="text-center p-6 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">20+</div>
            <div className="text-sm text-steel-dim">Let zkušeností</div>
          </div>
          <div className="text-center p-6 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">1000+</div>
            <div className="text-sm text-steel-dim">Instalací</div>
          </div>
          <div className="text-center p-6 bg-graphite rounded-2xl border border-graphite-light/50 hover:border-accent/50 transition-all">
            <div className="text-3xl font-bold text-accent mb-2">30+</div>
            <div className="text-sm text-steel-dim">Produktů</div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-steel-dim">Zatím nejsou k dispozici žádné články.</p>
            <Link
              href="/"
              className="mt-6 inline-block px-8 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
            >
              Zpět na homepage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Load More (for future implementation) */}
        {posts.length >= 50 && (
          <div className="mt-12 text-center">
            <button
              type="button"
              className="px-8 py-4 bg-graphite border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:text-white transition-colors"
            >
              Načíst další články
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
