import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      propertyType,
      propertySize,
      projectDescription,
      interestedProducts,
      budgetRange,
      urgency,
      gdprConsent,
      marketingConsent,
      leadType = 'quote_request',
      source = 'website',
      consentIp,
      consentTimestamp,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'Musíte souhlasit se zpracováním osobních údajů' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert lead into database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        city,
        property_type: propertyType,
        property_size_sqm: propertySize,
        project_description: projectDescription,
        interested_products: interestedProducts || null || [],
        budget_range: budgetRange,
        urgency: urgency || 'planning',
        lead_type: leadType,
        source,
        status: 'new',
        gdpr_consent: gdprConsent,
        marketing_consent: marketingConsent,
        consent_ip: consentIp,
        consent_timestamp: consentTimestamp,
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

    // TODO: Send email notification
    // TODO: Add to CRM

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Poptávka byla úspěšně odeslána',
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování poptávky' },
      { status: 500 }
    );
  }
}
