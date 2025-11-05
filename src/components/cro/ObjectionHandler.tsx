'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Objection {
  question: string;
  answer: string;
  icon?: string;
}

interface ObjectionHandlerProps {
  title?: string;
  description?: string;
  objections: Objection[];
  className?: string;
}

export function ObjectionHandler({
  title = 'Časté otázky',
  description = 'Odpovědi na nejčastější obavy našich zákazníků',
  objections,
  className = '',
}: ObjectionHandlerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`py-20 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">{title}</h2>
          <p className="text-lg text-gray-900 text-center mb-12">{description}</p>

          <div className="space-y-4">
            {objections.map((objection, idx) => (
              <ObjectionItem
                key={idx}
                objection={objection}
                isOpen={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ObjectionItem({
  objection,
  isOpen,
  onClick,
}: {
  objection: Objection;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-brand-primary/50 transition-all overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-900">{objection.question}</h3>
        <ChevronDown
          className={`w-6 h-6 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
          <p className="text-gray-700 leading-relaxed">{objection.answer}</p>
        </div>
      )}
    </div>
  );
}

// Predefined objections for heat pump context
export const commonObjections: Objection[] = [
  {
    question: 'Kolik stojí instalace tepelného čerpadla?',
    answer:
      'Cena se liší podle typu a velikosti domu. Nejčastěji investujete 400 000 - 1 200 000 Kč. K dispozici je řada dotací (kotlíková dotace, NZÚ, apod.), které mohou pokrýt až 50% nákladů. Naši specialisté vám poskytnout bezplatný odhad.',
  },
  {
    question: 'Jak dlouho se vrátí investice?',
    answer:
      'Návratnost investice je obvykle 8-12 let. Se stoupajícími cenami energií se doba zkracuje. S fotovoltaikou a regulací xCC je návratnost ještě rychlejší.',
  },
  {
    question: 'Je tepelné čerpadlo vhodné pro můj starý dům?',
    answer:
      'Tepelné čerpadla fungují nejlépe v dobře izolovaných domech. Pokud je váš dům starší s horší izolací, stále si můžete nainstalovat čerpadlo, ale úspora bude menší. Doporučujeme nejdřív zlepšit izolaci (okna, střecha, atd.).',
  },
  {
    question: 'Jak hlasité je tepelné čerpadlo?',
    answer:
      'Moderní vzduchová čerpadla produkují 45-55 dB - podobně jako běžná klimatizace. To odpovídá zvuku běžné konverzace. Zemní čerpadla jsou ještě tiší, protože jsou pod zemí.',
  },
  {
    question: 'Co když v zimě zkrachuje?',
    answer:
      'Kvalitní tepelné čerpadla fungují spolehlivě do -25°C. Navíc mohou být doplněna bivalentním zdrojem (plyn, olej) jako backup. Naše regulace xCC vše automaticky spravuje.',
  },
  {
    question: 'Jaký je rozdíl mezi vzduchovou a zemní čerpadlem?',
    answer:
      'Vzduchová čerpadla jsou levnější a jednodušší na instalaci. Zemní čerpadla jsou tišší a účinnější, ale vyžadují vrtání studny. Oba typy šetří energii. Výběr závisí na vašem domě a požadavcích.',
  },
];
