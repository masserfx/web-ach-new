'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

export interface BlogPostCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  category?: {
    slug: string;
    name: string;
  };
  tags?: string[];
  published_at: string;
  reading_time?: number;
  author_name?: string;
}

export function BlogPostCard({ post }: { post: BlogPostCardProps }) {
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
    >
      {/* Featured Image */}
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-gray-100">
          <Image src={post.featured_image} alt={post.title} width={800} height={600} loading="lazy" quality={85} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" lang="cs" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-brand-primary text-white text-sm font-semibold rounded-full">
                {post.category.name}
              </span>
            </div>
          )}
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
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
          <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
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
