'use client';

import { useState } from 'react';
import { Calculator, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export function EnergySavingsCalculator() {
  const [houseSize, setHouseSize] = useState(150);
  const [currentHeating, setCurrentHeating] = useState('gas');
  const [hasAC, setHasAC] = useState(false);

  // Aproximační kalkulace (reálné čísla mohou být jiná)
  const calculateSavings = () => {
    let baseCost = houseSize * 50; // Základní roční spotřeba

    // Aktuální topení
    const heatingFactors: Record<string, number> = {
      gas: 1,
      oil: 1.3,
      coal: 1.4,
      electric: 1.2,
    };

    const currentCost = baseCost * heatingFactors[currentHeating];
    const heatPumpCost = baseCost * 0.4; // Tepelné čerpadlo šetří ~60%

    return {
      currentCost: Math.round(currentCost),
      heatPumpCost: Math.round(heatPumpCost),
      savings: Math.round(currentCost - heatPumpCost),
      roi: Math.round((800000 / (currentCost - heatPumpCost)) * 10) / 10, // Přibližně 800k na instalaci
    };
  };

  const results = calculateSavings();

  return (
    <section className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-3xl p-8 md:p-12">
      <div className="flex items-start gap-4 mb-8">
        <div className="inline-flex p-3 rounded-lg bg-brand-primary/20 text-brand-primary">
          <Calculator className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Spočítej si svou úsporu
          </h3>
          <p className="text-gray-700">
            Zjisti, kolik ročně ušetříš přechodem na tepelné čerpadlo.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* House Size Slider */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Velikost domu: <span className="text-brand-primary">{houseSize} m²</span>
          </label>
          <input
            type="range"
            min="50"
            max="500"
            step="10"
            value={houseSize}
            onChange={(e) => setHouseSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>50 m²</span>
            <span>500 m²</span>
          </div>
        </div>

        {/* Current Heating Type */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Aktuální vytápění
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'gas', label: 'Zemní plyn' },
              { value: 'oil', label: 'Topný olej' },
              { value: 'coal', label: 'Tuhá paliva' },
              { value: 'electric', label: 'Elektrické' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setCurrentHeating(option.value)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  currentHeating === option.value
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photovoltaics Option */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAC}
              onChange={(e) => setHasAC(e.target.checked)}
              className="w-5 h-5 text-brand-primary rounded"
            />
            <span className="text-lg font-semibold text-gray-900">
              Máš fotovoltaiku? (úspora +30%)
            </span>
          </label>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl p-8 border-2 border-brand-secondary/20">
          <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-green-600" />
            Tvoje odhadovaná úspora
          </h4>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Aktuální roční náklady</div>
              <div className="text-3xl font-black text-gray-900">
                {results.currentCost.toLocaleString('cs-CZ')} Kč
              </div>
            </div>

            <div className="md:border-l md:border-r md:border-gray-200 px-6 text-center">
              <div className="text-sm text-gray-600 mb-1">S tepelným čerpadlem</div>
              <div className="text-3xl font-black text-brand-primary">
                {results.heatPumpCost.toLocaleString('cs-CZ')} Kč
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Roční úspora</div>
              <div className="text-4xl font-black text-green-600">
                {results.savings.toLocaleString('cs-CZ')} Kč
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Návratnost investice:</strong> Přibližně <strong>{results.roi} let</strong>
            </p>
            <p className="text-xs text-gray-600">
              *Výpočet je orientační. Reální úspora se liší dle specifik domu, izolace, energií cen, apod.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/pripravit-rozpocet"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-brand-primary/90 transition-all shadow-lg"
          >
            Spočítej si přesný rozpočet
          </Link>
          <p className="text-sm text-gray-600 mt-3">
            Pošleme ti detailní nabídku bez záväznosti
          </p>
        </div>
      </div>
    </section>
  );
}
