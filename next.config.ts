import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16)
  turbopack: {},

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90], // Added 90 for hero images
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/**',
      },
      {
        protocol: 'http',
        hostname: '91.99.126.53',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '91.99.126.53',
        port: '3100',
        pathname: '/**',
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http://localhost:54321 http://91.99.126.53:8080 http://91.99.126.53:54321; font-src 'self' data:; connect-src 'self' https: http://localhost:54321 http://91.99.126.53:8080 http://91.99.126.53:54321 wss: ws:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
