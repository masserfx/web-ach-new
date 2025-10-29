import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit') || '100';

  try {
    let query = supabase
      .from('execution_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(parseInt(limit));

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching execution logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
