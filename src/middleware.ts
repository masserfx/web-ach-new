import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware pro správu redirectů bez chains
 * Eliminuje 43 redirect chains identifikovaných v SEO auditu
 */

// Mapa redirectů - single hop, ne chains
const redirects: Record<string, string> = {
  // Přidat specifické redirecty z SEO auditu
  // Formát: '/stara-url': '/nova-url'
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Direct 301 redirect bez chains
  if (redirects[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = redirects[pathname];
    return NextResponse.redirect(url, 301);
  }

  // Normalizace trailing slash - preferujeme bez trailing slash
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // Lowercase URLs pro konzistenci
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Konfigurace matcheru - na které cesty se middleware aplikuje
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
