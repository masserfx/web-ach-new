import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Často kladené otázky (FAQ) | AC Heating',
  description: 'Odpovědi na nejčastější otázky o tepelných čerpadlech, klimatizacích a fotovoltaice. Instalace, servis, dotace a financování.',
  keywords: ['FAQ', 'tepelná čerpadla otázky', 'dotace', 'instalace', 'servis', 'AC Heating'],
  openGraph: {
    title: 'Často kladené otázky | AC Heating',
    description: 'Odpovědi na nejčastější otázky o tepelných čerpadlech, klimatizacích a fotovoltaice.',
    type: 'website',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
