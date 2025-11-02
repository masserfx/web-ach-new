import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      houseType,
      area,
      heating,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Chybí povinná pole: jméno, email nebo telefon' },
        { status: 400 }
      );
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || firstName;

    const supabase = await createClient();

    // Insert as lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        property_type: houseType || null,
        property_size_sqm: area ? parseInt(area) : null,
        project_description: message || null,
        lead_type: 'quote_request',
        source: 'website',
        status: 'new',
        gdpr_consent: true, // Assumed from form submission
      })
      .select()
      .single();

    if (leadError) {
      console.error('Supabase error:', leadError);
      return NextResponse.json(
        { error: 'Nepodařilo se uložit poptávku' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Poptávka byla úspěšně odeslána',
    });
  } catch (error) {
    console.error('Error processing quote:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování poptávky' },
      { status: 500 }
    );
  }
}
