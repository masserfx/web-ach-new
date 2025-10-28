import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

/**
 * POST /api/cms/generate
 *
 * AI-powered content generation endpoint
 *
 * Body:
 * {
 *   prompt: string - Natural language prompt (e.g., "Vytvoř článek o dotacích 2025")
 *   contentType: 'page' | 'blog' | 'case_study' | 'landing_page'
 *   segmentTargeting?: string[] - Optional segment targeting (RD, BD, Developery)
 * }
 *
 * Response:
 * {
 *   id: string - CMS content ID
 *   title: string
 *   slug: string
 *   meta_title: string
 *   meta_description: string
 *   content: JSON - Structured content blocks
 *   preview_url: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, contentType, segmentTargeting } = await request.json();

    // Validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt je povinný a musí být neprázdný řetězec' },
        { status: 400 }
      );
    }

    if (!['page', 'blog', 'case_study', 'landing_page'].includes(contentType)) {
      return NextResponse.json(
        { error: 'Neplatný content type' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY není nakonfigurován' },
        { status: 500 }
      );
    }

    // Build AI prompt with context
    const systemPrompt = buildSystemPrompt(contentType);
    const userPrompt = buildUserPrompt(prompt, contentType, segmentTargeting);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Parse AI response
    const aiResponse = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Extract JSON from markdown code blocks if present
    let jsonText = aiResponse.trim();
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object
      const objMatch = jsonText.match(/\{[\s\S]*\}/);
      if (objMatch) {
        jsonText = objMatch[0];
      }
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('JSON Parse Error:', parseError);
      console.error('Full AI Response length:', aiResponse.length);
      console.error('JSON Text length:', jsonText.length);
      console.error('Error position:', parseError.message);

      // Log the problematic area (500 chars before and after error position)
      const errorPos = parseInt(parseError.message.match(/position (\d+)/)?.[1] || '0');
      const start = Math.max(0, errorPos - 500);
      const end = Math.min(jsonText.length, errorPos + 500);
      console.error('Problematic JSON section:', jsonText.substring(start, end));

      return NextResponse.json(
        {
          error: 'AI odpověď obsahuje nevalidní JSON. Zkuste to znovu s jednodušším promptem.',
          details: parseError.message,
          position: errorPos
        },
        { status: 500 }
      );
    }

    // Validate generated content structure
    if (!generatedContent.title || !generatedContent.content) {
      return NextResponse.json(
        { error: 'AI nevygenerovala kompletní obsah. Zkuste upravit prompt.' },
        { status: 500 }
      );
    }

    // Generate slug
    const slug = generateSlug(generatedContent.title);

    // Save to database (draft status) - using admin/service client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

    const { data, error } = await supabaseAdmin
      .from('cms_content')
      .insert({
        content_type: contentType,
        slug,
        title: generatedContent.title,
        content: generatedContent.content,
        meta_title: generatedContent.meta_title || generatedContent.title,
        meta_description: generatedContent.meta_description || '',
        keywords: generatedContent.keywords || [],
        segment_targeting: segmentTargeting || [],
        status: 'draft',
        ai_generated: true,
        ai_model: 'claude-sonnet-4.5-20250929',
        ai_prompt: prompt,
        author_id: null, // Admin generated, no specific author
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: `Chyba při ukládání do databáze: ${error.message}` },
        { status: 500 }
      );
    }

    // Log to edit history
    await supabaseAdmin.from('cms_edit_history').insert({
      content_id: data.id,
      edit_type: 'ai_generated',
      ai_model: 'claude-sonnet-4-5-20250929',
      prompt_used: prompt,
    });

    // Return preview data
    return NextResponse.json({
      id: data.id,
      title: data.title,
      slug: data.slug,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      content: data.content,
      preview_url: `/admin/preview/${data.id}`,
    });

  } catch (error: any) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}

/**
 * Build system prompt with AC Heating context
 */
