'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  reading_time?: number;
  tags?: string[];
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Nejnovější články
          </span>
        </h2>
        <p className="text-xl text-gray-600">
          Tipy, rady a novinky ze světa tepelných čerpadel a fotovoltaiky
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {posts.map((post, index) => (
          <BlogPostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
        >
          Zobrazit všechny články
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const publishedDate = new Date(post.published_at).toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
    >
      {/* Image */}
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {publishedDate}
          </span>
          {post.reading_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} min
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:gap-3 transition-all"
        >
          Číst více
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.article>
  );
}
