'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface KPI {
  id: string;
  metric_name: string;
  category: string;
  baseline_2024: number;
  target_q4_2025: number;
  actual_value: number | null;
  unit: string;
  period: string;
}

interface CMSContent {
  id: string;
  title: string;
  content_type: string;
  status: string;
  ai_generated: boolean;
  created_at: string;
}

interface EditHistory {
  id: string;
  edit_type: string;
  editor_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentContent, setRecentContent] = useState<CMSContent[]>([]);
  const [recentEdits, setRecentEdits] = useState<EditHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const [aiPrompt, setAiPrompt] = useState('');
  const [contentType, setContentType] = useState<'page' | 'blog' | 'case_study' | 'landing_page'>('blog');
  const [generating, setGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Load KPIs
      const { data: kpiData } = await supabase
        .from('kpis')
        .select('*')
        .order('priority', { ascending: true })
        .limit(6);

      if (kpiData) setKpis(kpiData);

      // Load recent CMS content
      const { data: contentData } = await supabase
        .from('cms_content')
        .select('id, title, content_type, status, ai_generated, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (contentData) setRecentContent(contentData);

      // Load recent edits
      const { data: editsData } = await supabase
        .from('cms_edit_history')
        .select('id, edit_type, editor_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (editsData) setRecentEdits(editsData);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateContent() {
    if (!aiPrompt.trim()) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/cms/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          contentType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewContent(data);
        alert('Obsah byl úspěšně vygenerován! Zkontrolujte náhled níže.');
      } else {
        const error = await response.json();
        alert(`Chyba: ${error.error || 'Nepodařilo se vygenerovat obsah'}`);
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('Chyba při generování obsahu');
    } finally {
      setGenerating(false);
    }
  }

  async function handlePublishContent() {
    if (!previewContent?.id) return;

    try {
      const response = await fetch('/api/cms/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: previewContent.id,
          approved: true,
        }),
      });

      if (response.ok) {
        alert('Obsah byl publikován!');
        setPreviewContent(null);
        setAiPrompt('');
        loadDashboardData();
      } else {
        const error = await response.json();
        alert(`Chyba: ${error.error}`);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Chyba při publikování');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-xl">Načítání...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-[#2B2B2B] bg-[#0D0D0D]/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-[#F36F21]">AC Heating Admin CMS</h1>
          <p className="text-[#B4B4B4] mt-1">AI-powered Content Management System</p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Dashboard */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">KPI Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="bg-[#2B2B2B] rounded-lg p-6 border border-[#B4B4B4]/20 hover:border-[#F36F21]/50 transition-colors"
              >
                <div className="text-[#B4B4B4] text-sm mb-2">{kpi.metric_name}</div>
                <div className="text-3xl font-bold text-white mb-1">
                  {kpi.actual_value !== null ? kpi.actual_value : '-'}
                  <span className="text-lg text-[#B4B4B4] ml-1">{kpi.unit}</span>
                </div>
                <div className="text-sm text-[#B4B4B4]">
                  Target Q4: <span className="text-[#F36F21] font-semibold">{kpi.target_q4_2025}{kpi.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Content Generator */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">AI Content Generator</h2>

          <div className="bg-[#2B2B2B] rounded-lg p-8 border border-[#B4B4B4]/20">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#B4B4B4]">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full bg-[#0D0D0D] border border-[#B4B4B4]/20 rounded-lg px-4 py-3 text-white focus:border-[#F36F21] focus:outline-none"
              >
                <option value="blog">Blog článek</option>
                <option value="page">Statická stránka</option>
                <option value="case_study">Case study</option>
                <option value="landing_page">Landing page</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#B4B4B4]">
                AI Prompt (přirozený jazyk)
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Např: 'Vytvoř článek o dotacích 2025 pro rodinné domy s tepelnými čerpadly'"
                rows={4}
                className="w-full bg-[#0D0D0D] border border-[#B4B4B4]/20 rounded-lg px-4 py-3 text-white placeholder-[#B4B4B4]/50 focus:border-[#F36F21] focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateContent}
              disabled={generating || !aiPrompt.trim()}
              className="w-full bg-[#F36F21] hover:bg-[#F36F21]/90 disabled:bg-[#B4B4B4]/20 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              {generating ? 'Generuji...' : 'Vygenerovat obsah'}
            </button>

            {/* Prompt Examples */}
            <div className="mt-6 pt-6 border-t border-[#B4B4B4]/20">
              <p className="text-sm text-[#B4B4B4] mb-3">Příklady promptů:</p>
              <div className="space-y-2">
                {[
                  'Vytvoř článek o dotacích 2025 pro rodinné domy',
                  'Optimalizuj SEO pro produkt TČ + FVE',
                  'Uprav homepage hero text pro bytové domy',
                  'Vytvoř case study instalace v Praze',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setAiPrompt(example)}
                    className="block w-full text-left text-sm text-[#B4B4B4] hover:text-[#F36F21] transition-colors"
                  >
                    • {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preview & Publish */}
        {previewContent && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Náhled článku</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const showJson = document.getElementById('json-view');
                    const showPreview = document.getElementById('preview-view');
                    showJson?.classList.toggle('hidden');
                    showPreview?.classList.toggle('hidden');
                  }}
                  className="px-4 py-2 bg-[#2B2B2B] text-[#F36F21] border border-[#F36F21]/50 rounded-lg hover:bg-[#F36F21]/10 transition-colors text-sm"
                >
                  Přepnout JSON ↔ Náhled
                </button>
              </div>
            </div>

            {/* Preview View */}
            <div id="preview-view" className="bg-white rounded-lg p-8 mb-6">
              {/* Article Header */}
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-bold text-[#0D0D0D] mb-4">
                  {previewContent.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {previewContent.meta_description}
                </p>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {/* Intro */}
                {previewContent.content.intro && (
                  <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                    {previewContent.content.intro}
                  </p>
                )}

                {/* Sections */}
                {previewContent.content.sections?.map((section: any, idx: number) => (
                  <div key={idx} className="mb-10">
                    {section.heading && (
                      <h2 className="text-2xl font-bold text-[#0D0D0D] mb-4">
                        {section.heading}
                      </h2>
                    )}
                    {section.text && (
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        {section.text.split('\n\n').map((para: string, pIdx: number) => {
                          // Handle bold text **text**
                          const parts = para.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={pIdx}>
                              {parts.map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={i} className="font-bold text-[#0D0D0D]">{part.slice(2, -2)}</strong>;
                                }
                                // Handle lists
                                if (part.startsWith('- ')) {
                                  return <span key={i} className="block ml-4">• {part.slice(2)}</span>;
                                }
                                return <span key={i}>{part}</span>;
                              })}
                            </p>
                          );
                        })}
                      </div>
                    )}
                    {section.image && (
                      <div className="mt-4 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-sm text-gray-600 italic">📷 {section.image}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Conclusion */}
                {previewContent.content.conclusion && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium">
                      {previewContent.content.conclusion}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* JSON View (hidden by default) */}
            <div id="json-view" className="bg-[#2B2B2B] rounded-lg p-8 mb-6 hidden">
              <div className="mb-4">
                <span className="text-sm text-[#B4B4B4]">Titulek:</span>
                <input
                  type="text"
                  value={previewContent.title}
                  onChange={(e) => setPreviewContent({...previewContent, title: e.target.value})}
                  className="w-full mt-2 bg-[#0D0D0D] border border-[#B4B4B4]/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="mb-4">
                <span className="text-sm text-[#B4B4B4]">Meta popis:</span>
                <textarea
                  value={previewContent.meta_description}
                  onChange={(e) => setPreviewContent({...previewContent, meta_description: e.target.value})}
                  rows={3}
                  className="w-full mt-2 bg-[#0D0D0D] border border-[#B4B4B4]/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div className="mb-6">
                <span className="text-sm text-[#B4B4B4]">Obsah (JSON):</span>
                <pre className="bg-[#0D0D0D] p-4 rounded mt-2 text-sm text-[#B4B4B4] overflow-auto max-h-96">
                  {JSON.stringify(previewContent.content, null, 2)}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePublishContent}
                className="flex-1 bg-[#F36F21] hover:bg-[#F36F21]/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ✓ Publikovat článek
              </button>
              <button
                onClick={() => setPreviewContent(null)}
                className="flex-1 bg-[#B4B4B4]/20 hover:bg-[#B4B4B4]/30 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                ✕ Zahodit a začít znovu
              </button>
            </div>
          </section>
        )}

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Content */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Poslední obsah</h2>
            <div className="space-y-3">
              {recentContent.map((content) => (
                <div
                  key={content.id}
                  className="bg-[#2B2B2B] rounded-lg p-4 border border-[#B4B4B4]/20 hover:border-[#F36F21]/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{content.title}</h3>
                      <div className="flex gap-3 mt-2 text-sm">
                        <span className="text-[#B4B4B4]">{content.content_type}</span>
                        <span className={content.status === 'published' ? 'text-green-400' : 'text-yellow-400'}>
                          {content.status}
                        </span>
                        {content.ai_generated && (
                          <span className="text-[#F36F21]">AI</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Edits */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Historie editací</h2>
            <div className="space-y-3">
              {recentEdits.map((edit) => (
                <div
                  key={edit.id}
                  className="bg-[#2B2B2B] rounded-lg p-4 border border-[#B4B4B4]/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[#B4B4B4] text-sm">{edit.edit_type}</span>
                      <p className="text-white mt-1">{edit.editor_name || 'System'}</p>
                      <p className="text-[#B4B4B4] text-xs mt-1">
                        {new Date(edit.created_at).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
