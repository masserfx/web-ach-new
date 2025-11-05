import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ContentRenderer } from '@/components/content/ContentRenderer';
import { ShareButton } from '@/components/ShareButton';
import { siteConfig } from '@/lib/site.config';

import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  try {
    const supabase = await createClient();

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select(`*`)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error(`[getBlogPost] Supabase error for slug ${slug}:`, error);
      return null;
    }

    if (!post) {
      console.log(`[getBlogPost] No post found for slug ${slug}`);
      return null;
    }

    console.log(`[getBlogPost] Found post: ${post.title}, featured_image: ${post.featured_image?.substring(0, 60) || 'none'}`);
    return post;
  } catch (err) {
    console.error(`[getBlogPost] Error:`, err);
    return null;
  }
}

export async function generateMetadata(
  { params }: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Článek nenalezen',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.og_image ? [post.og_image] : undefined,
      type: 'article',
      publishedTime: post.published_at,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.tags || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main id="main-content" className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na blog
        </Link>
      </div>

      {/* Hero Section */}
      <article className="container mx-auto px-4 py-12">
        {/* Category Badge */}
        {/* Removed - category relationship not available */}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-steel mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-steel-dim mb-8 leading-relaxed max-w-3xl">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-steel-dim mb-8">
          {/* Author removed - author relationship not available */}

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.published_at}>{publishedDate}</time>
          </div>

          {post.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} min čtení</span>
            </div>
          )}

          <ShareButton
            title={post.title}
            text={post.excerpt || ''}
            url={`${siteConfig.url}/blog/${post.slug}`}
          />
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {post.content && <ContentRenderer content={post.content} />}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-graphite-light/50">
            <h3 className="text-sm font-semibold text-steel-dim uppercase tracking-wide mb-4">
              Štítky
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-graphite text-steel rounded-full text-sm hover:bg-accent/10 hover:text-accent transition-colors cursor-pointer border border-graphite-light/50"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-graphite-light/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-steel">Líbil se vám článek?</h3>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1877F2] text-white rounded-lg font-semibold hover:bg-[#166FE5] transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg font-semibold hover:bg-[#1A91DA] transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0A66C2] text-white rounded-lg font-semibold hover:bg-[#095196] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent-dark transition-colors"
          >
            Zobrazit další články
          </Link>
        </div>
      </article>
    </main>
  );
}
