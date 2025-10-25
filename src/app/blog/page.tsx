import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogPostCard } from '@/components/content/BlogPostCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - AC Heating',
  description: 'Články o tepelných čerpadlech, fotovoltaice a úsporách energií.',
};

async function getBlogPosts() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:categories(slug, name)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return posts || [];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Back to Home */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na homepage
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent">
              Náš blog
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Objevte novinky z oblasti tepelných čerpadel, fotovoltaiky a úspor energií.
            Praktické rady, tipy a zkušenosti z realizací.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-primary mb-2">{posts.length}</div>
            <div className="text-sm text-gray-600">Článků</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-secondary mb-2">20+</div>
            <div className="text-sm text-gray-600">Let zkušeností</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-accent mb-2">1000+</div>
            <div className="text-sm text-gray-600">Instalací</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-brand-primary mb-2">30+</div>
            <div className="text-sm text-gray-600">Produktů</div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Zatím nejsou k dispozici žádné články.</p>
            <Link
              href="/"
              className="mt-6 inline-block px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition-colors"
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
              className="px-8 py-4 bg-white border-2 border-brand-primary text-brand-primary rounded-xl font-semibold hover:bg-brand-primary/5 transition-colors"
            >
              Načíst další články
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
