import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('http://localhost:8000/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Nepodařilo se získat odpověď' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI chat proxy error:', error);
    return NextResponse.json(
      { error: 'AI služba není dostupná' },
      { status: 503 }
    );
  }
}
