import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Často kladené otázky o tepelných čerpadlech',
  description: 'Odpovědi na nejčastější dotazy o tepelných čerpadlech, instalaci, servisu, dotacích Nová zelená úsporám a úsporách. Kompletní průvodce od odborníků AC Heating.',
  openGraph: {
    title: 'FAQ - Tepelná čerpadla | AC Heating',
    description: 'Odpovědi na vaše otázky o tepelných čerpadlech, instalaci, dotacích a úsporách.',
  },
};

// FAQ Schema data - odpovídá struktuře z page.tsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    // Obecné otázky
    {
      '@type': 'Question',
      name: 'Co je tepelné čerpadlo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tepelné čerpadlo je zařízení, které využívá energii z okolního prostředí (vzduch, voda, země) k vytápění vašeho domu. Je to ekologické a velmi úsporné řešení, které může snížit vaše náklady na vytápění až o 75%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaká je životnost tepelného čerpadla?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kvalitní tepelné čerpadlo od AC Heating vydrží v provozu 20-25 let. Poskytujeme 7 let záruky na všechny naše produkty a kompletní servis po celou dobu životnosti.',
      },
    },
    {
      '@type': 'Question',
      name: 'Funguje tepelné čerpadlo i v zimě?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano! Naše tepelná čerpadla vzduch-voda fungují spolehlivě i při teplotách do -20°C. Jsou speciálně navržena pro české klimatické podmínky.',
      },
    },
    // Instalace a servis
    {
      '@type': 'Question',
      name: 'Jak dlouho trvá instalace?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standardní instalace tepelného čerpadla trvá 2-3 dny v závislosti na složitosti projektu. Zahrnuje přípravu místa, instalaci jednotek, napojení na rozvody a uvedení do provozu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Poskytujete servis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano, poskytujeme kompletní servis po celé ČR. Máme vlastní servisní tým, který je k dispozici 7 dní v týdnu. Pravidelná údržba je zahrnuta v našich servisních smlouvách.',
      },
    },
    {
      '@type': 'Question',
      name: 'Je nutná pravidelná údržba?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Doporučujeme provádět pravidelnou kontrolu 1x ročně. Zahrnuje kontrolu chladiva, čištění filtrů a kontrolu všech komponent. To prodlužuje životnost a zajišťuje optimální výkon.',
      },
    },
    // Dotace a financování
    {
      '@type': 'Question',
      name: 'Můžu získat dotaci na tepelné čerpadlo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano! Program Nová zelená úsporám (NZÚ) poskytuje dotace až 160 000 Kč na instalaci tepelného čerpadla. Pomůžeme vám s vyřízením žádosti.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaká je návratnost investice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Návratnost investice do tepelného čerpadla je obvykle 7-12 let v závislosti na typu vytápění, které nahrazujete. S dotacemi se návratnost zkracuje na 5-8 let.',
      },
    },
    {
      '@type': 'Question',
      name: 'Nabízíte financování?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano, spolupracujeme s bankami a leasingovými společnostmi. Můžeme vám nabídnout výhodné financování s nízkým úrokem.',
      },
    },
    // Výkon a úspory
    {
      '@type': 'Question',
      name: 'Kolik ušetřím na vytápění?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oproti klasickému elektrickému vytápění ušetříte až 75% nákladů. Oproti plynovému kotli až 50%. Konkrétní úspory závisí na velikosti domu a izolaci.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaký je COP tepelného čerpadla?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Naše tepelná čerpadla dosahují COP (koeficient výkonu) 4-5, což znamená, že z 1 kWh elektrické energie získáte 4-5 kWh tepla.',
      },
    },
    {
      '@type': 'Question',
      name: 'Lze tepelné čerpadlo využít i pro chlazení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano! Mnoho našich modelů umožňuje pasivní i aktivní chlazení v létě. Je to velmi efektivní způsob klimatizace.',
      },
    },
  ],
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
