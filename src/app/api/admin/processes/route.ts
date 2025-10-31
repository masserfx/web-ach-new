import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-check';
import { rateLimit } from '@/lib/server/rate-limiter';
import { getRunningProcesses } from '@/lib/server/safe-exec';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute per user
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentication check
    await requireAdmin();

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || undefined;

    // Fetch running processes
    const processes = await getRunningProcesses(filter);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processes,
      count: processes.length,
    });
  } catch (error: any) {
    console.error('[/api/admin/processes] Error:', error.message);

    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
