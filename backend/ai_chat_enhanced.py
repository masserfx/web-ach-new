"""
Enhanced AI Chat endpoint with real Anthropic Claude integration
"""
from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from datetime import datetime

# Try to import anthropic, fallback to mock if not available
try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("⚠️  Anthropic SDK not available, using mock responses")


class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None


class AIChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggested_actions: List[str]


# Product knowledge base for AI
PRODUCT_KNOWLEDGE = """
# AC Heating - Produktová databáze

## Produkty a ceny

### Rodinné domy (RD)
1. **Tepelné čerpadlo Convert NG ONE**
   - Cena: 200 000 - 350 000 Kč (průměr 265 000 Kč)
   - Úspora: až 70% nákladů na vytápění
   - Záruka: 7 let
   - Instalace: 5 dní
   - COP: 4.2-4.5
   - Vlastní česká výroba
   
2. **Fotovoltaika**
   - Cena: 300 000 - 800 000 Kč (průměr 480 000 Kč)
   - Úspora: až 80% na elektřině
   - Návratnost: 7-10 let
   - Záruka: 10 let (25 let na panely)
   - Výkon: 5-10 kWp

3. **Klimatizace**
   - Cena: 80 000 - 400 000 Kč (průměr 200 000 Kč)
   - Funkce: vytápění i chlazení
   - Úspora: až 40%
   - Instalace: 2 dny

4. **Retrofit (modernizace)**
   - Cena: 150 000 - 300 000 Kč
   - Výměna starého kotle za TČ
   - Využití stávajících rozvodů

### Bytové domy (BD)
5. **Tepelné čerpadlo pro BD**
   - Cena: 2 000 000 - 4 000 000 Kč (průměr 2.6M)
   - Úspora: až 60% provozních nákladů
   - Centrální řízení
   - Kaskádový systém

6. **Fotovoltaika pro BD**
   - Cena: 800 000 - 2 000 000 Kč (průměr 1.1M)
   - Možnost sdílení elektřiny
   - Snížení nákladů na společné prostory

7. **Komunitní energetika**
   - Cena: 700 000 - 1 500 000 Kč
   - Maximální využití vyrobené energie
   - Spravedlivé rozdělení úspor

### Developer/Firmy
8. **Komplexní řešení**
   - Cena: 1 000 000 - 5 000 000 Kč
   - Turnkey projekt
   - ESG compliance
   - BMS integrace

## Dotace

### Nová zelená úsporám (NZÚ)
- Pro rodinné domy: až 180 000 Kč
- Tepelná čerpadla + fotovoltaika
- Kombinace možná

### OPPIK
- Pro bytové domy a firmy: až 50% nákladů
- Modernizace budov
- Energetická úspora

### Kotlíkové dotace
- Variabilní podle kraje
- Výměna starých kotlů

## Výhody AC Heating
- 18+ let zkušeností
- 7500+ úspěšných instalací
- Vlastní výroba (Convert NG ONE)
- Kompletní servis
- Pomoc s dotacemi zdarma
- 7 let záruka

## Časté otázky (FAQ)

Q: Kolik ušetřím?
A: Tepelné čerpadlo 60-70%, fotovoltaika 70-80%. Kombinace až 80% celkových nákladů.

Q: Jak dlouhá je návratnost?
A: TČ: 8-12 let, FVE: 7-10 let. S dotacemi ještě rychleji.

Q: Funguje to v zimě?
A: Ano, Convert NG ONE funguje až do -20°C. COP 4.2 znamená 4.2 kW tepla z 1 kW elektřiny.

Q: Potřebuji povolení?
A: Pro RD většinou ne, pro BD ano (SVJ souhlas).
"""

SYSTEM_PROMPT = f"""Jsi virtuální asistent pro AC Heating, českou firmu specializující se na tepelná čerpadla a fotovoltaiku.

TVOJE ROLE:
- Odpovídej profesionálně, ale přátelsky
- Používej češtinu
- Buď konkrétní s cenami a technickými údaji
- Doporuč produkty podle potřeb zákazníka
- Motivuj k vyplnění poptávkového formuláře nebo zavolání

KNOWLEDGE BASE:
{PRODUCT_KNOWLEDGE}

PRAVIDLA:
- Vždy uveď ceny v Kč
- Zmiň dotace, když jsou relevantní
- Při nejasnostech doporuč konzultaci s odborníkem
- Nedělej si věci - pokud nevíš, řekni to a nabídni kontakt na firmu
- Buď stručný, ale informativní (2-4 věty ideálně)
"""


