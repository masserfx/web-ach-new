'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Edit2,
  Save,
  AlertCircle,
  Target,
  Clock,
  TrendingUp,
  Link2,
  CheckCircle,
} from 'lucide-react';
import type { TaskDetailResponse, TaskUpdateRequest } from '@/types/strategy';
import { ExecutionTimeline } from './ExecutionTimeline';
import { TaskDependencies } from './TaskDependencies';
import { AgentSelector } from './AgentSelector';
import { AgentExecutionModal } from './AgentExecutionModal';

interface TaskDetailModalProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function TaskDetailModal({
  taskId,
  open,
  onOpenChange,
  onUpdate,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<TaskDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TaskUpdateRequest>({});
  const [executionModalOpen, setExecutionModalOpen] = useState(false);

  useEffect(() => {
    if (open && taskId) {
      loadTaskDetail();
    }
  }, [open, taskId]);

  async function loadTaskDetail() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/tasks/${taskId}/detail`);
      if (!response.ok) {
        throw new Error('Failed to load task detail');
      }
      const data: TaskDetailResponse = await response.json();
      setTask(data);
      setFormData({
        title: data.title,
        description: data.description ?? undefined,
        status: data.status,
        priority: data.priority,
        estimated_hours: data.estimated_hours ?? undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!task) return;

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTask({ ...task, ...updatedTask });
      setEditMode(false);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleDependenciesUpdate(newDependencies: string[]) {
    if (!task) return;

    try {
      const response = await fetch(`/api/strategy/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependencies: newDependencies }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dependencies');
      }

      const updatedTask = await response.json();
      setTask({ ...task, dependencies: updatedTask.dependencies });
      onUpdate?.();
    } catch (err) {
      console.error('Failed to update dependencies:', err);
      throw err;
    }
  }

  async function handleAgentSelect(agentName: string) {
    if (!task) return;

    try {
      const response = await fetch(`/api/strategy/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_name: agentName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      const updatedTask = await response.json();
      setTask({ ...task, agent_name: updatedTask.agent_name });
      onUpdate?.();
    } catch (err) {
      console.error('Failed to update agent:', err);
      throw err;
    }
  }

  function handleExecuteAgent() {
    if (!task?.agent_name) {
      setError('Nejprve vyberte agenta');
      return;
    }
    setExecutionModalOpen(true);
  }

  const statusColors: Record<string, string> = {
    backlog: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    review: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    done: 'bg-green-500/20 text-green-400 border-green-500/30',
    blocked: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  const priorityColors: Record<string, string> = {
    low: 'text-gray-400',
    medium: 'text-blue-400',
    high: 'text-orange-400',
    critical: 'text-red-400',
  };

  if (!task && !loading) {
    return null;
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] bg-graphite rounded-lg border border-graphite-light/30 shadow-2xl animate-in fade-in-0 zoom-in-95 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-graphite-light/30">
            <div className="flex-1 pr-8">
              {editMode ? (
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full text-xl font-bold bg-carbon border border-graphite-light/30 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
                />
              ) : (
                <Dialog.Title className="text-xl font-bold text-white">
                  {task?.title}
                </Dialog.Title>
              )}
              <div className="flex items-center gap-3 mt-3">
                {task && (
                  <>
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold border ${
                        statusColors[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="bg-accent/20 text-accent px-3 py-1 rounded text-sm font-semibold">
                      {task.category}
                    </span>
                    <span className={`text-sm font-semibold ${priorityColors[task.priority]}`}>
                      {task.priority} priorita
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 hover:bg-graphite-light/20 rounded transition-colors"
                  aria-label="Edit task"
                >
                  <Edit2 size={20} className="text-steel" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 disabled:bg-accent/50 transition-colors"
                >
                  <Save size={18} />
                  {saving ? 'Ukládám...' : 'Uložit'}
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  className="p-2 hover:bg-graphite-light/20 rounded transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-steel" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-steel-dim">Načítám detail úkolu...</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded">
                <AlertCircle className="text-red-400" size={20} />
                <p className="text-red-300">{error}</p>
              </div>
            ) : task ? (
              <>
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-steel-dim mb-2">Popis</h3>
                  {editMode ? (
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-carbon border border-graphite-light/30 rounded px-3 py-2 text-white focus:border-accent focus:outline-none"
                    />
                  ) : (
                    <p className="text-steel">{task.description}</p>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-carbon rounded p-4 border border-graphite-light/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-accent" />
                      <p className="text-xs text-steel-dim">Odhad</p>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {task.estimated_hours}h
                    </p>
                  </div>
                  {task.actual_hours && (
                    <div className="bg-carbon rounded p-4 border border-graphite-light/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} className="text-blue-400" />
                        <p className="text-xs text-steel-dim">Skutečnost</p>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {task.actual_hours}h
                      </p>
                    </div>
                  )}
                  {task.quality_score && (
                    <div className="bg-carbon rounded p-4 border border-graphite-light/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-400" />
                        <p className="text-xs text-steel-dim">Kvalita</p>
                      </div>
                      <p className="text-xl font-bold text-green-400">
                        {Math.round(task.quality_score * 100)}%
                      </p>
                    </div>
                  )}
                  <div className="bg-carbon rounded p-4 border border-graphite-light/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-accent" />
                      <p className="text-xs text-steel-dim">Spuštění</p>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {task.execution_logs.length}
                    </p>
                  </div>
                </div>

                {/* Agent Selector */}
                <div>
                  <AgentSelector
                    taskId={task.id}
                    currentAgentName={task.agent_name}
                    category={task.category}
                    onAgentSelect={handleAgentSelect}
                    onExecute={handleExecuteAgent}
                  />
                </div>

                {/* Dependencies */}
                <div>
                  <TaskDependencies
                    taskId={task.id}
                    dependencies={task.dependencies || []}
                    onUpdate={handleDependenciesUpdate}
                  />
                </div>

                {/* Execution Timeline & Logs */}
                {task.execution_logs && task.execution_logs.length > 0 && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-steel-dim mb-3">
                        Historie spuštění
                      </h3>
                      <ExecutionTimeline logs={task.execution_logs} />
                    </div>
                    <div>
                      <ExecutionLogs
                        logs={task.execution_logs}
                        title="Detaily spuštění"
                        showFilters={true}
                      />
                    </div>
                  </>
                )}

                {/* AI Generated Output */}
                {task.output_data && (
                  <div>
                    <h3 className="text-sm font-semibold text-steel-dim mb-2">
                      Generovaný obsah AI
                    </h3>
                    <div className="bg-carbon rounded p-4 border border-graphite-light/30 max-h-96 overflow-y-auto">
                      <details className="text-steel text-sm">
                        <summary className="cursor-pointer font-semibold mb-2 hover:text-accent">
                          Zobrazit JSON output
                        </summary>
                        <pre className="text-xs font-mono bg-graphite p-3 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(task.output_data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                )}

                {/* Expected Output */}
                {task.expected_output && (
                  <div>
                    <h3 className="text-sm font-semibold text-steel-dim mb-2">
                      Očekávaný výstup
                    </h3>
                    <div className="bg-carbon rounded p-4 border border-graphite-light/30">
                      <p className="text-steel text-sm">{task.expected_output}</p>
                    </div>
                  </div>
                )}

                {/* Success Criteria */}
                {(task as any).success_criteria && (task as any).success_criteria.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-steel-dim mb-2">
                      Kritéria úspěchu
                    </h3>
                    <ul className="space-y-2">
                      {(task as any).success_criteria.map((criterion: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-steel"
                        >
                          <CheckCircle size={16} className="text-green-400 mt-0.5" />
                          {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {(task as any).assigned_skills && (task as any).assigned_skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-steel-dim mb-2">
                      Přiřazené skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(task as any).assigned_skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-carbon text-steel text-sm rounded border border-graphite-light/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Agent Execution Modal */}
          {task && task.agent_name && (
            <AgentExecutionModal
              open={executionModalOpen}
              onOpenChange={setExecutionModalOpen}
              taskId={task.id}
              agentName={task.agent_name}
              onComplete={() => {
                loadTaskDetail();
                onUpdate?.();
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
