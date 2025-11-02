"""
Conversion Funnel Analysis
Tracks user journey from visit to lead
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.analyst import DataAnalyst
import asyncio

FUNNEL_QUERY = """
Analyzuj kompletní conversion funnel pro AC Heating za posledních 30 dní:

FUNNEL STAGES:
1. 🌐 Website Visit
   - Kolik unikátních sessions?
   - Top landing pages

2. 📄 Page Engagement
   - Průměrný počet page views per session
   - Průměrný čas na webu
   - Top browsed pages

3. 🧮 Calculator Usage
   - Kolik lidí otevřelo kalkulačku? (calculator_started)
   - Kolik jich dokončilo výpočet? (calculator_completed)
   - Completion rate %

4. 💬 Chatbot Engagement
   - Kolik lidí otevřelo chatbot? (chatbot_opened)
   - Kolik poslalo zprávu? (chatbot_message_sent)
   - Engagement rate %

5. 📝 Lead Form
   - Kolik lidí začalo vyplňovat form? (lead_form_started)
   - Kolik leadů bylo vytvořeno? (lead_form_submitted)
   - Form completion rate %

6. ✅ Qualified Leads
   - Kolik leadů bylo kvalifikováno?
   - Final conversion rate %

VÝSTUPY:
1. Vytvoř tabulku s čísly pro každý stage
2. Spočítej drop-off rate mezi stages
3. Vytvoř funnel chart (bar chart - klesající)
4. Identifikuj biggest bottleneck
5. Doporuč 3-5 konkrétních zlepšení

Odpověz v češtině, s konkrétními čísly a %.
"""

async def run_funnel_analysis():
    """Run conversion funnel analysis"""
    print("📊 Conversion Funnel Analysis...")
    
    try:
        analyst = DataAnalyst()
        result = await analyst.analyze(FUNNEL_QUERY)
        
        if result["success"]:
            print("\n" + "="*60)
            print("CONVERSION FUNNEL ANALYSIS")
            print("="*60)
            print(result["response"])
            
            if result["charts"]:
                print(f"\n📊 Funnel Visualizations: {len(result['charts'])}")
                for chart in result["charts"]:
                    print(f"  - {chart}")
            
            if result["recommendations"]:
                print(f"\n🎯 Optimization Recommendations:")
                for i, rec in enumerate(result["recommendations"], 1):
                    print(f"  {i}. {rec}")
            
            return result
        else:
            print("❌ Analysis failed")
            return None
    
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    result = asyncio.run(run_funnel_analysis())
    sys.exit(0 if result else 1)
