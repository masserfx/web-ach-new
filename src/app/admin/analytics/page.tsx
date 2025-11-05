'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, TrendingUp, Search, FileText, Zap, Loader2 } from 'lucide-react';

export default function AnalyticsAgentPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (customQuery?: string) => {
    const queryToAnalyze = customQuery || query;
    
    if (!queryToAnalyze.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/analytics-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToAnalyze }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to analyze data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInsights = async () => {
    const query = `
    Rychlý přehled AC Heating dat (za posledních 7 dní):
    
    1. Kolik leadů celkem?
    2. Kolik calculator usage?
    3. Top 3 produkty podle views
    4. Conversion rate estimate
    5. 3 klíčová doporučení
    
    Odpověď max 200 slov, bullet points.
    `;
    
    await handleAnalyze(query);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/leads" className="text-zinc-600 hover:text-zinc-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                <Brain className="w-8 h-8 text-red-600" />
                Analytics Agent
              </h1>
              <p className="text-zinc-600 mt-1">AI-powered data analysis a insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Insights Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-zinc-900">Quick Insights</h2>
            </div>
            <p className="text-zinc-600 mb-4">
              Získej okamžitý přehled o klíčových metrikách za posledních 7 dní
            </p>
            <button
              onClick={handleQuickInsights}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Analyzuji...
                </>
              ) : (
                'Zobrazit Quick Insights'
              )}
            </button>
          </div>

          {/* Daily Report Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-zinc-900">Denní Report</h2>
            </div>
            <p className="text-zinc-600 mb-4">
              Kompletní denní analytický report s grafy a doporučeními
            </p>
            <button
              onClick={() => handleAnalyze('Vytvoř denní report pro AC Heating za včerejší den s grafy a doporučeními')}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generuji...' : 'Vygenerovat Denní Report'}
            </button>
          </div>
        </div>

        {/* Custom Query Card */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-sm p-8 border-2 border-red-200 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-7 h-7 text-red-600" />
            <h2 className="text-2xl font-bold text-zinc-900">Custom Analysis</h2>
          </div>
          <p className="text-zinc-700 mb-6 text-lg">
            Zeptej se AI agenta na cokoliv o vašich datech
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }} className="space-y-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Příklad: Kolik leadů jsme měli tento měsíc? Jaký je conversion rate? Které produkty jsou nejpopulárnější?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5 inline mr-2" />
              {loading ? 'Analyzuji...' : 'Analyzovat Data'}
            </button>
          </form>

          {/* Example Queries */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-zinc-700 mb-3">Příklady dotazů:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                "Kolik leadů bylo vytvořeno za posledních 30 dní?",
                "Jaký je conversion rate z calculator na lead?",
                "Které produkty mají nejvíc views?",
                "Kde lidé opouštějí lead form?"
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(example)}
                  disabled={loading}
                  className="text-left text-sm text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
                >
                  • {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Container */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-zinc-200">
            <div className="bg-zinc-800 px-6 py-4 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-white font-semibold">Analysis Results</h3>
            </div>
            <div className="p-6">
              {result.success ? (
                <>
                  <div className="prose prose-zinc max-w-none mb-6">
                    <div className="whitespace-pre-wrap text-zinc-800">
                      {result.response}
                    </div>
                  </div>
                  
                  {result.charts && result.charts.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-zinc-900 mb-3">📊 Grafy</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {result.charts.map((chart: string, i: number) => (
                          <img 
                            key={i} 
                            src={`/api/charts/${chart}`} 
                            alt={`Chart ${i + 1}`}
                            className="rounded-lg border border-zinc-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <h4 className="font-bold text-green-900 mb-3">💡 Doporučení</h4>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="text-green-800">
                            <span className="font-semibold">{i + 1}.</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold">❌ Error</p>
                  <p>{result.error || 'Analysis failed'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-zinc-200">
            <Brain className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg">
              Žádné výsledky zatím. Použijte Quick Insights nebo Custom Analysis výše.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
