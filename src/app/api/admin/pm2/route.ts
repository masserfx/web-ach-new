import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-check';
import { rateLimit } from '@/lib/server/rate-limiter';
import { getPM2Processes, safeExec } from '@/lib/server/safe-exec';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 60 requests per minute per user (1 per second for auto-refresh)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 60, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentication check
    await requireAdmin();

    // Get PM2 processes
    const processes = await getPM2Processes();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processes,
      count: processes.length,
    });
  } catch (error: any) {
    console.error('[/api/admin/pm2] Error:', error.message);

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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 30 requests per minute per user (for control actions)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentication check
    await requireAdmin();

    const body = await request.json();
    const { action, appName, lines } = body;

    if (!action || !appName) {
      return NextResponse.json(
        { error: 'Missing required fields: action, appName' },
        { status: 400 }
      );
    }

    // Validate appName
    if (!['ac-heating-web', 'ac-heating-dev'].includes(appName)) {
      return NextResponse.json(
        { error: 'Invalid app name. Allowed: ac-heating-web, ac-heating-dev' },
        { status: 400 }
      );
    }

    let result: string;

    switch (action) {
      case 'start':
        result = await safeExec('pm2-start', appName);
        break;

      case 'stop':
        result = await safeExec('pm2-stop', appName);
        break;

      case 'restart':
        result = await safeExec('pm2-restart', appName);
        break;

      case 'delete':
        result = await safeExec('pm2-delete', appName);
        break;

      case 'logs':
        result = await safeExec('pm2-logs', appName, lines || 100);
        break;

      case 'describe':
        result = await safeExec('pm2-describe', appName);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      action,
      appName,
      result,
      message: `Successfully executed ${action} on ${appName}`,
    });
  } catch (error: any) {
    console.error('[/api/admin/pm2] POST Error:', error.message);

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
