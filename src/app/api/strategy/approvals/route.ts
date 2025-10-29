import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit') || '50';

  try {
    let query = supabase.from('task_approvals').select('*');

    if (status) {
      query = query.eq('review_status', status);
    }

    const { data, error } = await query
      .limit(parseInt(limit))
      .order('submitted_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();

    const { data, error } = await supabase.from('task_approvals').insert([body]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error('Error creating approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
