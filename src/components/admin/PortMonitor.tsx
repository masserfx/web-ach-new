'use client';

import { useState } from 'react';
import { StatusIndicator } from './StatusIndicator';

interface Port {
  port: number;
  service: string;
  status: 'listening' | 'closed';
  pid?: number;
}

interface PortMonitorProps {
  ports: Port[];
  onRefresh: () => void;
}

const MONITORED_PORTS = [
  { port: 3100, expectedService: 'Next.js Dev', category: 'Web Server' },
  { port: 54321, expectedService: 'Supabase API Gateway', category: 'Database' },
  { port: 54322, expectedService: 'PostgreSQL', category: 'Database' },
  { port: 54323, expectedService: 'Supabase Studio', category: 'Database' },
  { port: 8765, expectedService: 'Browser MCP', category: 'Tools' },
];

export function PortMonitor({ ports, onRefresh }: PortMonitorProps) {
  const [loading, setLoading] = useState<number | null>(null);

  async function handleKillPort(port: number) {
    if (!confirm(`Kill process on port ${port}?`)) return;

    setLoading(port);

    try {
      const response = await fetch('/api/admin/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          service: 'port-process',
          options: { port, force: true },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to kill process');
      }

      alert(data.message);

      // Refresh stats
      setTimeout(() => {
        onRefresh();
      }, 1000);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  }

  const portsByCategory = MONITORED_PORTS.reduce(
    (acc, expected) => {
      const category = expected.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(expected);
      return acc;
    },
    {} as Record<string, typeof MONITORED_PORTS>
  );

  return (
    <div className="bg-[#2B2B2B] rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-1 text-white">Port Monitor</h2>
      <p className="text-sm text-[#B4B4B4] mb-6">Monitor active ports and services</p>

      {Object.entries(portsByCategory).map(([category, categoryPorts]) => (
        <div key={category} className="mb-8 last:mb-0">
          <h3 className="text-sm font-semibold text-[#F36F21] uppercase mb-4">
            {category}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryPorts.map((expected) => {
              const actual = ports.find((p) => p.port === expected.port);
              const isListening = actual?.status === 'listening';

              return (
                <div
                  key={expected.port}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    isListening
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-lg font-bold text-white">
                        :{expected.port}
                      </div>
                      <p className="text-xs text-[#B4B4B4]">
                        {expected.expectedService}
                      </p>
                    </div>
                    <StatusIndicator
                      status={isListening ? 'listening' : 'closed'}
                      size="sm"
                    />
                  </div>

                  {actual && isListening && (
                    <div className="space-y-2 mb-4 text-xs">
                      <div>
                        <span className="text-[#B4B4B4]">Service: </span>
                        <span className="text-white">{expected.expectedService}</span>
                      </div>
                      {actual.pid && (
                        <div>
                          <span className="text-[#B4B4B4]">PID: </span>
                          <span className="text-white">{actual.pid}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isListening && (
                    <button
                      onClick={() => handleKillPort(expected.port)}
                      disabled={loading === expected.port}
                      className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading === expected.port ? 'Killing...' : 'Kill Process'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