function buildSystemPrompt(contentType: string): string {
  const baseContext = `
Jsi AI asistent pro AC Heating - českou firmu specializující se na tepelná čerpadla a fotovoltaiku.

DŮLEŽITÉ ZÁSADY:
- POUZE faktické informace - ŽÁDNÉ halucinace!
- Používej data ze znalostní báze (358 migrovaných článků v databázi blog_posts)
- Ověřuj zdroje a čísla - pokud si nejsi jistý, nepiš to
- Při absenci dat raději napiš obecně nebo se zeptej na upřesnění

KLÍČOVÉ INFORMACE O SPOLEČNOSTI:
- Vize: Značka AC Heating je leadrem v oblasti komplexních energetických služeb pro RD, BD a firemní objekty v ČR
- Mise: Pomáháme lidem a firmám snižovat energetickou náročnost a zvyšovat komfort prostřednictvím inteligentních, udržitelných řešení na míru
- Produkty: TČ vzduch-voda, TČ + FVE, FVE komunitní energetika, Servisní smlouvy, Prodej Tepla, Správa Tepelného Hosodářství
- Target segmenty: Rodinné domy (60%), Bytové domy (25%), Developery/Firmy (15%)
- Konkurenční výhody: Vlastní vývoj Convert NG ONE, 18+ let zkušeností, 7 let záruka
- Znalostní báze: 358 publikovaných článků o TČ, FVE, dotacích, úsporách

BRAND TONE:
- Profesionální, ale přátelský
- Technicky přesný, ale srozumitelný
- Důraz na úspory a ROI
- Ekologie a udržitelnost
- FAKTA nad spekulacemi
- České hodnoty (Made in Czech Republic)
`;

  const contentTypeInstructions: Record<string, string> = {
    blog: `
ÚKOL: Vytvoř blog článek

STRUKTURA VÝSTUPU (JSON):
{
  "title": "Hlavní titulek (60-70 znaků, SEO optimalizovaný)",
  "meta_title": "Meta titulek pro SEO",
  "meta_description": "Meta popis 150-160 znaků",
  "keywords": ["klíčové", "slovo", "seznam"],
  "content": {
    "intro": "Úvodní odstavec (2-3 věty)",
    "sections": [
      {
        "heading": "Nadpis sekce",
        "text": "Obsah sekce (markdown formát)",
        "image": "Návrh na ilustraci (popis)"
      }
    ],
    "conclusion": "Závěrečný odstavec s CTA"
  }
}
`,
    page: `
ÚKOL: Vytvoř statickou stránku

STRUKTURA VÝSTUPU (JSON):
{
  "title": "Titulek stránky",
  "meta_title": "SEO titulek",
  "meta_description": "SEO popis",
  "content": {
    "hero": {
      "heading": "Hero nadpis",
      "subheading": "Podnadpis",
      "cta": "Call-to-action text"
    },
    "sections": [
      {
        "type": "text" | "features" | "testimonials" | "cta",
        "content": {}
      }
    ]
  }
}
`,
    case_study: `
ÚKOL: Vytvoř case study (referenci)

STRUKTURA VÝSTUPU (JSON):
{
  "title": "Název case study",
  "meta_title": "SEO titulek",
  "meta_description": "SEO popis",
  "content": {
    "client": "Název klienta (anonymizovaný pokud třeba)",
    "location": "Lokalita",
    "challenge": "Problém/výzva",
    "solution": "Naše řešení",
    "results": {
      "savings": "Úspory v Kč/rok",
      "roi": "Návratnost v letech",
      "testimonial": "Citát zákazníka"
    }
  }
}
`,
    landing_page: `
ÚKOL: Vytvoř landing page

STRUKTURA VÝSTUPU (JSON):
{
  "title": "Titulek landing page",
  "meta_title": "SEO titulek",
  "meta_description": "SEO popis",
  "content": {
    "hero": {
      "headline": "Hlavní nadpis (benefit-driven)",
      "subheadline": "Podnadpis",
      "cta_primary": "Primární CTA",
      "cta_secondary": "Sekundární CTA"
    },
    "benefits": [
      {"icon": "emoji", "title": "Benefit", "desc": "Popis"}
    ],
    "social_proof": {
      "stats": [{"value": "číslo", "label": "popis"}],
      "testimonials": []
    },
    "features": [],
    "cta_footer": {}
  }
}
`,
  };

  return baseContext + (contentTypeInstructions[contentType] || '');
}

/**
 * Build user prompt with context
 */
function buildUserPrompt(
  prompt: string,
  contentType: string,
  segmentTargeting?: string[]
): string {
  let userPrompt = `${prompt}\n\n`;

  if (segmentTargeting && segmentTargeting.length > 0) {
    userPrompt += `Cílová skupina: ${segmentTargeting.join(', ')}\n\n`;
  }

  userPrompt += `
POŽADAVKY:
1. Odpověz POUZE validním JSON (bez markdown bloků)
2. V JSON textu používej pouze jednoduché uvozovky nebo žádné speciální znaky
3. Escapuj všechny uvozovky v textu pomocí backslash (\\")
4. Použij českou gramatiku a pravopis
5. SEO optimalizuj titulky a meta tagy
6. Zahrň klíčová slova: tepelná čerpadla, fotovoltaika, úspory energie
7. Přidej konkrétní číselné údaje kde možné (úspory, ROI)
8. Zaměř se na benefit zákazníka, ne jen technické specs

DŮLEŽITÉ: JSON musí být 100% validní - kontroluj všechny uvozovky, čárky a závorky!

VRAŤ: Pouze JSON objekt podle struktury výše.
`;

  return userPrompt;
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
