import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O společnosti - AC Heating',
  description: 'KUFI INT s.r.o. (AC Heating) – česká firma s více než 18letou tradicí. Instalace tepelných čerpadel, fotovoltaiky a energetických řešení.',
  openGraph: {
    title: 'O společnosti - AC Heating',
    description: 'Poznáte si firmu stojící za moderními energetickými řešeními. Více než 18 let zkušeností, 7500+ domácností, 100+ zaměstnanců.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
