import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-check';
import { rateLimit } from '@/lib/server/rate-limiter';
import { safeExec } from '@/lib/server/safe-exec';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface ServiceRequest {
  action: 'start' | 'stop' | 'restart';
  service: 'next-dev' | 'supabase' | 'browser-mcp' | 'port-process';
  options?: {
    port?: number;
    force?: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute per user (stricter for control actions)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Wait before next action.' },
        { status: 429 }
      );
    }

    // Authentication check
    await requireAdmin();

    const body: ServiceRequest = await request.json();

    // Validate input
    if (!['start', 'stop', 'restart'].includes(body.action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (
      !['next-dev', 'supabase', 'browser-mcp', 'port-process'].includes(
        body.service
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid service' },
        { status: 400 }
      );
    }

    let result;

    switch (body.service) {
      case 'next-dev':
        result = await handleNextDev(body.action);
        break;
      case 'supabase':
        result = await handleSupabase(body.action);
        break;
      case 'browser-mcp':
        result = await handleBrowserMcp(body.action);
        break;
      case 'port-process':
        if (!body.options?.port) {
          return NextResponse.json(
            { error: 'Port required for port-process' },
            { status: 400 }
          );
        }
        result = await handlePortProcess(
          body.options.port,
          body.action,
          body.options.force
        );
        break;
      default:
        throw new Error('Unknown service');
    }

    return NextResponse.json({
      success: true,
      service: body.service,
      action: body.action,
      message: result.message,
      data: result.data,
    });
  } catch (error: any) {
    console.error('[/api/admin/service] Error:', error.message);

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
      { error: error.message || 'Failed to perform action' },
      { status: 500 }
    );
  }
}

async function handleNextDev(action: string) {
  switch (action) {
    case 'restart':
      try {
        // Kill existing process on port 3100
        await safeExec('kill-port', 3100);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Start new dev server
        exec('cd /home/leos/ac-heating-web-new && npm run dev > dev.log 2>&1 &');

        return {
          message: 'Next.js dev server restarting...',
          data: { service: 'next-dev', action: 'restart' },
        };
      } catch (error: any) {
        throw new Error(`Failed to restart Next.js: ${error.message}`);
      }

    case 'stop':
      try {
        await safeExec('kill-port', 3100);
        return {
          message: 'Next.js dev server stopped',
          data: { service: 'next-dev', action: 'stop' },
        };
      } catch (error: any) {
        throw new Error(`Failed to stop Next.js: ${error.message}`);
      }

    case 'start':
      try {
        exec('cd /home/leos/ac-heating-web-new && npm run dev > dev.log 2>&1 &');
        return {
          message: 'Next.js dev server starting...',
          data: { service: 'next-dev', action: 'start' },
        };
      } catch (error: any) {
        throw new Error(`Failed to start Next.js: ${error.message}`);
      }

    default:
      throw new Error('Unknown action');
  }
}

async function handleSupabase(action: string) {
  switch (action) {
    case 'restart':
      try {
        const { stdout } = await execAsync(
          'cd /home/leos/projects/supabase && docker-compose restart'
        );
        return {
          message: 'Supabase services restarting...',
          data: { service: 'supabase', action: 'restart' },
        };
      } catch (error: any) {
        throw new Error(`Failed to restart Supabase: ${error.message}`);
      }

    case 'stop':
      try {
        const { stdout } = await execAsync(
          'cd /home/leos/projects/supabase && docker-compose down'
        );
        return {
          message: 'Supabase services stopped',
          data: { service: 'supabase', action: 'stop' },
        };
      } catch (error: any) {
        throw new Error(`Failed to stop Supabase: ${error.message}`);
      }

    case 'start':
      try {
        const { stdout } = await execAsync(
          'cd /home/leos/projects/supabase && docker-compose up -d'
        );
        return {
          message: 'Supabase services starting...',
          data: { service: 'supabase', action: 'start' },
        };
      } catch (error: any) {
        throw new Error(`Failed to start Supabase: ${error.message}`);
      }

    default:
      throw new Error('Unknown action');
  }
}

async function handleBrowserMcp(action: string) {
  switch (action) {
    case 'restart':
      try {
        const { stdout } = await execAsync(
          'cd /home/leos/browsermcp-enhanced && ./scripts/deploy'
        );
        return {
          message: 'Browser MCP redeploying...',
          data: { service: 'browser-mcp', action: 'restart' },
        };
      } catch (error: any) {
        throw new Error(`Failed to restart Browser MCP: ${error.message}`);
      }

    case 'stop':
      try {
        await safeExec('kill-port', 8765);
        return {
          message: 'Browser MCP stopped',
          data: { service: 'browser-mcp', action: 'stop' },
        };
      } catch (error: any) {
        throw new Error(`Failed to stop Browser MCP: ${error.message}`);
      }

    case 'start':
      try {
        exec('cd /home/leos/browsermcp-enhanced && npm start > mcp.log 2>&1 &');
        return {
          message: 'Browser MCP starting...',
          data: { service: 'browser-mcp', action: 'start' },
        };
      } catch (error: any) {
        throw new Error(`Failed to start Browser MCP: ${error.message}`);
      }

    default:
      throw new Error('Unknown action');
  }
}

async function handlePortProcess(port: number, action: 'start' | 'stop' | 'restart', force?: boolean) {
  try {
    const cmd = force
      ? `lsof -ti :${port} | xargs kill -9 2>/dev/null || true`
      : `lsof -ti :${port} | xargs kill -SIGTERM 2>/dev/null || true`;

    const { stdout } = await execAsync(cmd);

    return {
      message: `Process on port ${port} ${
        action === 'stop' ? 'terminated' : action
      }`,
      data: { port, action },
    };
  } catch (error: any) {
    throw new Error(`Failed to ${action} process on port ${port}: ${error.message}`);
  }
}
