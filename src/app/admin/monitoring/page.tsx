'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Play,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  FileCode,
} from 'lucide-react';
import Link from 'next/link';

interface MonitoringReport {
  filename: string;
  timestamp: string;
  overallStatus: 'GREEN' | 'YELLOW' | 'RED';
  pages: Array<{
    url: string;
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
    metrics?: {
      firstContentfulPaint?: number;
      largestContentfulPaint?: number;
      totalBlockingTime?: number;
      cumulativeLayoutShift?: number;
      speedIndex?: number;
    };
    contentHash?: string;
    contentChanged?: boolean;
  }>;
  alerts: string[];
  recommendations: string[];
  summary?: {
    totalPages: number;
    pagesGreen: number;
    pagesYellow: number;
    pagesRed: number;
    avgPerformance: number;
    avgSEO: number;
  };
}

interface Doc {
  filename: string;
  size: number;
  modified: string;
  type: string;
}

export default function MonitoringPage() {
  const [reports, setReports] = useState<MonitoringReport[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selectedReport, setSelectedReport] = useState<MonitoringReport | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<{ filename: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'docs'>('dashboard');

  useEffect(() => {
    fetchReports();
    fetchDocs();
  }, []);

  async function fetchReports() {
    try {
      const response = await fetch('/api/admin/monitoring/reports');
      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
        if (data.reports.length > 0 && !selectedReport) {
          setSelectedReport(data.reports[0]);
        }
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDocs() {
    try {
      const response = await fetch('/api/admin/monitoring/docs');
      const data = await response.json();

      if (data.success) {
        setDocs(data.docs);
      }
    } catch (err: any) {
      console.error('Error fetching docs:', err);
    }
  }

  async function runMonitoringCheck() {
    setRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/monitoring/run-check', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh reports after successful run
        await fetchReports();
        alert('Monitoring check completed successfully!');
      } else {
        setError(data.error || 'Failed to run monitoring check');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  async function viewDoc(filename: string) {
    try {
      const response = await fetch(`/api/admin/monitoring/docs?file=${encodeURIComponent(filename)}`);
      const data = await response.json();

      if (data.success) {
        setSelectedDoc({ filename, content: data.content });
      }
    } catch (err: any) {
      console.error('Error loading doc:', err);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'GREEN':
        return 'text-green-500 bg-green-500/10 border-green-500';
      case 'YELLOW':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
      case 'RED':
        return 'text-red-500 bg-red-500/10 border-red-500';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500';
    }
  }

  function getScoreColor(score: number) {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  const latestReport = reports[0];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-[#2B2B2B] bg-[#0D0D0D]/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#F36F21]">Website Monitoring</h1>
              <p className="text-[#B4B4B4] mt-1">Performance & SEO monitoring system powered by Claude Agent SDK</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/server"
                className="px-4 py-2 bg-[#2B2B2B] hover:bg-[#3F3F3F] rounded-lg border border-[#3F3F3F] transition-colors"
              >
                ← Back to Server
              </Link>

              <button
                onClick={runMonitoringCheck}
                disabled={running}
                className="px-6 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {running ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Check
                  </>
                )}
              </button>
              <p className="text-xs text-[#B4B4B4] mt-2">
                ℹ️ Monitoring běží automaticky v GitHub Actions každé 2 hodiny
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#F36F21] text-white'
                  : 'bg-[#2B2B2B] text-[#B4B4B4] hover:bg-[#3F3F3F]'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-[#F36F21] text-white'
                  : 'bg-[#2B2B2B] text-[#B4B4B4] hover:bg-[#3F3F3F]'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'docs'
                  ? 'bg-[#F36F21] text-white'
                  : 'bg-[#2B2B2B] text-[#B4B4B4] hover:bg-[#3F3F3F]'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documentation
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-red-500 font-medium">Error</p>
              <p className="text-red-500/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-[#3F3F3F] border-t-[#F36F21] rounded-full animate-spin" />
                  <p className="mt-4 text-[#B4B4B4]">Loading monitoring data...</p>
                </div>
              </div>
            ) : latestReport ? (
              <>
                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-[#B4B4B4]">Overall Status</h3>
                      <Activity className="w-5 h-5 text-[#F36F21]" />
                    </div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(latestReport.overallStatus)}`}>
                      {latestReport.overallStatus === 'GREEN' && <CheckCircle className="w-4 h-4" />}
                      {latestReport.overallStatus === 'YELLOW' && <AlertTriangle className="w-4 h-4" />}
                      {latestReport.overallStatus === 'RED' && <AlertTriangle className="w-4 h-4" />}
                      {latestReport.overallStatus}
                    </div>
                  </div>

                  <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-[#B4B4B4]">Pages Monitored</h3>
                      <Globe className="w-5 h-5 text-[#F36F21]" />
                    </div>
                    <p className="text-3xl font-bold text-white">{latestReport.summary?.totalPages || latestReport.pages.length}</p>
                  </div>

                  <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-[#B4B4B4]">Avg Performance</h3>
                      <Zap className="w-5 h-5 text-[#F36F21]" />
                    </div>
                    <p className={`text-3xl font-bold ${getScoreColor(latestReport.summary?.avgPerformance || 0)}`}>
                      {latestReport.summary?.avgPerformance?.toFixed(0) || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-[#B4B4B4]">Last Check</h3>
                      <Clock className="w-5 h-5 text-[#F36F21]" />
                    </div>
                    <p className="text-sm text-white">
                      {new Date(latestReport.timestamp).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })}
                    </p>
                  </div>
                </div>

                {/* Alerts & Recommendations */}
                {(latestReport.alerts.length > 0 || latestReport.recommendations.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {latestReport.alerts.length > 0 && (
                      <div className="bg-[#2B2B2B] rounded-lg p-6 border border-red-500/30">
                        <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Alerts ({latestReport.alerts.length})
                        </h3>
                        <ul className="space-y-2">
                          {latestReport.alerts.map((alert, idx) => (
                            <li key={idx} className="text-sm text-[#B4B4B4] pl-4 border-l-2 border-red-500">
                              {alert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {latestReport.recommendations.length > 0 && (
                      <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#F36F21]/30">
                        <h3 className="text-xl font-bold text-[#F36F21] mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {latestReport.recommendations.slice(0, 5).map((rec, idx) => (
                            <li key={idx} className="text-sm text-[#B4B4B4] pl-4 border-l-2 border-[#F36F21]">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Page Performance Table */}
                <div className="bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
                  <h3 className="text-xl font-bold text-white mb-4">Page Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#3F3F3F]">
                          <th className="text-left py-3 px-4 text-sm font-medium text-[#B4B4B4]">URL</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">Performance</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">SEO</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">A11y</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">Best Practices</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">FCP (ms)</th>
                          <th className="text-center py-3 px-4 text-sm font-medium text-[#B4B4B4]">LCP (ms)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {latestReport.pages.map((page, idx) => (
                          <tr key={idx} className="border-b border-[#3F3F3F] hover:bg-[#0D0D0D] transition-colors">
                            <td className="py-3 px-4 text-sm text-white font-mono">
                              {page.url.replace('http://91.99.126.53:3100', '')}
                            </td>
                            <td className={`py-3 px-4 text-center text-sm font-bold ${getScoreColor(page.lighthouse.performance)}`}>
                              {page.lighthouse.performance}
                            </td>
                            <td className={`py-3 px-4 text-center text-sm font-bold ${getScoreColor(page.lighthouse.seo)}`}>
                              {page.lighthouse.seo}
                            </td>
                            <td className={`py-3 px-4 text-center text-sm font-bold ${getScoreColor(page.lighthouse.accessibility)}`}>
                              {page.lighthouse.accessibility}
                            </td>
                            <td className={`py-3 px-4 text-center text-sm font-bold ${getScoreColor(page.lighthouse.bestPractices)}`}>
                              {page.lighthouse.bestPractices}
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-[#B4B4B4]">
                              {page.metrics?.firstContentfulPaint?.toFixed(0) || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-[#B4B4B4]">
                              {page.metrics?.largestContentfulPaint?.toFixed(0) || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-[#B4B4B4] mx-auto mb-4" />
                <p className="text-[#B4B4B4] mb-4">No monitoring reports found</p>
                <button
                  onClick={runMonitoringCheck}
                  className="px-6 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg font-medium transition-colors"
                >
                  Run First Check
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List */}
            <div className="lg:col-span-1 bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F] max-h-[800px] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Report History</h3>
              <div className="space-y-2">
                {reports.map((report, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedReport?.filename === report.filename
                        ? 'bg-[#F36F21] border-[#F36F21] text-white'
                        : 'bg-[#0D0D0D] border-[#3F3F3F] hover:border-[#F36F21] text-[#B4B4B4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(report.overallStatus)}`}>
                        {report.overallStatus}
                      </span>
                      <span className="text-xs">
                        {new Date(report.timestamp).toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' })}
                      </span>
                    </div>
                    <p className="text-xs mt-2">
                      {new Date(report.timestamp).toLocaleTimeString('cs-CZ', { timeZone: 'Europe/Prague' })}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2 bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
              {selectedReport ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Report Detail</h3>
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(selectedReport, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = selectedReport.filename;
                        a.click();
                      }}
                      className="px-4 py-2 bg-[#0D0D0D] hover:bg-[#3F3F3F] rounded-lg border border-[#3F3F3F] transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>

                  <pre className="bg-[#0D0D0D] rounded-lg p-4 text-xs text-[#B4B4B4] overflow-x-auto max-h-[600px] overflow-y-auto font-mono">
                    {JSON.stringify(selectedReport, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Eye className="w-16 h-16 text-[#B4B4B4] mx-auto mb-4" />
                  <p className="text-[#B4B4B4]">Select a report to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Docs List */}
            <div className="lg:col-span-1 bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F] max-h-[800px] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">Documentation Files</h3>
              <div className="space-y-2">
                {docs.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => viewDoc(doc.filename)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedDoc?.filename === doc.filename
                        ? 'bg-[#F36F21] border-[#F36F21] text-white'
                        : 'bg-[#0D0D0D] border-[#3F3F3F] hover:border-[#F36F21] text-[#B4B4B4]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileCode className="w-4 h-4" />
                      <span className="font-mono text-sm">{doc.filename}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span>{(doc.size / 1024).toFixed(1)} KB</span>
                      <span>{new Date(doc.modified).toLocaleDateString('cs-CZ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Doc Viewer */}
            <div className="lg:col-span-2 bg-[#2B2B2B] rounded-lg p-6 border border-[#3F3F3F]">
              {selectedDoc ? (
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">{selectedDoc.filename}</h3>
                  <pre className="bg-[#0D0D0D] rounded-lg p-4 text-xs text-[#B4B4B4] overflow-x-auto max-h-[600px] overflow-y-auto font-mono whitespace-pre-wrap">
                    {selectedDoc.content}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-[#B4B4B4] mx-auto mb-4" />
                  <p className="text-[#B4B4B4]">Select a file to view its contents</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
