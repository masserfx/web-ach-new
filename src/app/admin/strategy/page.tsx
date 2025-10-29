'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StrategyChecklist } from '@/components/strategy/StrategyChecklist';
import { StrategyKanban } from '@/components/strategy/StrategyKanban';
import { ApprovalQueue } from '@/components/strategy/ApprovalQueue';
import { ProgressMetrics } from '@/components/strategy/ProgressMetrics';
import { ExecutionLogs } from '@/components/strategy/ExecutionLogs';

type TabType = 'overview' | 'kanban' | 'approvals' | 'metrics' | 'logs';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingApprovals: number;
  averageQuality: number;
  successRate: number;
}

export default function StrategyDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingApprovals: 0,
    averageQuality: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  async function loadDashboardStats() {
    try {
      // Celkový počet tasků
      const { data: tasks } = await supabase
        .from('strategy_tasks')
        .select('id, status, quality_score', { count: 'exact' });

      if (tasks) {
        const completed = tasks.filter((t) => t.status === 'done').length;
        const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
        const avgQuality = tasks
          .filter((t) => t.quality_score)
          .reduce((sum, t) => sum + (t.quality_score || 0), 0) / tasks.length;

        setStats((prev) => ({
          ...prev,
          totalTasks: tasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          averageQuality: Math.round(avgQuality * 100) / 100,
          successRate: Math.round((completed / tasks.length) * 100),
        }));
      }

      // Počet čekajících schválení
      const { data: approvals } = await supabase
        .from('task_approvals')
        .select('id, review_status', { count: 'exact' });

      if (approvals) {
        const pending = approvals.filter((a) => a.review_status === 'pending').length;
        setStats((prev) => ({
          ...prev,
          pendingApprovals: pending,
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'overview', label: 'Přehled Strategie', icon: '🎯' },
    { id: 'kanban', label: 'Kanban Board', icon: '📋' },
    { id: 'approvals', label: 'Schválení', icon: '✓' },
    { id: 'metrics', label: 'Metriky', icon: '📊' },
    { id: 'logs', label: 'Logy', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <header className="border-b border-graphite-light bg-carbon/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-accent">Strategie - Implementace</h1>
            <p className="text-steel-dim mt-1">AI-powered Strategy Implementation System</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">Celkem úkolů</p>
              <p className="text-2xl font-bold text-accent mt-1">{stats.totalTasks}</p>
            </div>
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">Hotovo</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.completedTasks}</p>
            </div>
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">V procesu</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.inProgressTasks}</p>
            </div>
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">Čekající</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pendingApprovals}</p>
            </div>
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">Kvalita ⌀</p>
              <p className="text-2xl font-bold text-accent mt-1">
                {(stats.averageQuality * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-graphite rounded-lg p-4 border border-graphite-light/30">
              <p className="text-steel-dim text-sm">Úspěšnost</p>
              <p className="text-2xl font-bold text-green-500 mt-1">{stats.successRate}%</p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-graphite-light/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-steel-dim hover:text-steel'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-steel-dim">Načítání...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <StrategyChecklist />
            )}
            {activeTab === 'kanban' && (
              <StrategyKanban onRefresh={loadDashboardStats} />
            )}
            {activeTab === 'approvals' && (
              <ApprovalQueue onRefresh={loadDashboardStats} />
            )}
            {activeTab === 'metrics' && (
              <ProgressMetrics stats={stats} />
            )}
            {activeTab === 'logs' && (
              <ExecutionLogs />
            )}
          </>
        )}
      </div>
    </div>
  );
}
