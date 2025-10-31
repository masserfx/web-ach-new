'use client';

import { useState } from 'react';
import { StatusIndicator } from './StatusIndicator';
import { formatUptime } from './utils';

interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  port?: number;
}

interface ServiceControlProps {
  services: Service[];
  onRefresh: () => void;
}

export function ServiceControl({ services, onRefresh }: ServiceControlProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceMap: Record<string, string> = {
    'Next.js Dev': 'next-dev',
    'Supabase API': 'supabase',
    'PostgreSQL': 'supabase',
    'Supabase Studio': 'supabase',
    'Browser MCP': 'browser-mcp',
  };

  async function handleAction(service: Service, action: 'restart' | 'stop' | 'start') {
    setLoading(service.name);
    setError(null);

    try {
      const serviceName = serviceMap[service.name] || 'unknown';

      const response = await fetch('/api/admin/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceName,
          action,
          options: service.port ? { port: service.port } : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} ${service.name}`);
      }

      // Show success message
      alert(`${service.name}: ${action} - ${data.message}`);

      // Refresh stats after a delay
      setTimeout(() => {
        onRefresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="bg-[#2B2B2B] rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-1 text-white">Services</h2>
      <p className="text-sm text-[#B4B4B4] mb-6">Manage running services and applications</p>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg border border-[#3F3F3F] hover:border-[#555555] transition-colors"
          >
            <div className="flex items-center gap-4">
              <StatusIndicator status={service.status} size="md" />
              <div>
                <h3 className="font-semibold text-white">{service.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-[#B4B4B4]">
                  {service.pid && <span>PID: {service.pid}</span>}
                  {service.port && <span>Port: {service.port}</span>}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {service.status === 'stopped' && (
                <button
                  onClick={() => handleAction(service, 'start')}
                  disabled={loading === service.name}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === service.name ? 'Starting...' : 'Start'}
                </button>
              )}

              {service.status === 'running' && (
                <>
                  <button
                    onClick={() => handleAction(service, 'restart')}
                    disabled={loading === service.name}
                    className="px-4 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === service.name ? 'Restarting...' : 'Restart'}
                  </button>
                  <button
                    onClick={() => handleAction(service, 'stop')}
                    disabled={loading === service.name}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === service.name ? 'Stopping...' : 'Stop'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
