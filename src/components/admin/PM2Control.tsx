'use client';

import { useState, useEffect } from 'react';
import { Play, Square, RotateCw, Trash2, FileText, Activity } from 'lucide-react';

interface PM2Process {
  name: string;
  pid: number;
  status: string;
  pm_id: number;
  cpu: number;
  memory: number;
  uptime: number;
  restarts: number;
}

interface PM2ControlProps {
  onRefresh: () => void;
}

export function PM2Control({ onRefresh }: PM2ControlProps) {
  const [processes, setProcesses] = useState<PM2Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    fetchProcesses();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchProcesses() {
    try {
      const response = await fetch('/api/admin/pm2');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setProcesses(data.processes || []);
      setError(null);
    } catch (error: any) {
      console.error('Failed to fetch PM2 processes:', error);
      setError(error.message);
      setProcesses([]);
    }
  }

  async function handleAction(action: string, appName: string) {
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${appName}?`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/pm2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, appName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || response.statusText);
      }

      const data = await response.json();

      // Show success message immediately
      alert(data.message);

      // For restart action, wait a bit before refreshing (server is restarting)
      if (action === 'restart') {
        alert('Server is restarting... Please wait 5 seconds for the process to come back online.');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Refresh processes list with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          await fetchProcesses();
          onRefresh();
          break;
        } catch (err) {
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            throw err;
          }
        }
      }
    } catch (error: any) {
      console.error(`Error executing ${action}:`, error);
      const errorMsg = error.message || 'Failed to fetch';
      setError(errorMsg);

      if (errorMsg.includes('fetch')) {
        alert(`Connection error: Server might be restarting. Please refresh the page in a few seconds.`);
      } else {
        alert(`Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function viewLogs(appName: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/pm2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logs', appName, lines: 100 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || response.statusText);
      }

      const data = await response.json();
      setLogs(data.result);
      setShowLogs(true);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function formatUptime(uptime: number) {
    if (!uptime) return 'N/A';

    const now = Date.now();
    const diff = now - uptime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  function formatMemory(bytes: number) {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'errored':
        return 'bg-red-600';
      case 'launching':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className="bg-[#2B2B2B] rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#F36F21]" />
            PM2 Process Manager
          </h2>
          <p className="text-sm text-[#B4B4B4] mt-1">
            Manage Next.js application processes independently
          </p>
        </div>

        <button
          onClick={fetchProcesses}
          disabled={loading}
          className="px-4 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Processes list */}
      {processes.length === 0 ? (
        <div className="text-center py-8 border border-[#3F3F3F] rounded-lg">
          <p className="text-[#B4B4B4]">No PM2 processes running</p>
          <p className="text-sm text-[#666666] mt-2">
            Run <code className="px-2 py-1 bg-[#0D0D0D] rounded">./scripts/setup-pm2.sh</code> to setup PM2
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {processes.map((proc) => (
            <div
              key={proc.pm_id}
              className="bg-[#0D0D0D] rounded-lg p-4 border border-[#3F3F3F]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(proc.status)}`} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{proc.name}</h3>
                    <p className="text-sm text-[#B4B4B4]">
                      PID: {proc.pid || 'N/A'} • PM2 ID: {proc.pm_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {proc.status === 'stopped' ? (
                    <button
                      onClick={() => handleAction('start', proc.name)}
                      disabled={loading}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                      title="Start"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction('stop', proc.name)}
                      disabled={loading}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors disabled:opacity-50"
                      title="Stop"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleAction('restart', proc.name)}
                    disabled={loading}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                    title="Restart"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => viewLogs(proc.name)}
                    disabled={loading}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:opacity-50"
                    title="View Logs"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAction('delete', proc.name)}
                    disabled={loading}
                    className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[#B4B4B4] mb-1">Status</p>
                  <p className="text-sm font-semibold text-white capitalize">{proc.status}</p>
                </div>

                <div>
                  <p className="text-xs text-[#B4B4B4] mb-1">CPU</p>
                  <p className="text-sm font-semibold text-white">{proc.cpu.toFixed(1)}%</p>
                </div>

                <div>
                  <p className="text-xs text-[#B4B4B4] mb-1">Memory</p>
                  <p className="text-sm font-semibold text-white">{formatMemory(proc.memory)}</p>
                </div>

                <div>
                  <p className="text-xs text-[#B4B4B4] mb-1">Uptime</p>
                  <p className="text-sm font-semibold text-white">{formatUptime(proc.uptime)}</p>
                </div>

                <div>
                  <p className="text-xs text-[#B4B4B4] mb-1">Restarts</p>
                  <p className="text-sm font-semibold text-white">{proc.restarts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D0D0D] rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden border border-[#3F3F3F]">
            <div className="flex items-center justify-between p-4 border-b border-[#3F3F3F]">
              <h3 className="text-lg font-semibold text-white">Process Logs</h3>
              <button
                onClick={() => setShowLogs(false)}
                className="text-[#B4B4B4] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <pre className="text-xs text-[#B4B4B4] font-mono whitespace-pre-wrap">
                {logs || 'No logs available'}
              </pre>
            </div>

            <div className="p-4 border-t border-[#3F3F3F] flex justify-end">
              <button
                onClick={() => setShowLogs(false)}
                className="px-4 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
