"""
FastAPI Router for Analytics Agent
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import sys
import os

# Add analytics to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../analytics'))

from agent.analyst import DataAnalyst

router = APIRouter(prefix="/analytics-agent", tags=["Analytics Agent"])

class AnalysisRequest(BaseModel):
    query: str
    format: str = "markdown"

class AnalysisResponse(BaseModel):
    success: bool
    response: str
    charts: List[str] = []
    recommendations: List[str] = []
    error: Optional[str] = None

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(request: AnalysisRequest):
    """
    Analyze data using AI agent
    
    Example queries:
    - "Kolik leadů jsme měli tento měsíc?"
    - "Jaký je conversion rate z calculator na lead?"
    - "Které produkty jsou nejpopulárnější?"
    """
    try:
        analyst = DataAnalyst()
        result = await analyst.analyze(request.query)
        
        return AnalysisResponse(
            success=result.get("success", True),
            response=result["response"],
            charts=result.get("charts", []),
            recommendations=result.get("recommendations", [])
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/daily-report")
async def get_daily_report():
    """
    Generate or retrieve today's daily report
    """
    try:
        from queries.daily_report import generate_daily_report
        
        result = await generate_daily_report()
        
        if result["success"]:
            return {
                "success": True,
                "report_path": result["path"],
                "charts": result["charts"],
                "recommendations": result["recommendations"]
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Report generation failed"))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quick-insights")
async def quick_insights():
    """
    Get quick insights about current data
    """
    try:
        analyst = DataAnalyst()
        
        query = """
        Rychlý přehled AC Heating dat (za posledních 7 dní):
        
        1. Kolik leadů celkem?
        2. Kolik calculator usage?
        3. Top 3 produkty podle views
        4. Conversion rate estimate
        5. 3 klíčová doporučení
        
        Odpověď max 200 slov, bullet points.
        """
        
        result = await analyst.analyze(query)
        
        return {
            "success": True,
            "insights": result["response"],
            "recommendations": result.get("recommendations", [])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
