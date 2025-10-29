import { createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('task_approvals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const { id } = await params;

  try {
    const body = await request.json();
    const { id: _, ...updateData } = body;

    const { data, error } = await supabase
      .from('task_approvals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If approved, update task status
    if (updateData.review_status === 'approved' && data?.task_id) {
      await supabase
        .from('strategy_tasks')
        .update({ status: 'approved', approval_status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', data.task_id);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
