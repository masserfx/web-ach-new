import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { event_name, event_data } = await request.json();
    
    // Validate event
    if (!event_name || !event_data) {
      return NextResponse.json(
        { error: 'Missing event_name or event_data' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Store analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_name,
        event_data,
        created_at: new Date().toISOString(),
      });
    
    if (error) {
      console.error('Analytics storage error:', error);
      return NextResponse.json(
        { error: 'Failed to store event' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
