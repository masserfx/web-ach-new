import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MONITORING_DIR = path.join(process.cwd(), 'monitoring');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (file) {
      // Read specific file
      const filePath = path.join(MONITORING_DIR, file);
      const content = await fs.readFile(filePath, 'utf8');

      return NextResponse.json({
        success: true,
        filename: file,
        content,
      });
    }

    // List all documentation files
    const files = await fs.readdir(MONITORING_DIR);
    const docFiles = files.filter(f =>
      f.endsWith('.md') || f.endsWith('.ts') || f.endsWith('.json') || f.endsWith('.sh')
    );

    const docs = await Promise.all(
      docFiles.map(async (filename) => {
        const stats = await fs.stat(path.join(MONITORING_DIR, filename));
        return {
          filename,
          size: stats.size,
          modified: stats.mtime,
          type: filename.split('.').pop(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      docs,
      total: docs.length,
    });
  } catch (error: any) {
    console.error('Error fetching docs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
