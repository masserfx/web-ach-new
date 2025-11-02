'use client';

import { useState } from 'react';
import { Calculator, TrendingDown, Leaf, Euro, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface CalculationResult {
  currentAnnualCost: number;
  heatPumpAnnualCost: number;
  annualSavings: number;
  savingsPercentage: number;
  investmentCost: number;
  paybackYears: number;
  subsidiesAvailable: number;
  netInvestment: number;
  co2SavingsKg: number;
  recommendations: string[];
}

export function SavingsCalculator() {
  const [propertyType, setPropertyType] = useState<string>('rodinny_dum');
  const [propertySize, setPropertySize] = useState<string>('150');
  const [currentHeating, setCurrentHeating] = useState<string>('plyn');
  const [annualCost, setAnnualCost] = useState<string>('');
  const [hasSolar, setHasSolar] = useState<boolean>(false);
  const [solarPower, setSolarPower] = useState<string>('');
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/calculate-savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_type: propertyType,
          property_size_sqm: parseInt(propertySize),
          current_heating: currentHeating,
          annual_heating_cost: annualCost ? parseFloat(annualCost) : null,
          hot_water_persons: 4,
          has_solar: hasSolar,
          solar_power_kwp: hasSolar && solarPower ? parseFloat(solarPower) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Nepodařilo se vypočítat úspory');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Došlo k chybě při výpočtu. Backend může být nedostupný.');
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-red-600" />
            Parametry výpočtu
          </h2>

          <div className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Typ objektu
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="rodinny_dum">Rodinný dům</option>
                <option value="bytovy_dum">Bytový dům</option>
                <option value="firma">Firma</option>
              </select>
            </div>

            {/* Property Size */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Plocha objektu (m²)
              </label>
              <input
                type="number"
                value={propertySize}
                onChange={(e) => setPropertySize(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="150"
              />
            </div>

            {/* Current Heating */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Současné vytápění
              </label>
              <select
                value={currentHeating}
                onChange={(e) => setCurrentHeating(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="plyn">Plyn</option>
                <option value="elektrina">Elektřina</option>
                <option value="uhli">Uhlí</option>
                <option value="topny_olej">Topný olej</option>
              </select>
            </div>

            {/* Annual Cost (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Roční náklady na vytápění (volitelné)
              </label>
              <input
                type="number"
                value={annualCost}
                onChange={(e) => setAnnualCost(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="např. 50000"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Pokud nevyplníte, kalkulace bude odhadnuta
              </p>
            </div>

            {/* Solar */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSolar}
                  onChange={(e) => setHasSolar(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded border-zinc-300 focus:ring-red-600"
                />
                <span className="text-sm font-semibold text-zinc-700">
                  Mám fotovoltaiku / plánuji ji
                </span>
              </label>

              {hasSolar && (
                <input
                  type="number"
                  value={solarPower}
                  onChange={(e) => setSolarPower(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent mt-2"
                  placeholder="Výkon FVE v kWp (např. 10)"
                />
              )}
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating || !propertySize}
              className="w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Počítám...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Vypočítat úspory
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-4">
              {/* Annual Savings */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">Roční úspora</h3>
                </div>
                <div className="text-5xl font-bold mb-2">
                  {formatPrice(result.annualSavings)}
                </div>
                <div className="text-xl">
                  {result.savingsPercentage.toFixed(1)}% úspora nákladů
                </div>
              </div>

              {/* Investment */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Euro className="w-5 h-5 text-red-600" />
                  Investice
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Celková cena:</span>
                    <span className="font-semibold">{formatPrice(result.investmentCost)}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Dotace:</span>
                    <span className="font-semibold">- {formatPrice(result.subsidiesAvailable)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Po dotaci:</span>
                    <span className="text-red-600">{formatPrice(result.netInvestment)}</span>
                  </div>
                </div>
              </div>

              {/* Payback */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  Návratnost
                </h3>
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {result.paybackYears.toFixed(1)} let
                </div>
                <p className="text-zinc-600">
                  Vaše investice se vrátí během {result.paybackYears.toFixed(1)} let
                </p>
              </div>

              {/* CO2 Savings */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Ekologie
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(result.co2SavingsKg / 1000).toFixed(1)} tun CO₂
                </div>
                <p className="text-zinc-600">
                  Roční snížení emisí CO₂
                </p>
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3">
                    Doporučení
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <a
                href="/kontakt"
                className="block w-full bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-red-700 transition-colors"
              >
                Chci nezávaznou nabídku
              </a>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Calculator className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                Vyplňte formulář
              </h3>
              <p className="text-zinc-600">
                Zadejte parametry vašeho objektu pro výpočet úspor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
