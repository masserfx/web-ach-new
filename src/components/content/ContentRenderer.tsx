'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ContentRenderer
 *
 * Renders structured JSONB content from Supabase
 * Supports: headings, paragraphs, lists, images, videos, quotes, code
 *
 * SEO-optimized with proper semantic HTML
 */

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video' | 'quote' | 'code' | 'html';
  level?: number; // For headings (1-6)
  text?: string;
  content?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  language?: string; // For code blocks
}

interface ContentRendererProps {
  content: {
    blocks: ContentBlock[];
  };
  className?: string;
}

export function ContentRenderer({ content, className = '' }: ContentRendererProps) {
  if (!content || !content.blocks) {
    return null;
  }

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      {content.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  const animationDelay = index * 0.05;

  switch (block.type) {
    case 'heading':
      return (
        <HeadingBlock
          level={block.level || 2}
          text={block.text || ''}
          delay={animationDelay}
        />
      );

    case 'paragraph':
      return <ParagraphBlock text={block.text || ''} delay={animationDelay} />;

    case 'list':
      return <ListBlock items={block.items || []} delay={animationDelay} />;

    case 'image':
      return (
        <ImageBlock
          src={block.src || ''}
          alt={block.alt || ''}
          caption={block.caption}
          delay={animationDelay}
        />
      );

    case 'video':
      return <VideoBlock src={block.src || ''} delay={animationDelay} />;

    case 'quote':
      return <QuoteBlock text={block.text || ''} delay={animationDelay} />;

    case 'code':
      return (
        <CodeBlock
          code={block.content || ''}
          language={block.language}
          delay={animationDelay}
        />
      );

    case 'html':
      return (
        <div
          dangerouslySetInnerHTML={{ __html: block.content || '' }}
          className="my-4"
        />
      );

    default:
      return null;
  }
}

// ============================================
// BLOCK COMPONENTS
// ============================================

function HeadingBlock({ level, text, delay }: { level: number; text: string; delay: number }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <Tag className="font-bold text-gray-900 mb-4" id={slugify(text)}>
        {text}
      </Tag>
    </motion.div>
  );
}

function ParagraphBlock({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="text-gray-700 leading-relaxed mb-6"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

function ListBlock({ items, delay }: { items: string[]; delay: number }) {
  return (
    <motion.ul
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="list-disc list-inside space-y-2 mb-6"
    >
      {items.map((item, i) => (
        <li key={i} className="text-gray-700">
          {item}
        </li>
      ))}
    </motion.ul>
  );
}

function ImageBlock({
  src,
  alt,
  caption,
  delay
}: {
  src: string;
  alt: string;
  caption?: string;
  delay: number;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="my-8"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-600 mt-2">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function VideoBlock({ src, delay }: { src: string; delay: number }) {
  // Handle YouTube, Vimeo embeds
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  let embedUrl = src;
  if (isYoutube) {
    const videoId = src.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)?.[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (isVimeo) {
    const videoId = src.match(/vimeo\.com\/(\d+)/)?.[1];
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="my-8"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
}

function QuoteBlock({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="border-l-4 border-brand-primary pl-6 py-4 my-8 italic text-gray-700 text-lg"
    >
      {text}
    </motion.blockquote>
  );
}

function CodeBlock({
  code,
  language,
  delay
}: {
  code: string;
  language?: string;
  delay: number;
}) {
  return (
    <motion.pre
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto my-6"
    >
      <code className={language ? `language-${language}` : ''}>{code}</code>
    </motion.pre>
  );
}

// ============================================
// UTILITIES
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
