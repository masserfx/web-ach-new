import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validace
    if (!body.name || !body.email || !body.phone || !body.houseType || !body.area) {
      return NextResponse.json(
        { error: 'Chybí povinná pole' },
        { status: 400 }
      );
    }

    // Vytvoření Supabase klienta s service role pro bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Uložení do databáze
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          house_type: body.houseType,
          area: parseInt(body.area),
          heating: body.heating || null,
          message: body.message || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Chyba při ukládání poptávky', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Poptávka byla úspěšně odeslána'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}
