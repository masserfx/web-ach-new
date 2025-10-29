'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChevronRight, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'in_progress' | 'review' | 'approved' | 'done' | 'blocked';
  category: string;
  priority: number;
  agent_name: string | null;
  progress: number;
  quality_score: number | null;
  created_at: string;
}

interface StrategyKanbanProps {
  onRefresh?: () => void;
}

const statusConfigs = {
  backlog: { label: 'Backlog', color: 'bg-slate-500', position: 0 },
  'in_progress': { label: 'V procesu', color: 'bg-blue-500', position: 1 },
  review: { label: 'Přezkum', color: 'bg-yellow-500', position: 2 },
  approved: { label: 'Schváleno', color: 'bg-green-500', position: 3 },
  done: { label: 'Hotovo', color: 'bg-emerald-600', position: 4 },
  blocked: { label: 'Zablokováno', color: 'bg-red-500', position: 5 },
};

export function StrategyKanban({ onRefresh }: StrategyKanbanProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const { data } = await supabase
        .from('strategy_tasks')
        .select('*')
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (data) {
        setTasks(data as Task[]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId: string, newStatus: Task['status']) {
    try {
      await supabase
        .from('strategy_tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      // Aktualizuj lokální stav
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      onRefresh?.();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const statusKeys = Object.keys(statusConfigs) as Task['status'][];
  const columns = statusKeys.map((status) => ({
    status,
    label: statusConfigs[status].label,
    color: statusConfigs[status].color,
    tasks: tasks.filter((t) => t.status === status),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-steel-dim">Načítám úkoly...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Kanban Board - Správa úkolů</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
          <Plus size={18} />
          Nový úkol
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.status}
            className="bg-graphite rounded-lg p-4 min-h-96 flex flex-col"
          >
            {/* Column Header */}
            <div className="mb-4 pb-3 border-b border-graphite-light/30">
              <h3 className="font-semibold text-steel">{column.label}</h3>
              <p className="text-sm text-steel-dim mt-1">{column.tasks.length} úkolů</p>
            </div>

            {/* Tasks */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="bg-carbon rounded-lg p-3 border border-graphite-light/30 hover:border-accent/50 cursor-pointer transition-all group"
                >
                  {/* Priority indicator */}
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                    task.priority === 1 ? 'bg-red-500' :
                    task.priority === 2 ? 'bg-orange-500' :
                    task.priority === 3 ? 'bg-yellow-500' :
                    'bg-slate-500'
                  }`} />

                  {/* Title */}
                  <h4 className="text-sm font-semibold text-white mb-1 pr-4 line-clamp-2">
                    {task.title}
                  </h4>

                  {/* Metadata */}
                  <div className="text-xs text-steel-dim space-y-1">
                    <p>Kategorie: {task.category}</p>
                    {task.agent_name && <p>Agent: {task.agent_name}</p>}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 bg-graphite-light/20 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>

                  {/* Expanded Details */}
                  {expandedTask === task.id && (
                    <div className="mt-3 pt-3 border-t border-graphite-light/30 space-y-2 text-xs">
                      {task.description && (
                        <p className="text-steel-dim">{task.description.substring(0, 100)}...</p>
                      )}
                      {task.quality_score && (
                        <p className="text-accent">Kvalita: {(task.quality_score * 100).toFixed(0)}%</p>
                      )}
                      <div className="flex gap-2 mt-2 pt-2 border-t border-graphite-light/30">
                        {column.status !== 'done' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = Object.keys(statusConfigs)[
                                statusConfigs[column.status as Task['status']].position + 1
                              ] as Task['status'];
                              if (nextStatus) updateTaskStatus(task.id, nextStatus);
                            }}
                            className="flex-1 text-xs px-2 py-1 bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
                          >
                            Posunout →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {column.tasks.length === 0 && (
                <p className="text-steel-dim text-sm text-center py-8">Žádné úkoly</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
