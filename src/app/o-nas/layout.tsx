import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nás - AC Heating',
  description: 'KUFI INT s.r.o. (AC Heating) – česká firma s více než 18letou tradicí v oblasti instalace tepelných čerpadel a fotovoltaiky. Více než 7500 domácností po celé Evropě.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
