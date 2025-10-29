import { readFile } from 'fs/promises';
import { join } from 'path';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(process.cwd(), 'public', 'images', 'products', filename);

    // Security: prevent directory traversal
    const publicPath = join(process.cwd(), 'public');
    const resolvedPath = require('path').resolve(filePath);
    if (!resolvedPath.startsWith(publicPath)) {
      return new Response('Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.png')) contentType = 'image/png';
    else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filename.endsWith('.webp')) contentType = 'image/webp';
    else if (filename.endsWith('.gif')) contentType = 'image/gif';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image serving error:', error);
    return new Response('Not Found', { status: 404 });
  }
}
