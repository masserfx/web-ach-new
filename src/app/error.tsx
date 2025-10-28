'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-carbon via-graphite to-carbon flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white mb-6">
            <AlertCircle className="w-16 h-16" />
          </div>

          {/* Message */}
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Něco se pokazilo
          </h1>
          <p className="text-xl text-steel-dim mb-8">
            Omlouváme se, ale došlo k neočekávané chybě. Zkuste to prosím znovu.
          </p>

          {/* Error Details (dev only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-left">
              <p className="text-sm text-red-800 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Zkusit znovu
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-carbon text-accent border-2 border-accent rounded-xl font-bold hover:bg-accent hover:text-white transition-all"
            >
              <Home className="w-5 h-5" />
              Zpět na homepage
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-graphite">
            <p className="text-sm text-steel-dim mb-2">
              Pokud problém přetrvává, kontaktujte nás:
            </p>
            <a
              href="mailto:info@ac-heating.cz"
              className="text-accent hover:text-accent/80 font-medium"
            >
              info@ac-heating.cz
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
