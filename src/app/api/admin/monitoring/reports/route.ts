import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const REPORTS_DIR = path.join(process.cwd(), 'monitoring', 'reports');

export async function GET(request: NextRequest) {
  try {
    // Ensure reports directory exists
    await fs.mkdir(REPORTS_DIR, { recursive: true });

    // Read all report files
    const files = await fs.readdir(REPORTS_DIR);
    const reportFiles = files
      .filter(f => f.startsWith('report-') && f.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first

    // Read each report
    const reports = await Promise.all(
      reportFiles.map(async (filename) => {
        const content = await fs.readFile(
          path.join(REPORTS_DIR, filename),
          'utf8'
        );
        const data = JSON.parse(content);

        return {
          filename,
          timestamp: data.timestamp || filename.replace('report-', '').replace('.json', ''),
          ...data,
        };
      })
    );

    return NextResponse.json({
      success: true,
      reports,
      total: reports.length,
    });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        reports: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
