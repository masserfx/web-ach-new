import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogPostCard } from '@/components/content/BlogPostCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Novinky - AC Heating',
  description: 'Nejnovější novinky a články o tepelných čerpadlech, fotovoltaice, regulaci a úsporách energií.',
  openGraph: {
    title: 'Novinky - AC Heating',
    description: 'Nejnovější novinky a články ze světa tepelných čerpadel a fotovoltaiky.',
    type: 'website',
  },
};

async function getLatestNews() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:categories(slug, name)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return posts || [];
}

export default async function NewsPage() {
  const posts = await getLatestNews();

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-carbon via-graphite to-carbon py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-steel mb-6 leading-tight">
              Novinky
            </h1>
            <p className="text-xl md:text-2xl text-steel-dim leading-relaxed">
              Nejnovější články a novinky o tepelných čerpadlech, fotovoltaice a energetických řešeních.
              Sledujte trendy v oblasti vytápění a čistých energií.
            </p>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-steel">
            Poslední novinky
          </h2>

          {posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
                >
                  Všechny články
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-steel-dim text-lg mb-6">
                V tuto chvíli nejsou dostupné žádné články.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-dark transition-all"
              >
                Podívejte se na Blog
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent to-accent-dark py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Chcete vědět více?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Čtěte naše články a buďte v trendu. Najdete tu odpovědi na vaše otázky o
            tepelných čerpadlech, fotovoltaice a energetických řešeních.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-10 py-5 bg-white text-accent rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Všechny články
            </Link>
            <Link
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-graphite text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-carbon transition-all border-2 border-white/20"
            >
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
