import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AC Heating - Tepelná čerpadla a fotovoltaika',
    template: '%s | AC Heating',
  },
  description: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let. Jsme česká firma s vlastním vývojem i výrobou. Pokrytí celé ČR.',
  keywords: ['tepelná čerpadla', 'fotovoltaika', 'vytápění', 'AC Heating', 'úspora energie'],
  authors: [{ name: 'AC Heating' }],
  creator: 'AC Heating',
  publisher: 'AC Heating',
  metadataBase: new URL('https://www.ac-heating.cz'),
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.ac-heating.cz',
    siteName: 'AC Heating',
    title: 'AC Heating - Tepelná čerpadla a fotovoltaika',
    description: 'Řešíme chytré vytápění pro rodinné, bytové i komerční domy již 20 let.',
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
        {children}
      </body>
    </html>
  );
}
