import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AC Heating - Tepelná čerpadla a fotovoltaika | 7 let záruka',
    template: '%s | AC Heating',
  },
  description: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let. Jsme česká firma s vlastním vývojem i výrobou. Pokrytí celé ČR. 7 let záruka, 1000+ instalací.',
  keywords: [
    'tepelná čerpadla',
    'fotovoltaika',
    'vytápění',
    'AC Heating',
    'úspora energie',
    'tepelné čerpadlo vzduch-voda',
    'instalace tepelných čerpadel',
    'servis tepelných čerpadel',
    'česká výroba',
    'dotace na tepelná čerpadla',
  ],
  authors: [{ name: 'AC Heating s.r.o.' }],
  creator: 'AC Heating',
  publisher: 'AC Heating',
  metadataBase: new URL('https://www.ac-heating.cz'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.ac-heating.cz',
    siteName: 'AC Heating',
    title: 'AC Heating - Tepelná čerpadla a fotovoltaika | 7 let záruka',
    description: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let. Česká firma s vlastním vývojem a výrobou. 1000+ instalací po celé ČR.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AC Heating - Tepelná čerpadla',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AC Heating - Tepelná čerpadla a fotovoltaika',
    description: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.ac-heating.cz',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="font-sans">
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
