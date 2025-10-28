import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[200px] font-black bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Stránka nebyla nalezena
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Zpět na homepage
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary border-2 border-brand-primary rounded-xl font-bold hover:bg-brand-primary hover:text-white transition-all"
            >
              <Search className="w-5 h-5" />
              Prozkoumat blog
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Populární stránky:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/produkty"
                className="text-brand-primary hover:text-brand-primary/80 font-medium"
              >
                Produkty
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/o-nas"
                className="text-brand-primary hover:text-brand-primary/80 font-medium"
              >
                O nás
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/kontakt"
                className="text-brand-primary hover:text-brand-primary/80 font-medium"
              >
                Kontakt
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/faq"
                className="text-brand-primary hover:text-brand-primary/80 font-medium"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
