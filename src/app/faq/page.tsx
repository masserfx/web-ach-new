'use client';

import { Metadata } from 'next';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    category: 'Obecné otázky',
    questions: [
      {
        q: 'Co je tepelné čerpadlo?',
        a: 'Tepelné čerpadlo je zařízení, které využívá energii z okolního prostředí (vzduch, voda, země) k vytápění vašeho domu. Je to ekologické a velmi úsporné řešení, které může snížit vaše náklady na vytápění až o 75%.',
      },
      {
        q: 'Jaká je životnost tepelného čerpadla?',
        a: 'Kvalitní tepelné čerpadlo od AC Heating vydrží v provozu 20-25 let. Poskytujeme 7 let záruky na všechny naše produkty a kompletní servis po celou dobu životnosti.',
      },
      {
        q: 'Funguje tepelné čerpadlo i v zimě?',
        a: 'Ano! Naše tepelná čerpadla vzduch-voda fungují spolehlivě i při teplotách do -20°C. Jsou speciálně navržena pro české klimatické podmínky.',
      },
    ],
  },
  {
    category: 'Instalace a servis',
    questions: [
      {
        q: 'Jak dlouho trvá instalace?',
        a: 'Standardní instalace tepelného čerpadla trvá 2-3 dny v závislosti na složitosti projektu. Zahrnuje přípravu místa, instalaci jednotek, napojení na rozvody a uvedení do provozu.',
      },
      {
        q: 'Poskytujete servis?',
        a: 'Ano, poskytujeme kompletní servis po celé ČR. Máme vlastní servisní tým, který je k dispozici 7 dní v týdnu. Pravidelná údržba je zahrnuta v našich servisních smlouvách.',
      },
      {
        q: 'Je nutná pravidelná údržba?',
        a: 'Doporučujeme provádět pravidelnou kontrolu 1x ročně. Zahrnuje kontrolu chladiva, čištění filtrů a kontrolu všech komponent. To prodlužuje životnost a zajišťuje optimální výkon.',
      },
    ],
  },
  {
    category: 'Dotace a financování',
    questions: [
      {
        q: 'Můžu získat dotaci na tepelné čerpadlo?',
        a: 'Ano! Program Nová zelená úsporám (NZÚ) poskytuje dotace až 160 000 Kč na instalaci tepelného čerpadla. Pomůžeme vám s vyřízením žádosti.',
      },
      {
        q: 'Jaká je návratnost investice?',
        a: 'Návratnost investice do tepelného čerpadla je obvykle 7-12 let v závislosti na typu vytápění, které nahrazujete. S dotacemi se návratnost zkracuje na 5-8 let.',
      },
      {
        q: 'Nabízíte financování?',
        a: 'Ano, spolupracujeme s bankami a leasingovými společnostmi. Můžeme vám nabídnout výhodné financování s nízkým úrokem.',
      },
    ],
  },
  {
    category: 'Výkon a úspory',
    questions: [
      {
        q: 'Kolik ušetřím na vytápění?',
        a: 'Oproti klasickému elektrickému vytápění ušetříte až 75% nákladů. Oproti plynovému kotli až 50%. Konkrétní úspory závisí na velikosti domu a izolaci.',
      },
      {
        q: 'Jaký je COP tepelného čerpadla?',
        a: 'Naše tepelná čerpadla dosahují COP (koeficient výkonu) 4-5, což znamená, že z 1 kWh elektrické energie získáte 4-5 kWh tepla.',
      },
      {
        q: 'Lze tepelné čerpadlo využít i pro chlazení?',
        a: 'Ano! Mnoho našich modelů umožňuje pasivní i aktivní chlazení v létě. Je to velmi efektivní způsob klimatizace.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Často kladené otázky
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Odpovědi na nejčastější dotazy o tepelných čerpadlech, instalaci,
              servis a dotacích.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => (
                  <FAQItem key={qIdx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Nenašli jste odpověď?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rádi vám zodpovíme všechny vaše otázky. Kontaktujte nás telefonicky
            nebo emailem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontakt"
              className="px-10 py-5 bg-white text-brand-primary rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all"
            >
              Kontaktujte nás
            </a>
            <a
              href="/pripravit-rozpocet"
              className="px-10 py-5 bg-brand-accent text-white rounded-xl font-bold text-lg shadow-2xl hover:bg-brand-accent/90 transition-all"
            >
              Nezávazná poptávka
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-900 pr-4">{question}</h3>
        <ChevronDown
          className={`w-6 h-6 text-brand-primary flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
