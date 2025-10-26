'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/blog');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/blog');
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hledat články podle názvu, obsahu nebo tagů..."
          className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-brand-primary focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Vymazat vyhledávání"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>
      {query && (
        <p className="text-sm text-gray-600 mt-2">
          Hledám: <strong>"{query}"</strong>
        </p>
      )}
    </form>
  );
}