async def handle_ai_chat_real(request: AIChatRequest) -> AIChatResponse:
    """
    Handle chat with real Anthropic Claude API
    """
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    conversation_id = request.conversation_id or f"conv_{datetime.now().timestamp()}"
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": request.message}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Generate suggested actions based on message content
        suggested_actions = []
        message_lower = request.message.lower()
        
        if any(word in message_lower for word in ["cena", "kolik", "stojí"]):
            suggested_actions = ["Spustit kalkulačku", "Poslat poptávku", "Zobrazit produkty"]
        elif any(word in message_lower for word in ["dotace", "příspěvek"]):
            suggested_actions = ["Více o dotacích", "Poslat poptávku", "Kontakt"]
        elif any(word in message_lower for word in ["úspora", "ušetřím"]):
            suggested_actions = ["Kalkulačka úspor", "Zobrazit reference", "Poslat poptávku"]
        else:
            suggested_actions = ["Kalkulačka", "Produkty", "Kontakt"]
        
        return AIChatResponse(
            response=ai_response,
            conversation_id=conversation_id,
            suggested_actions=suggested_actions
        )
        
    except Exception as e:
        print(f"Anthropic API error: {e}")
        # Fallback to mock response
        return handle_ai_chat_mock(request)


async def handle_ai_chat_mock(request: AIChatRequest) -> AIChatResponse:
    """
    Fallback mock responses when Anthropic is not available
    """
    conversation_id = request.conversation_id or f"conv_{datetime.now().timestamp()}"
    message_lower = request.message.lower()
    
    # Keyword-based responses
    if any(word in message_lower for word in ["cena", "kolik", "stojí", "price"]):
        response = """
Ceny našich řešení:

🏠 **Rodinné domy:**
- Tepelné čerpadlo: od 265 000 Kč
- Fotovoltaika: od 480 000 Kč
- Komplet s dotací: od 565 000 Kč

🏢 **Bytové domy:**
- TČ systém: od 2 600 000 Kč
- FVE systém: od 1 100 000 Kč

Všechny ceny jsou individuální dle projektu. Chcete přesnou kalkulaci?
        """
        suggested_actions = ["Spustit kalkulačku úspor", "Poslat poptávku", "Zobrazit dotace"]
        
    elif any(word in message_lower for word in ["dotace", "příspěvek", "subsidy"]):
        response = """
Aktuálně dostupné dotace:

✅ **Nová zelená úsporám**: až 180 000 Kč (RD)
✅ **OPPIK**: až 50% nákladů (BD, firmy)
✅ **Kotlíkové dotace**: variabilní podle kraje

Pomůžeme vám s vyřízením dotace zdarma v rámci projektu!
        """
        suggested_actions = ["Zobrazit produkty", "Kontaktovat poradce", "Více o dotacích"]
        
    elif any(word in message_lower for word in ["úspora", "ušetřím", "savings"]):
        response = """
Typické úspory našich zákazníků:

💰 **Tepelné čerpadlo**: úspora 60-70% na vytápění
☀️ **Fotovoltaika**: úspora 70-80% na elektřině  
🔋 **Kompletní řešení**: až 80% celkových nákladů

Přesnou kalkulaci vám připravím pomocí naší kalkulačky. Zkusit?
        """
        suggested_actions = ["Spustit kalkulačku", "Zobrazit reference", "Poslat poptávku"]
        
    else:
        response = """
Jsem tu, abych vám pomohl s:

✅ Výběrem vhodného řešení pro vaši nemovitost
✅ Kalkulací úspor a návratnosti
✅ Informacemi o dotacích
✅ Technickými parametry produktů

Co vás zajímá konkrétně?
        """
        suggested_actions = ["Kalkulačka úspor", "Naše produkty", "Kontakt"]
    
    return AIChatResponse(
        response=response.strip(),
        conversation_id=conversation_id,
        suggested_actions=suggested_actions
    )


async def ai_chat_endpoint(request: AIChatRequest) -> AIChatResponse:
    """
    Main AI chat endpoint - uses real AI if available, falls back to mock
    """
    if ANTHROPIC_AVAILABLE and os.getenv("ANTHROPIC_API_KEY"):
        try:
            return await handle_ai_chat_real(request)
        except Exception as e:
            print(f"Falling back to mock due to error: {e}")
            return await handle_ai_chat_mock(request)
    else:
        return await handle_ai_chat_mock(request)
