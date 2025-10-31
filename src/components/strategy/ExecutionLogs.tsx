'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExecutionLog {
  id: string;
  task_id: string;
  agent_name: string | null;
  execution_type: string;
  trigger_source: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
  tokens_used: number | null;
  api_cost: number | null;
  error_message: string | null;
  model_used: string;
  output_quality_score: number | null;
}

interface ExecutionLogsProps {
  logs?: ExecutionLog[];
  title?: string;
  showFilters?: boolean;
}

export function ExecutionLogs({
  logs: initialLogs = [],
  title = 'Logy spuštění agentů',
  showFilters = true
}: ExecutionLogsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'running'>('all');

  // Filter logs based on selected status
  const filteredLogs = filter === 'all'
    ? initialLogs
    : initialLogs.filter(log => log.status === filter);

  const statusColors = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    running: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const statusIcons = {
    success: '✓',
    failed: '✕',
    running: '⟳',
    cancelled: '⊘',
  };

  if (initialLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-steel-dim">
        <p>Žádné záznamy spuštění</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {showFilters && (
        <div className="flex gap-2">
          {['all', 'success', 'failed', 'running'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'bg-graphite text-steel-dim hover:text-steel'
              }`}
            >
              {f === 'all' && 'Všechny'}
              {f === 'success' && 'Úspěšné'}
              {f === 'failed' && 'Chyby'}
              {f === 'running' && 'Spuštěné'}
            </button>
          ))}
        </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-graphite rounded-lg border border-graphite-light/30 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-graphite-light/20 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 text-left">
                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded text-sm font-semibold border ${statusColors[log.status]}`}
                >
                  {statusIcons[log.status]} {log.status === 'running' ? 'Spuštěno' : log.status === 'success' ? 'Úspěšně' : log.status === 'failed' ? 'Chyba' : 'Zrušeno'}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {log.agent_name || 'System'} • {log.execution_type}
                  </h3>
                  <div className="text-sm text-steel-dim mt-1 flex gap-3">
                    <span>{new Date(log.started_at).toLocaleDateString('cs-CZ')}</span>
                    <span>•</span>
                    <span>{log.trigger_source}</span>
                    {log.duration_ms && (
                      <>
                        <span>•</span>
                        <span>{(log.duration_ms / 1000).toFixed(1)}s</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="text-right">
                  {log.tokens_used && (
                    <p className="text-sm text-steel-dim">
                      {log.tokens_used.toLocaleString()} tokenů
                    </p>
                  )}
                  {log.api_cost && (
                    <p className="text-sm text-steel-dim">
                      ${log.api_cost.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-steel-dim">
                <ChevronDown size={20} className={`transition-transform ${expandedId === log.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Expanded Details */}
            {expandedId === log.id && (
              <div className="px-6 py-4 border-t border-graphite-light/30 bg-graphite-light/10 space-y-4">
                {/* Grid of Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-steel-dim mb-1">Typ spuštění</p>
                    <p className="text-sm text-white">{log.execution_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-dim mb-1">Zdroj</p>
                    <p className="text-sm text-white">{log.trigger_source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-dim mb-1">Model</p>
                    <p className="text-sm text-white font-mono">{log.model_used}</p>
                  </div>
                  <div>
                    <p className="text-xs text-steel-dim mb-1">Trvání</p>
                    <p className="text-sm text-white">
                      {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(2)}s` : 'N/A'}
                    </p>
                  </div>
                  {log.tokens_used && (
                    <div>
                      <p className="text-xs text-steel-dim mb-1">Tokeny</p>
                      <p className="text-sm text-white">
                        {log.tokens_used.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {log.api_cost && (
                    <div>
                      <p className="text-xs text-steel-dim mb-1">Cena</p>
                      <p className="text-sm text-white">${log.api_cost.toFixed(4)}</p>
                    </div>
                  )}
                  {log.output_quality_score && (
                    <div>
                      <p className="text-xs text-steel-dim mb-1">Kvalita výstupu</p>
                      <p className="text-sm text-white">
                        {(log.output_quality_score * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-steel-dim mb-1">Čas zahájení</p>
                    <p className="text-sm text-white">
                      {new Date(log.started_at).toLocaleTimeString('cs-CZ')}
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {log.error_message && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-xs text-red-400 font-semibold mb-1">Chyba:</p>
                    <p className="text-sm text-red-300 font-mono">{log.error_message}</p>
                  </div>
                )}

                {/* Task ID */}
                <div className="p-3 bg-carbon rounded border border-graphite-light/30">
                  <p className="text-xs text-steel-dim mb-1">ID Úkolu</p>
                  <p className="text-sm text-steel font-mono break-all">{log.task_id}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-steel-dim">
            <p>Žádné logy k zobrazení</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-graphite-light/30">
        <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
          <p className="text-steel-dim text-sm">Celkem spuštění</p>
          <p className="text-2xl font-bold text-white mt-2">{filteredLogs.length}</p>
        </div>
        <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
          <p className="text-steel-dim text-sm">Úspěšná spuštění</p>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {initialLogs.filter((l) => l.status === 'success').length}
          </p>
        </div>
        <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
          <p className="text-steel-dim text-sm">Celkové náklady</p>
          <p className="text-2xl font-bold text-accent mt-2">
            $
            {initialLogs
              .reduce((sum, l) => sum + (l.api_cost || 0), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
          <p className="text-steel-dim text-sm">Průměrná kvalita</p>
          <p className="text-2xl font-bold text-blue-400 mt-2">
            {initialLogs.length > 0
              ? (
                  (initialLogs
                    .filter((l) => l.output_quality_score)
                    .reduce((sum, l) => sum + (l.output_quality_score || 0), 0) /
                    initialLogs.filter((l) => l.output_quality_score).length) *
                  100
                ).toFixed(0)
              : 'N/A'}
            %
          </p>
        </div>
      </div>
    </div>
  );
}
