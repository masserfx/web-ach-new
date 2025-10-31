'use client';

import { useState, useEffect } from 'react';

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
  const [filter, setFilter] = useState('node');

  useEffect(() => {
    fetchProcesses();
  }, [filter]);

  async function fetchProcesses() {
    setLoading(true);

    try {
      const filterMap: Record<string, string> = {
        node: 'node',
        npm: 'npm',
        docker: 'docker',
        postgres: 'postgres',
      };

      const cmd = filterMap[filter] || 'node';

      // This would fetch from an API endpoint
      // For now, we'll create a mock list
      const mockProcesses: Process[] = [
        {
          pid: 1234,
          name: 'node',
          command: '/usr/bin/node /home/leos/ac-heating-web-new/.next/standalone/server.js',
        },
      ];

      setProcesses(mockProcesses);
    } catch (error) {
      console.error('Failed to fetch processes:', error);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Processes</h2>
          <p className="text-sm text-[#B4B4B4] mt-1">Monitor running system processes</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 bg-[#0D0D0D] border border-[#3F3F3F] rounded-lg text-white text-sm"
        >
          <option value="node">Node.js</option>
          <option value="npm">npm</option>
          <option value="docker">Docker</option>
          <option value="postgres">PostgreSQL</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#B4B4B4]">Loading processes...</p>
        </div>
      ) : processes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#B4B4B4]">No processes found for filter: {filter}</p>
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
