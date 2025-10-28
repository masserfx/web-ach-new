import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * POST /api/cms/publish
 *
 * Publish or reject AI-generated content
 *
 * Body:
 * {
 *   content_id: string - UUID of CMS content
 *   approved: boolean - true to publish, false to reject
 *   editor_notes?: string - Optional notes from editor
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   content_id: string
 *   status: 'published' | 'archived'
 *   published_url?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { content_id, approved, editor_notes } = await request.json();

    // Validation
    if (!content_id || typeof content_id !== 'string') {
      return NextResponse.json(
        { error: 'content_id je povinný' },
        { status: 400 }
      );
    }

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'approved musí být boolean' },
        { status: 400 }
      );
    }

    // Initialize Supabase
    const supabase = createRouteHandlerClient({ cookies });

    // Get current content
    const { data: content, error: fetchError } = await supabase
      .from('cms_content')
      .select('*')
      .eq('id', content_id)
      .single();

    if (fetchError || !content) {
      return NextResponse.json(
        { error: 'Obsah nenalezen' },
        { status: 404 }
      );
    }

    // Update status
    const newStatus = approved ? 'published' : 'archived';
    const updateData: any = {
      status: newStatus,
    };

    if (approved) {
      updateData.published_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('cms_content')
      .update(updateData)
      .eq('id', content_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Chyba při aktualizaci obsahu' },
        { status: 500 }
      );
    }

    // Log to edit history
    await supabase.from('cms_edit_history').insert({
      content_id,
      edit_type: approved ? 'approved' : 'rejected',
      editor_name: 'Admin User', // TODO: Get from auth
      notes: editor_notes || (approved ? 'Content approved and published' : 'Content rejected'),
    });

    // Build response
    const response: any = {
      success: true,
      content_id,
      status: newStatus,
    };

    if (approved) {
      // Determine published URL based on content type
      const urlMap: Record<string, string> = {
        blog: `/blog/${content.slug}`,
        page: `/${content.slug}`,
        case_study: `/reference/${content.slug}`,
        landing_page: `/${content.slug}`,
      };

      response.published_url = urlMap[content.content_type] || `/${content.slug}`;
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Publish API error:', error);
    return NextResponse.json(
      { error: error.message || 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cms/publish?content_id=xxx
 *
 * Get content details for preview
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const content_id = searchParams.get('content_id');

    if (!content_id) {
      return NextResponse.json(
        { error: 'content_id je povinný' },
        { status: 400 }
      );
    }

    // Initialize Supabase
    const supabase = createRouteHandlerClient({ cookies });

    // Fetch content
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('id', content_id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Obsah nenalezen' },
        { status: 404 }
      );
    }

    // Fetch edit history
    const { data: history } = await supabase
      .from('cms_edit_history')
      .select('*')
      .eq('content_id', content_id)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      content: data,
      history: history || [],
    });

  } catch (error: any) {
    console.error('Get content error:', error);
    return NextResponse.json(
      { error: error.message || 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}
