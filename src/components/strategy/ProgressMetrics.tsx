'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Milestone {
  id: string;
  name: string;
  phase: string;
  target_date: string;
  progress_percentage: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  total_tasks: number;
  completed_tasks: number;
}

interface CategoryBreakdown {
  category: string;
  total: number;
  completed: number;
  percentage: number;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingApprovals: number;
  averageQuality: number;
  successRate: number;
}

interface ProgressMetricsProps {
  stats: DashboardStats;
}

export function ProgressMetrics({ stats }: ProgressMetricsProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      // Load milestones
      const { data: milestonesData } = await supabase
        .from('strategy_milestones')
        .select('*')
        .order('target_date', { ascending: true });

      if (milestonesData) {
        setMilestones(milestonesData as Milestone[]);
      }

      // Load category breakdown
      const { data: categoriesData } = await supabase.rpc('get_category_breakdown');

      if (categoriesData) {
        setCategories(categoriesData as CategoryBreakdown[]);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusColors = {
    not_started: 'bg-slate-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    delayed: 'bg-red-500',
  };

  const statusLabels = {
    not_started: 'Nezahájena',
    in_progress: 'V procesu',
    completed: 'Dokončena',
    delayed: 'Zpožděna',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-steel-dim">Načítám metriky...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <section>
        <h3 className="text-lg font-bold mb-6">Celkový pokrok</h3>

        {/* Progress Bar */}
        <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-steel-dim">Dokončeno</p>
            <p className="text-2xl font-bold text-accent">
              {stats.successRate}%
            </p>
          </div>
          <div className="w-full bg-graphite-light/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent to-accent/70 h-full transition-all duration-300"
              style={{ width: `${stats.successRate}%` }}
            />
          </div>
          <p className="text-sm text-steel-dim mt-3">
            {stats.completedTasks} z {stats.totalTasks} úkolů
          </p>
        </div>
      </section>

      {/* Quality Metrics */}
      <section>
        <h3 className="text-lg font-bold mb-6">Metriky kvality</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Quality */}
          <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
            <p className="text-steel-dim text-sm mb-3">Průměrná kvalita</p>
            <p className="text-3xl font-bold text-accent">
              {(stats.averageQuality * 100).toFixed(1)}%
            </p>
            <div className="mt-4 h-2 bg-graphite-light/20 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full"
                style={{ width: `${stats.averageQuality * 100}%` }}
              />
            </div>
          </div>

          {/* Completion Time */}
          <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
            <p className="text-steel-dim text-sm mb-3">Splnění plánů</p>
            <p className="text-3xl font-bold text-green-400">87%</p>
            <p className="text-xs text-steel-dim mt-3">
              Ve srovnání s odhadovaným časem
            </p>
          </div>

          {/* On-time Delivery */}
          <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
            <p className="text-steel-dim text-sm mb-3">Včasné dodání</p>
            <p className="text-3xl font-bold text-blue-400">92%</p>
            <p className="text-xs text-steel-dim mt-3">
              Úkoly dodané včas
            </p>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section>
        <h3 className="text-lg font-bold mb-6">Milníky implementace</h3>

        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-graphite rounded-lg p-5 border border-graphite-light/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{milestone.name}</h4>
                  <p className="text-sm text-steel-dim">
                    {milestone.phase} • Cíl:{' '}
                    {new Date(milestone.target_date).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded text-white ${statusColors[milestone.status]}`}
                >
                  {statusLabels[milestone.status]}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-steel-dim">
                    {milestone.completed_tasks} / {milestone.total_tasks} úkolů
                  </span>
                  <span className="text-accent font-semibold">
                    {milestone.progress_percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-graphite-light/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all"
                    style={{ width: `${milestone.progress_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {milestones.length === 0 && (
            <p className="text-center text-steel-dim py-8">Žádné milníky k zobrazení</p>
          )}
        </div>
      </section>

      {/* Category Breakdown */}
      <section>
        <h3 className="text-lg font-bold mb-6">Pokrok podle kategorií</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="bg-graphite rounded-lg p-5 border border-graphite-light/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white capitalize">{cat.category}</h4>
                <span className="text-sm text-accent font-bold">
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex text-sm text-steel-dim justify-between">
                  <span>{cat.completed} / {cat.total}</span>
                  <span>
                    {cat.total > 0 ? ((cat.completed / cat.total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
                <div className="w-full bg-graphite-light/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all"
                    style={{ width: `${(cat.completed / cat.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-center text-steel-dim py-8 col-span-full">
              Žádné kategorie k zobrazení
            </p>
          )}
        </div>
      </section>

      {/* Timeline Chart */}
      <section>
        <h3 className="text-lg font-bold mb-6">Časová osa</h3>

        <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
          <p className="text-steel-dim text-sm mb-4">Naplánováno na období 9 týdnů</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 text-steel-dim">Týden 1-2</span>
              <div className="flex-1 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-steel-dim">Databáze</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 text-steel-dim">Týden 2-3</span>
              <div className="flex-1 h-2 bg-blue-500 rounded-full" />
              <span className="text-xs text-steel-dim">Admin UI</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 text-steel-dim">Týden 4-5</span>
              <div className="flex-1 h-2 bg-yellow-500 rounded-full" />
              <span className="text-xs text-steel-dim">Python Agenti</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 text-steel-dim">Týden 6-7</span>
              <div className="flex-1 h-2 bg-orange-500 rounded-full" />
              <span className="text-xs text-steel-dim">API & Automation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 text-steel-dim">Týden 8-9</span>
              <div className="flex-1 h-2 bg-red-500 rounded-full" />
              <span className="text-xs text-steel-dim">Testing & Deploy</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
