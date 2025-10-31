import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/strategy/summary
 * Returns a comprehensive summary of strategy implementation status
 * Used by dashboard and status pages
 */
export async function GET() {
  const supabase = await createClient();

  try {
    // Get all task data
    const { data: tasks } = await supabase
      .from('strategy_tasks')
      .select('id, status, category, priority, quality_score, progress, created_at');

    // Get milestones
    const { data: milestones } = await supabase
      .from('strategy_milestones')
      .select('*')
      .order('target_date', { ascending: true });

    // Get pending approvals
    const { data: approvals } = await supabase
      .from('task_approvals')
      .select('*')
      .eq('review_status', 'pending');

    // Get recent execution logs for cost calculation
    const { data: logs } = await supabase
      .from('execution_logs')
      .select('api_cost, tokens_used, status')
      .limit(100);

    // Calculate comprehensive metrics
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
    const inProgressTasks = tasks?.filter((t) => t.status === 'in_progress').length || 0;
    const blockedTasks = tasks?.filter((t) => t.status === 'blocked').length || 0;

    const tasksByCategory = tasks
      ? tasks.reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      : {};

    const tasksByPriority = tasks
      ? tasks.reduce(
          (acc, t) => {
            const level = t.priority === 1 ? 'critical' : t.priority === 2 ? 'high' : 'normal';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      : {};

    const avgQualityScore = tasks
      ? tasks.filter((t) => t.quality_score).reduce((sum, t) => sum + (t.quality_score || 0), 0) /
        Math.max(tasks.filter((t) => t.quality_score).length, 1)
      : 0;

    const totalApiCost = logs?.reduce((sum, l) => sum + (l.api_cost || 0), 0) || 0;
    const totalTokensUsed = logs?.reduce((sum, l) => sum + (l.tokens_used || 0), 0) || 0;
    const successfulExecutions = logs?.filter((l) => l.status === 'success').length || 0;

    const summary = {
      timestamp: new Date().toISOString(),
      overall: {
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        totalTasks,
        completedTasks,
        remainingTasks: totalTasks - completedTasks,
        qualityScore: Math.round(avgQualityScore * 100) / 100,
        averageProgress: tasks
          ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks)
          : 0,
      },
      taskBreakdown: {
        byStatus: {
          completed: completedTasks,
          inProgress: inProgressTasks,
          blocked: blockedTasks,
          pending: totalTasks - completedTasks - inProgressTasks - blockedTasks,
        },
        byCategory: tasksByCategory,
        byPriority: tasksByPriority,
      },
      approvals: {
        pending: approvals?.length || 0,
        total: approvals?.length || 0,
      },
      milestones: {
        total: milestones?.length || 0,
        completed: milestones?.filter((m) => m.status === 'completed').length || 0,
        inProgress: milestones?.filter((m) => m.status === 'in_progress').length || 0,
        delayed: milestones?.filter((m) => m.status === 'delayed').length || 0,
        nextMilestone: milestones
          ?.filter((m) => m.status !== 'completed')
          .sort((a, b) => new Date(a.target_date || '').getTime() - new Date(b.target_date || '').getTime())[0] || null,
      },
      costs: {
        totalSpent: Math.round(totalApiCost * 10000) / 10000,
        currency: 'USD',
        averageCostPerTask: totalTasks > 0 ? Math.round((totalApiCost / totalTasks) * 10000) / 10000 : 0,
      },
      execution: {
        totalTokensUsed,
        successfulExecutions,
        executionSuccessRate: logs
          ? (successfulExecutions / Math.max(logs.length, 1)) * 100
          : 0,
      },
      timeline: {
        startDate: tasks
          ? new Date(Math.min(...tasks.map((t) => new Date(t.created_at).getTime()))).toISOString()
          : null,
        estimatedCompletion: milestones
          ?.filter((m) => m.status !== 'completed')
          .sort((a, b) => new Date(b.target_date || '').getTime() - new Date(a.target_date || '').getTime())[0]?.target_date || null,
      },
      recommendations: generateRecommendations(
        completedTasks,
        totalTasks,
        blockedTasks,
        avgQualityScore,
        approvals?.length || 0
      ),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateRecommendations(
  completed: number,
  total: number,
  blocked: number,
  quality: number,
  pendingApprovals: number
): string[] {
  const recommendations: string[] = [];

  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  if (completionRate < 25) {
    recommendations.push('🚀 Akcelerovej vývoj: Pouze 25% úkolů je hotovo. Zvažte paralelní spouštění.');
  }

  if (blocked > 0) {
    recommendations.push(`⚠️ Blokované úkoly: Máte ${blocked} zablokovaných úkolů. Řešte závislosti prioritně.`);
  }

  if (quality < 0.8) {
    recommendations.push(`📊 Kvalita: Průměrná kvalita je ${(quality * 100).toFixed(0)}%. Zvažte vyladění promptů agentů.`);
  }

  if (pendingApprovals > 5) {
    recommendations.push(`✓ Schválení: ${pendingApprovals} čekajících schválení. Urychlите procesy recenzí.`);
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Pokrok je na správné cestě. Pokračujte v aktuálním tempu.');
  }

  return recommendations;
}
