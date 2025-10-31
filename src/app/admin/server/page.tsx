'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServerStats } from '@/components/admin/ServerStats';
import { ServiceControl } from '@/components/admin/ServiceControl';
import { PortMonitor } from '@/components/admin/PortMonitor';
import { ProcessList } from '@/components/admin/ProcessList';
import { PM2Control } from '@/components/admin/PM2Control';
import { Activity, AlertTriangle, X } from 'lucide-react';

interface ServerStatsData {
  system: any;
  cpu: any;
  memory: any;
  disk: any;
  load: any;
  network: any;
  services: any[];
  ports: any[];
  database: any;
  timestamp: string;
}

interface Alert {
  id: string;
  type: 'cpu' | 'memory' | 'disk';
  message: string;
  severity: 'warning' | 'critical';
}

export default function ServerMonitorPage() {
  const [stats, setStats] = useState<ServerStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchServerStats();

    if (!autoRefresh) return;

    const interval = setInterval(fetchServerStats, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  async function fetchServerStats() {
    try {
      const response = await fetch('/api/admin/server-stats');

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);
      setError(null);

      // Check for critical alerts
      checkForAlerts(data);
    } catch (err: any) {
      console.error('Error fetching server stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function checkForAlerts(data: ServerStatsData) {
    const newAlerts: Alert[] = [];

    // CPU Alert
    if (data.cpu.usage > 90) {
      newAlerts.push({
        id: 'cpu-critical',
        type: 'cpu',
        message: `CPU usage is critically high: ${data.cpu.usage.toFixed(1)}%`,
        severity: 'critical',
      });
    }

    // Memory Alert
    if (data.memory.percentage > 90) {
      newAlerts.push({
        id: 'memory-critical',
        type: 'memory',
        message: `Memory usage is critically high: ${data.memory.percentage.toFixed(1)}%`,
        severity: 'critical',
      });
    }

    // Disk Alert
    if (data.disk.percentage > 90) {
      newAlerts.push({
        id: 'disk-critical',
        type: 'disk',
        message: `Disk usage is critically high: ${data.disk.percentage}%`,
        severity: 'critical',
      });
    }

    setAlerts(newAlerts);
  }

  function dismissAlert(alertId: string) {
    setDismissedAlerts(prev => new Set(prev).add(alertId));

    // Auto-remove from dismissed after 10 seconds
    setTimeout(() => {
      setDismissedAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }, 10000);
  }

  // Filter out dismissed alerts
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-[#2B2B2B] bg-[#0D0D0D]/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          {/* Critical Alerts */}
          {visibleAlerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {visibleAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-red-500/10 border-2 border-red-500 rounded-lg animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-500">Critical Alert</p>
                      <p className="text-sm text-red-400">{alert.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    title="Dismiss for 10 seconds"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#F36F21]">Server Monitor</h1>
              <p className="text-[#B4B4B4] mt-1">Live system monitoring & service management</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Website Monitoring Link */}
              <Link
                href="/admin/monitoring"
                className="px-4 py-2 bg-gradient-to-r from-[#F36F21] to-[#FF8F3C] hover:shadow-lg rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Website Monitoring
              </Link>

              {/* Auto-refresh toggle */}
              <label className="flex items-center gap-2 px-4 py-2 bg-[#2B2B2B] rounded-lg border border-[#3F3F3F]">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium">Auto-refresh</span>
              </label>

              {/* Refresh interval selector */}
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                disabled={!autoRefresh}
                className="px-4 py-2 bg-[#2B2B2B] border border-[#3F3F3F] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={2000}>2s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
              </select>

              {/* Manual refresh button */}
              <button
                onClick={fetchServerStats}
                disabled={loading}
                className="px-6 py-2 bg-[#F36F21] hover:bg-[#F36F21]/90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                stats ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-[#B4B4B4]">
              {stats ? `Last updated: ${new Date(stats.timestamp).toLocaleTimeString('cs-CZ')}` : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        {/* Error alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 font-medium">Error loading server stats</p>
            <p className="text-red-500/80 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && !stats ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-[#3F3F3F] border-t-[#F36F21] rounded-full animate-spin" />
              <p className="mt-4 text-[#B4B4B4]">Loading system information...</p>
            </div>
          </div>
        ) : stats ? (
          <>
            {/* System Stats Cards */}
            <ServerStats stats={stats} />

            {/* PM2 Process Manager */}
            <PM2Control onRefresh={fetchServerStats} />

            {/* Service Control Panel */}
            <ServiceControl services={stats.services} onRefresh={fetchServerStats} />

            {/* Port Monitor */}
            <PortMonitor ports={stats.ports} onRefresh={fetchServerStats} />

            {/* Database Status */}
            <div className="bg-[#2B2B2B] rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-1 text-white">Database Status</h2>
              <p className="text-sm text-[#B4B4B4] mb-6">PostgreSQL connection information</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#3F3F3F]">
                  <p className="text-sm text-[#B4B4B4] mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        stats.database.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="font-semibold text-white capitalize">
                      {stats.database.status}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#3F3F3F]">
                  <p className="text-sm text-[#B4B4B4] mb-2">Host</p>
                  <p className="font-semibold text-white">{stats.database.host}</p>
                </div>

                <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#3F3F3F]">
                  <p className="text-sm text-[#B4B4B4] mb-2">Port</p>
                  <p className="font-semibold text-white">{stats.database.port}</p>
                </div>

                <div className="bg-[#0D0D0D] rounded-lg p-4 border border-[#3F3F3F]">
                  <p className="text-sm text-[#B4B4B4] mb-2">Type</p>
                  <p className="font-semibold text-white">{stats.database.type}</p>
                </div>
              </div>

              {stats.database.version && (
                <div className="mt-4 p-4 bg-[#0D0D0D] rounded-lg border border-[#3F3F3F]">
                  <p className="text-sm text-[#B4B4B4] mb-2">Version</p>
                  <p className="text-sm text-white font-mono">{stats.database.version}</p>
                </div>
              )}
            </div>

            {/* Process List */}
            <ProcessList onRefresh={fetchServerStats} />

            {/* System Info Footer */}
            <div className="mt-8 p-4 bg-[#2B2B2B] rounded-lg border border-[#3F3F3F]">
              <p className="text-xs text-[#B4B4B4]">
                {stats.system.platform} • {stats.system.arch} • {stats.system.cpuModel}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
