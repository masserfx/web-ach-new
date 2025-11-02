"""
Lead Scoring Query
Automatically scores leads 0-100 based on multiple factors
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.analyst import DataAnalyst
import asyncio

LEAD_SCORING_QUERY = """
Vytvoř advanced lead scoring system pro AC Heating:

SCORING FAKTORY:
1. Property Type:
   - rodinny_dum: 30 bodů
   - bytovy_dum: 20 bodů
   - firma: 25 bodů
   - developer: 15 bodů

2. Property Size:
   - < 100m²: 10 bodů
   - 100-200m²: 20 bodů
   - 200-300m²: 25 bodů
   - > 300m²: 30 bodů

3. Budget Range:
   - < 300k: 10 bodů
   - 300-500k: 20 bodů
   - 500-1M: 30 bodů
   - > 1M: 25 bodů

4. Urgency:
   - immediate: 30 bodů
   - this_month: 25 bodů
   - this_quarter: 15 bodů
   - planning: 5 bodů

5. Message Length (zájem):
   - > 200 znaků: 20 bodů
   - 100-200: 15 bodů
   - 50-100: 10 bodů
   - < 50: 5 bodů

6. Source Quality:
   - direct/organic: 20 bodů
   - referral: 15 bodů
   - google: 10 bodů
   - facebook: 5 bodů

ÚKOL:
1. Stáhni všechny leady se statusem 'new'
2. Spočítej score pro každý lead (0-100)
3. Seřaď podle skóre (nejvyšší první)
4. Vytvoř tabulku: Jméno | Email | Score | Top Faktory
5. Vytvoř bar chart top 10 leadů
6. Doporuč 5 leadů na okamžitý kontakt

Odpověď v češtině, konkrétní, s čísly.
"""

async def run_lead_scoring():
    """Run lead scoring analysis"""
    print("🎯 Lead Scoring Analysis...")
    
    try:
        analyst = DataAnalyst()
        result = await analyst.analyze(LEAD_SCORING_QUERY)
        
        if result["success"]:
            print("\n" + "="*60)
            print("LEAD SCORING RESULTS")
            print("="*60)
            print(result["response"])
            
            if result["charts"]:
                print(f"\n📊 Charts: {len(result['charts'])}")
                for chart in result["charts"]:
                    print(f"  - {chart}")
            
            if result["recommendations"]:
                print(f"\n💡 Recommendations: {len(result['recommendations'])}")
                for i, rec in enumerate(result["recommendations"], 1):
                    print(f"  {i}. {rec}")
            
            return result
        else:
            print("❌ Scoring failed")
            return None
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    result = asyncio.run(run_lead_scoring())
    sys.exit(0 if result else 1)
