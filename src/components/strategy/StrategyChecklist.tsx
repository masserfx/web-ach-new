'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: number;
}

interface StrategySection {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
}

export function StrategyChecklist() {
  const [sections, setSections] = useState<StrategySection[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrategyData();
  }, []);

  async function loadStrategyData() {
    try {
      const response = await fetch('/api/strategy/tasks');
      const tasks: Task[] = await response.json();

      if (tasks) {
        // Group by category
        const grouped = tasks.reduce(
          (acc, task) => {
            const category = task.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(task);
            return acc;
          },
          {} as Record<string, any[]>
        );

        // Create sections
        const stratSections: StrategySection[] = [
          {
            id: 'vision',
            name: 'Vize - Brand Positioning',
            category: 'content',
            icon: '🎯',
            description:
              'AC Heating je liderem v komplexních energetických službách. Budování povědomí značky.',
            tasks: grouped.content?.slice(0, 5) || [],
            totalTasks: grouped.content?.length || 0,
            completedTasks:
              grouped.content?.filter((t) => t.status === 'done').length || 0,
          },
          {
            id: 'mission',
            name: 'Mise - Komunikace hodnot',
            category: 'marketing',
            icon: '💬',
            description:
              'Pomáháme snižovat energetickou náročnost. Vytváření messaging strategie.',
            tasks: grouped.marketing?.slice(0, 5) || [],
            totalTasks: grouped.marketing?.length || 0,
            completedTasks:
              grouped.marketing?.filter((t) => t.status === 'done').length || 0,
          },
          {
            id: 'goals',
            name: 'Cíle - Obchodní metriky',
            category: 'business',
            icon: '📊',
            description:
              'Růst z 373M na 522M Kč. Metriky a KPIs. HR plánování 108→129 osob.',
            tasks: grouped.business?.slice(0, 5) || [],
            totalTasks: grouped.business?.length || 0,
            completedTasks:
              grouped.business?.filter((t) => t.status === 'done').length || 0,
          },
          {
            id: 'market',
            name: 'Obchod - 3 segmenty',
            category: 'product',
            icon: '🏠',
            description:
              'Rodinné domy, Bytové domy, B2B. Strategie pro každý segment.',
            tasks: grouped.product?.slice(0, 5) || [],
            totalTasks: grouped.product?.length || 0,
            completedTasks:
              grouped.product?.filter((t) => t.status === 'done').length || 0,
          },
          {
            id: 'seo',
            name: 'SEO & Viditelnost',
            category: 'seo',
            icon: '🔍',
            description:
              'Online viditelnost, SEO optimalizace, PPC, Sociální sítě, Content.',
            tasks: grouped.seo?.slice(0, 5) || [],
            totalTasks: grouped.seo?.length || 0,
            completedTasks:
              grouped.seo?.filter((t) => t.status === 'done').length || 0,
          },
          {
            id: 'ux',
            name: 'Personalizace obsahu',
            category: 'ux',
            icon: '✨',
            description:
              'Tvorba relevantního obsahu pro různé audience. Video, case studies, blogy.',
            tasks: grouped.ux?.slice(0, 5) || [],
            totalTasks: grouped.ux?.length || 0,
            completedTasks: grouped.ux?.filter((t) => t.status === 'done').length || 0,
          },
        ];

        setSections(stratSections);
      }
    } catch (error) {
      console.error('Error loading strategy data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate overall progress
  const totalAll = sections.reduce((sum, s) => sum + s.totalTasks, 0);
  const completedAll = sections.reduce((sum, s) => sum + s.completedTasks, 0);
  const overallProgress = totalAll > 0 ? (completedAll / totalAll) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-steel-dim">Načítám strategii...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-accent/10 to-transparent rounded-lg p-8 border border-accent/20">
        <h2 className="text-2xl font-bold mb-2">Implementace Strategie AC Heating</h2>
        <p className="text-steel-dim mb-6">
          Systematická implementace vize, mise, cílů a obchodní strategie
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-steel">Celkový pokrok</span>
            <span className="text-2xl font-bold text-accent">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="w-full bg-graphite-light/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent via-accent/80 to-accent/60 h-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-sm text-steel-dim">
            {completedAll} / {totalAll} úkolů dokončeno
          </div>
        </div>
      </div>

      {/* Strategy Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const sectionProgress =
            section.totalTasks > 0
              ? (section.completedTasks / section.totalTasks) * 100
              : 0;
          const isExpanded = expandedId === section.id;

          return (
            <div
              key={section.id}
              className="bg-graphite rounded-lg border border-graphite-light/30 overflow-hidden hover:border-accent/50 transition-colors"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-graphite-light/20 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <span className="text-3xl">{section.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{section.name}</h3>
                    <p className="text-sm text-steel-dim mt-1">{section.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-steel-dim">
                          {section.completedTasks} / {section.totalTasks} hotovo
                        </span>
                        <span className="font-bold text-accent">
                          {Math.round(sectionProgress)}%
                        </span>
                      </div>
                      <div className="w-full bg-graphite-light/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-accent h-full transition-all"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-steel-dim">
                  <ChevronDown
                    size={24}
                    className={`transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 py-4 border-t border-graphite-light/30 bg-graphite-light/10 space-y-3">
                  {section.tasks.length > 0 ? (
                    section.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 bg-carbon rounded border border-graphite-light/20 hover:border-accent/30 transition-colors"
                      >
                        {task.status === 'done' ? (
                          <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                        ) : task.status === 'blocked' ? (
                          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                        ) : (
                          <Circle size={20} className="text-steel-dim flex-shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-steel-dim mt-0.5">
                            {task.status === 'done'
                              ? '✓ Hotovo'
                              : task.status === 'in_progress'
                              ? '⟳ V procesu'
                              : task.status === 'review'
                              ? '⏳ Čeká na schválení'
                              : task.status === 'blocked'
                              ? '✕ Blokováno'
                              : '◦ Backlog'}
                          </p>
                        </div>

                        {/* Priority Indicator */}
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            task.priority === 1
                              ? 'bg-red-500'
                              : task.priority === 2
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-steel-dim text-center py-4">
                      Žádné úkoly v této sekci
                    </p>
                  )}

                  {section.totalTasks > section.tasks.length && (
                    <p className="text-xs text-steel-dim text-center pt-2">
                      +{section.totalTasks - section.tasks.length} dalších úkolů
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-graphite rounded-lg p-6 border border-graphite-light/30">
        <h3 className="text-lg font-bold mb-4">Časová osa</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Tyden 1-3: Database & Dashboard</span>
            <span className="text-xs text-steel-dim ml-auto">✓ Hotovo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">Tyden 4-5: Python Agents & API</span>
            <span className="text-xs text-steel-dim ml-auto">✓ Hotovo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Tyden 6-7: Task Generation</span>
            <span className="text-xs text-steel-dim ml-auto">➜ Probíhá</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Tyden 8-9: Execution & Deployment</span>
            <span className="text-xs text-steel-dim ml-auto">Čeká se</span>
          </div>
        </div>
      </div>
    </div>
  );
}
