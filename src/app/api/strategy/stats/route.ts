import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();

  try {
    // Get task statistics
    const { data: tasks } = await supabase
      .from('strategy_tasks')
      .select('id, status, quality_score', { count: 'exact' });

    // Get milestone statistics
    const { data: milestones } = await supabase
      .from('strategy_milestones')
      .select('*');

    // Get agent performance
    const { data: agents } = await supabase
      .from('agent_skills')
      .select('*')
      .eq('active', true);

    // Get pending approvals
    const { data: approvals } = await supabase
      .from('task_approvals')
      .select('id, review_status', { count: 'exact' });

    // Calculate metrics
    const totalTasks = tasks?.length || 0;
    const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
    const inProgressTasks = tasks?.filter((t) => t.status === 'in_progress').length || 0;
    const blockedTasks = tasks?.filter((t) => t.status === 'blocked').length || 0;
    const reviewTasks = tasks?.filter((t) => t.status === 'review').length || 0;

    const avgQuality = tasks
      ? tasks.filter((t) => t.quality_score).reduce((sum, t) => sum + (t.quality_score || 0), 0) /
        Math.max(tasks.filter((t) => t.quality_score).length, 1)
      : 0;

    const pendingApprovals = approvals?.filter((a) => a.review_status === 'pending').length || 0;

    const stats = {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        inReview: reviewTasks,
        blocked: blockedTasks,
        backlog: totalTasks - completedTasks - inProgressTasks - reviewTasks - blockedTasks,
      },
      quality: {
        average: Math.round(avgQuality * 100) / 100,
        score: (completedTasks / Math.max(totalTasks, 1)) * 100,
      },
      approvals: {
        pending: pendingApprovals,
        total: approvals?.length || 0,
      },
      agents: {
        active: agents?.length || 0,
        performance: agents?.map((a) => ({
          name: a.agent_name,
          completedTasks: a.tasks_completed,
          qualityScore: a.avg_quality_score,
          successRate: a.success_rate,
        })),
      },
      milestones: {
        total: milestones?.length || 0,
        completed: milestones?.filter((m) => m.status === 'completed').length || 0,
        inProgress: milestones?.filter((m) => m.status === 'in_progress').length || 0,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
