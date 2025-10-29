import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    let query = supabase
      .from('task_approvals')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('review_status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
