import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('task_id');
  const agentName = searchParams.get('agent_name');
  const status = searchParams.get('status');
  const limit = searchParams.get('limit') || '100';

  try {
    let query = supabase.from('execution_logs').select('*');

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    if (agentName) {
      query = query.eq('agent_name', agentName);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query
      .limit(parseInt(limit))
      .order('started_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('execution_logs')
      .insert([body])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
