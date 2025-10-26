import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulace xCC - Inteligentní řízení tepelného čerpadla',
  description: 'Regulace xCC od AC Heating. Chytré řízení energií, automatická diagnostika, dálková správa. Reaktivní na předpověď počasí. Více informací tady.',
  openGraph: {
    title: 'Regulace xCC - Inteligentní řízení',
    description: 'Chytré řízení energií v domě. Optimalizace spotřeby, automatická správa, bezpečné připojení.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
