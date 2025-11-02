import { Metadata } from 'next';
import { SavingsCalculator } from '@/components/calculator/SavingsCalculator';

export const metadata: Metadata = {
  title: 'Kalkulačka úspor - Tepelné čerpadlo a fotovoltaika | AC Heating',
  description: 'Vypočítejte si úspory při přechodu na tepelné čerpadlo a fotovoltaiku. Online kalkulačka s dotacemi a návratností investice.',
};

export default function KalkulackaPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Kalkulačka úspor
            </h1>
            <p className="text-xl text-white/90">
              Zjistěte, kolik ušetříte přechodem na tepelné čerpadlo a fotovoltaiku.
              Výpočet zahrnuje dotace a přesnou návratnost investice.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <SavingsCalculator />
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">
            Chcete přesnou nabídku na míru?
          </h2>
          <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
            Kontaktujte nás pro nezávaznou konzultaci a detailní kalkulaci přesně pro váš objekt.
          </p>
          <a
            href="/kontakt"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors"
          >
            Nezávazná poptávka
          </a>
        </div>
      </div>
    </div>
  );
}
