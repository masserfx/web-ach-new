import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Analytics } from '@/components/Analytics';

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
  description: 'KUFI INT s.r.o. (AC Heating) - česká firma s více než 18letou tradicí v instalaci tepelných čerpadel a fotovoltaiky. 7500+ domácností po Evropě. 7 let záruka.',
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
    description: 'KUFI INT s.r.o. (AC Heating) - instalace tepelných čerpadel a fotovoltaiky. Více než 18 let zkušeností. 7500+ domácností a 1500+ instalací ročně.',
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
    description: 'KUFI INT s.r.o. - instalace tepelných čerpadel a fotovoltaiky. Česká firma s 18+ lety zkušeností.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.ac-heating.cz',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// Organization Schema.org markup
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AC Heating',
  description: 'Odborníci na tepelná čerpadla s 20+ lety zkušeností. Instalace, servis, poradenství dotací.',
  url: 'https://www.ac-heating.cz',
  telephone: '+420 777 123 456',
  email: 'info@ac-heating.cz',
  foundingDate: '2004',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CZ',
    addressRegion: 'Praha',
  },
  areaServed: [
    { '@type': 'City', name: 'Praha' },
    { '@type': 'City', name: 'Brno' },
    { '@type': 'City', name: 'Ostrava' },
    { '@type': 'City', name: 'Plzeň' },
    { '@type': 'City', name: 'Liberec' },
    { '@type': 'City', name: 'Olomouc' },
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  slogan: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.variable}>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="font-sans">
        <Analytics />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
