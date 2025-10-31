'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Process {
  pid: number;
  name: string;
  command: string;
}

interface ProcessListProps {
  onRefresh: () => void;
}

export function ProcessList({ onRefresh }: ProcessListProps) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcesses();
  }, []);

  async function fetchProcesses() {
    setLoading(true);
    setError(null);

    try {
      const url = searchTerm
        ? `/api/admin/processes?filter=${encodeURIComponent(searchTerm)}`
        : '/api/admin/processes';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setProcesses(data.processes || []);
    } catch (error: any) {
      console.error('Failed to fetch processes:', error);
      setError(error.message);
      setProcesses([]);
    } finally {
      setLoading(false);
    }
  }

  // Trigger search when search term changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProcesses();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  async function handleKillProcess(pid: number) {
    if (!confirm(`Kill process ${pid}?`)) return;

    try {
      const response = await fetch('/api/admin/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          service: 'port-process',
          options: { port: 0, force: true }, // This would need a dedicated endpoint
        }),
      });

      const data = await response.json();
      alert(data.message);
      onRefresh();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div className="bg-[#2B2B2B] rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Processes</h2>
            <p className="text-sm text-[#B4B4B4] mt-1">Monitor running Node.js and npm processes</p>
          </div>

          <button
            onClick={fetchProcesses}
            disabled={loading}
            className="px-4 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B4B4B4]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search processes by name or command..."
            className="w-full pl-10 pr-4 py-2 bg-[#0D0D0D] border border-[#3F3F3F] rounded-lg text-white text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#F36F21]"
          />
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {loading && processes.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-[#3F3F3F] border-t-[#F36F21] rounded-full animate-spin" />
            <p className="text-[#B4B4B4] mt-3 text-sm">Loading processes...</p>
          </div>
        </div>
      ) : processes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#B4B4B4]">
            {searchTerm
              ? `No processes found matching "${searchTerm}"`
              : 'No Node.js or npm processes found'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3F3F3F] text-[#B4B4B4]">
                <th className="text-left p-3">PID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Command</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr
                  key={process.pid}
                  className="border-b border-[#3F3F3F] hover:bg-[#0D0D0D]/50 transition-colors"
                >
                  <td className="p-3 font-mono text-white">{process.pid}</td>
                  <td className="p-3 text-white font-semibold">{process.name}</td>
                  <td className="p-3 text-[#B4B4B4] truncate font-mono text-xs">
                    {process.command}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleKillProcess(process.pid)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                    >
                      Kill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
