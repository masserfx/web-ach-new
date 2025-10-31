import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin-check';
import { rateLimit } from '@/lib/server/rate-limiter';
import {
  getSystemInfo,
  getCpuUsage,
  getMemoryInfo,
  getPortInfo,
  getRunningProcesses,
  safeExec,
} from '@/lib/server/safe-exec';

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

    // Fetch all system data in parallel
    const [systemInfo, cpuUsage, memoryInfo, portInfos] = await Promise.all([
      getSystemInfo(),
      getCpuUsage(),
      getMemoryInfo(),
      Promise.all([
        getPortInfo(3100), // Next.js dev
        getPortInfo(54321), // Supabase API
        getPortInfo(54322), // PostgreSQL
        getPortInfo(54323), // Supabase Studio
        getPortInfo(8765), // Browser MCP
      ]),
    ]);

    // Service detection
    const services = await detectServices(portInfos);

    // Get database status
    const dbStatus = await getDatabaseStatus();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        platform: systemInfo.platform,
        arch: systemInfo.arch,
        nodeVersion: systemInfo.nodeVersion,
        npmVersion: systemInfo.npmVersion,
        uptime: systemInfo.uptime,
        cpuModel: systemInfo.cpuModel,
        cpuCores: systemInfo.cpuCores,
      },
      cpu: {
        model: systemInfo.cpuModel,
        cores: systemInfo.cpuCores,
        usage: cpuUsage,
      },
      memory: {
        total: memoryInfo.total,
        used: memoryInfo.used,
        free: memoryInfo.free,
        percentage: Math.round(memoryInfo.percentage * 100) / 100,
      },
      services,
      ports: services.map((service) => ({
        port: service.port,
        service: service.name,
        status: service.status === 'running' ? 'listening' : 'closed',
        pid: service.pid,
      })),
      database: dbStatus,
    });
  } catch (error: any) {
    console.error('[/api/admin/server-stats] Error:', error.message);

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

async function detectServices(portInfos: any[]) {
  const services = [
    {
      name: 'Next.js Dev',
      port: 3100,
    },
    {
      name: 'Supabase API',
      port: 54321,
    },
    {
      name: 'PostgreSQL',
      port: 54322,
    },
    {
      name: 'Supabase Studio',
      port: 54323,
    },
    {
      name: 'Browser MCP',
      port: 8765,
    },
  ];

  return services.map((service) => {
    const portInfo = portInfos.find((p) => p.port === service.port);
    const isRunning = portInfo?.status === 'listening';

    return {
      name: service.name,
      status: isRunning ? 'running' : 'stopped',
      pid: portInfo?.pid || null,
      port: service.port,
    };
  });
}

async function getDatabaseStatus() {
  try {
    // Try to connect to PostgreSQL
    const version = await safeExec('get-db-version');
    const isConnected = version.includes('PostgreSQL');

    return {
      status: isConnected ? 'connected' : 'disconnected',
      type: 'PostgreSQL',
      host: 'localhost',
      port: 54322,
      version: version.split('\n')[0]?.slice(0, 50) || 'Unknown',
    };
  } catch {
    return {
      status: 'disconnected',
      type: 'PostgreSQL',
      host: 'localhost',
      port: 54322,
      version: null,
    };
  }
}
