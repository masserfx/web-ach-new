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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Novinky
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Nejnovější články a novinky o tepelných čerpadlech, fotovoltaice a energetických řešeních.
              Sledujte trendy v oblasti vytápění a čistých energií.
            </p>
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
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
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
                >
                  Všechny články
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">
                V tuto chvíli nejsou dostupné žádné články.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all"
              >
                Podívejte se na Blog
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
        <div className="container mx-auto px-4 text-center">
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
              className="px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Všechny články
            </Link>
            <Link
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-brand-primary/20 text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white/20 transition-all"
            >
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
