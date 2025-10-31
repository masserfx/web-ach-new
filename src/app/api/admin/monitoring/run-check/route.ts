import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export const maxDuration = 300; // 5 minutes for monitoring check

export async function POST(request: NextRequest) {
  try {
    const monitoringDir = path.join(process.cwd(), 'monitoring');

    // Run monitoring check
    const { stdout, stderr } = await execAsync('npm run check', {
      cwd: monitoringDir,
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      timeout: 300000, // 5 minutes
    });

    return NextResponse.json({
      success: true,
      output: stdout,
      errors: stderr || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error running monitoring check:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        output: error.stdout || null,
        errors: error.stderr || null,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
