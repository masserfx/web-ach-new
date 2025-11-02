"""
Daily Analytics Report
Runs every morning to provide insights
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent.analyst import DataAnalyst
from datetime import datetime
import asyncio

REPORT_QUERY = """
Vytvoř kompletní denní report pro AC Heating za včerejší den:

📊 NÁVŠTĚVNOST:
1. Kolik bylo unikátních sessions?
2. Kolik page views celkem?
3. Top 5 nejnavštěvovanějších stránek
4. Rozdělení podle zdroje (utm_source nebo referrer)
5. Rozdělení podle zařízení (desktop/mobile/tablet)

🎯 KONVERZE:
1. Kolik nových leadů bylo vytvořeno?
2. Kolik lidí použilo kalkulačku? (calculator_started vs calculator_completed)
3. Kolik lidí otevřelo chatbot? (chatbot_opened)
4. Kolik zpráv bylo odesláno v chatbotu?
5. Lead form abandonment rate (form_started vs form_submitted)

📈 PRODUKTY:
1. Které 3 produkty měly nejvíc views?
2. Na které produkty lidé nejvíc klikali CTAs?

💡 INSIGHTS & DOPORUČENÍ:
1. Identifikuj 3 klíčová zjištění
2. Poskytni 5 konkrétních actionable doporučení
3. Highlight jakékoliv anomálie nebo významné změny

Vytvoř minimálně 2 grafy pro vizualizaci trendů.
Formátuj jako strukturovaný Markdown report.
"""

async def generate_daily_report():
    """Generate and save daily report"""
    print("🚀 Generuji denní analytics report...")
    
    try:
        analyst = DataAnalyst()
        result = await analyst.analyze(REPORT_QUERY)
        
        if result["success"]:
            # Save report
            date_str = datetime.now().strftime('%Y-%m-%d')
            report_path = f"analytics/outputs/reports/daily_{date_str}.md"
            
            # Ensure directory exists
            os.makedirs('analytics/outputs/reports', exist_ok=True)
            
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(f"# AC Heating - Denní Report\n")
                f.write(f"**Datum**: {date_str}\n")
                f.write(f"**Vygenerováno**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                f.write("---\n\n")
                f.write(result["response"])
                
                if result["charts"]:
                    f.write("\n\n## 📊 Grafy\n\n")
                    for chart in result["charts"]:
                        f.write(f"![Chart]({chart})\n\n")
                
                if result["recommendations"]:
                    f.write("\n\n## 🎯 Akční Body\n\n")
                    for i, rec in enumerate(result["recommendations"], 1):
                        f.write(f"{i}. {rec}\n")
            
            print(f"✅ Report saved: {report_path}")
            print(f"📊 Charts: {len(result['charts'])}")
            print(f"💡 Recommendations: {len(result['recommendations'])}")
            
            return {
                "success": True,
                "path": report_path,
                "charts": result["charts"],
                "recommendations": result["recommendations"]
            }
        else:
            print("❌ Report generation failed")
            return {"success": False, "error": "Analysis failed"}
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    result = asyncio.run(generate_daily_report())
    sys.exit(0 if result["success"] else 1)
