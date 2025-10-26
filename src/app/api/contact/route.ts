import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/site.config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Chybějící povinná pole', missing: missingFields },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }

    // Optional phone validation if provided
    if (body.phone) {
      const phoneRegex = /^(\+420)?[0-9]{9}$/;
      const cleanPhone = body.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: 'Neplatné telefonní číslo' },
          { status: 400 }
        );
      }
    }

    // TODO: Send email notification
    // For now, log to console (in production, use email service like Resend, SendGrid, etc.)
    console.log('📧 Nová kontaktní zpráva:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Save to database
    // In production, save to Supabase contacts table

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Děkujeme za zprávu. Ozveme se vám co nejdříve.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Contact API Error:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování zprávy' },
      { status: 500 }
    );
  }
}
