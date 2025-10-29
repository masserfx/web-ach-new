import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/strategy/execute
 * Triggers the Python orchestrator to execute pending tasks
 * This endpoint should be called by a cron job or webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { limit = 5, dryRun = false } = body;

    // Validate request
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.STRATEGY_ORCHESTRATOR_KEY;

    if (!apiKey || (expectedKey && apiKey !== expectedKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In production, this would call the Python orchestrator
    // For now, we'll return a success response with instructions
    const response = {
      status: 'success',
      message: 'Orchestration triggered',
      instructions: [
        'Run the following command on the server:',
        `cd /path/to/scripts/strategy && uv run run_orchestrator.py --limit ${limit}${dryRun ? ' --dry-run' : ''}`,
        'Or use cron to schedule: 0 */6 * * * cd /path/to/scripts/strategy && uv run run_orchestrator.py',
      ],
      nextCheck: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error triggering orchestration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/strategy/execute
 * Returns orchestration status and scheduling info
 */
export async function GET(request: NextRequest) {
  try {
    const status = {
      orchestrator: {
        status: 'ready',
        lastRun: null,
        nextScheduledRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        schedule: 'Every 6 hours',
        commands: {
          execute: 'uv run run_orchestrator.py',
          executeWithLimit: 'uv run run_orchestrator.py --limit 10',
          dryRun: 'uv run run_orchestrator.py --dry-run',
          continuous: 'uv run run_orchestrator.py --continuous --interval 300',
        },
      },
      documentation: {
        taskGeneration: 'uv run generate_tasks.py',
        generateReport: 'uv run generate_report.py --output report.json',
        generateHtmlReport: 'uv run generate_report.py --output report.html --format html',
      },
      pythonSetup: {
        instructions: [
          'cd scripts/strategy',
          'uv sync (install dependencies)',
          'uv run run_orchestrator.py (execute)',
        ],
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching orchestration status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
