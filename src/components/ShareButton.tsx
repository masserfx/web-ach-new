'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title,
        text,
        url,
      }).catch((error) => {
        console.log('Share failed:', error);
      });
    }
  };

  return (
    <button
      type="button"
      className="flex items-center gap-2 hover:text-brand-primary transition-colors"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4" />
      Sdílet
    </button>
  );
}
