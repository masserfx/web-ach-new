import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Brain, TrendingUp, Search, FileText, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics Agent | Admin | AC Heating',
  robots: { index: false, follow: false },
};

export default function AnalyticsAgentPage() {
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
              onClick={() => {
                const iframe = document.getElementById('agent-iframe') as HTMLIFrameElement;
                if (iframe) {
                  iframe.src = '/admin/analytics/quick-insights';
                }
              }}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Zobrazit Quick Insights
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
              onClick={() => {
                const iframe = document.getElementById('agent-iframe') as HTMLIFrameElement;
                if (iframe) {
                  iframe.src = '/admin/analytics/daily-report';
                }
              }}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Vygenerovat Denní Report
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
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const query = (form.elements.namedItem('query') as HTMLTextAreaElement).value;
              
              if (query.trim()) {
                const iframe = document.getElementById('agent-iframe') as HTMLIFrameElement;
                if (iframe) {
                  // Encode query for URL
                  iframe.src = `/admin/analytics/analyze?q=${encodeURIComponent(query)}`;
                }
                form.reset();
              }
            }}
            className="space-y-4"
          >
            <textarea
              name="query"
              placeholder="Příklad: Kolik leadů jsme měli tento měsíc? Jaký je conversion rate? Které produkty jsou nejpopulárnější?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg"
            >
              <Search className="w-5 h-5 inline mr-2" />
              Analyzovat Data
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
                  onClick={() => {
                    const textarea = document.querySelector('textarea[name="query"]') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.value = example;
                    }
                  }}
                  className="text-left text-sm text-red-600 hover:text-red-800 hover:underline"
                >
                  • {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-zinc-200">
          <div className="bg-zinc-800 px-6 py-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Results</h3>
          </div>
          <div className="p-6 bg-zinc-50" style={{ minHeight: '400px' }}>
            <iframe
              id="agent-iframe"
              className="w-full h-full min-h-[600px] border-0"
              src="about:blank"
            />
            <div id="no-results" className="text-center py-12">
              <Brain className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">
                Žádné výsledky zatím. Použijte Quick Insights nebo Custom Analysis výše.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
