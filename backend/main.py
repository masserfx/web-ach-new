"""
AC Heating - FastAPI Backend
Main application with savings calculator and AI chat endpoints
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
load_dotenv()  # Load .env file
from datetime import datetime
from routers.analytics_router import router as analytics_router

app = FastAPI(
    title="AC Heating API",
    description="Backend API for AC Heating web application",
    version="1.0.0"
)

# Include analytics router
app.include_router(analytics_router, prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Models
# ============================================

class SavingsCalculationRequest(BaseModel):
    property_type: str = Field(..., description="Type: rodinny_dum, bytovy_dum, firma")
    property_size_sqm: int = Field(..., gt=0, description="Property size in square meters")
    current_heating: str = Field(..., description="Current heating: plyn, elektrina, uhli, topny_olej")
    annual_heating_cost: Optional[float] = Field(None, description="Annual heating cost in CZK")
    hot_water_persons: int = Field(default=4, description="Number of people for hot water")
    has_solar: bool = Field(default=False, description="Already has solar panels")
    solar_power_kwp: Optional[float] = Field(None, description="Solar power in kWp")
    

class SavingsCalculationResponse(BaseModel):
    current_annual_cost: float
    heat_pump_annual_cost: float
    annual_savings: float
    savings_percentage: float
    investment_cost: float
    payback_years: float
    subsidies_available: float
    net_investment: float
    co2_savings_kg: float
    recommendations: List[str]
    

class AIChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = None
    user_context: Optional[Dict[str, Any]] = None


class AIChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggested_actions: List[str]
    

# ============================================
# Endpoints
# ============================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "AC Heating API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: Check Supabase connection
        "ai_service": "available",  # TODO: Check Anthropic API
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/calculate-savings", response_model=SavingsCalculationResponse)
async def calculate_savings(request: SavingsCalculationRequest):
    """
    Calculate potential savings from switching to heat pump + solar
    
    This is a sophisticated calculator considering:
    - Property type and size
    - Current heating method and costs
    - Heat pump efficiency (COP 4.0-4.5)
    - Solar power generation
    - Subsidies available
    - CO2 savings
    """
    
    # Constants
    HEAT_PUMP_COP = 4.2  # Coefficient of Performance
    ELECTRICITY_PRICE = 4.5  # CZK per kWh (average)
    GAS_PRICE = 1.8  # CZK per kWh
    COAL_PRICE = 1.2  # CZK per kWh
    OIL_PRICE = 2.5  # CZK per kWh
    
    # Heating costs per fuel type
    fuel_prices = {
        "plyn": GAS_PRICE,
        "elektrina": ELECTRICITY_PRICE,
        "uhli": COAL_PRICE,
        "topny_olej": OIL_PRICE
    }
    
    # Estimate annual energy consumption if not provided
    if request.annual_heating_cost:
        current_cost = request.annual_heating_cost
        fuel_price = fuel_prices.get(request.current_heating, GAS_PRICE)
        annual_kwh = current_cost / fuel_price
    else:
        # Estimate based on property size (rough calculation)
        kwh_per_sqm = {
            "rodinny_dum": 80,  # kWh/m²/year
            "bytovy_dum": 60,
            "firma": 70
        }
        annual_kwh = request.property_size_sqm * kwh_per_sqm.get(request.property_type, 70)
        fuel_price = fuel_prices.get(request.current_heating, GAS_PRICE)
        current_cost = annual_kwh * fuel_price
    
    # Heat pump calculation
    # With COP of 4.2, you need only 1/4.2 of the energy input
    heat_pump_kwh_needed = annual_kwh / HEAT_PUMP_COP
    heat_pump_cost = heat_pump_kwh_needed * ELECTRICITY_PRICE
    
    # Solar reduction (if applicable)
    if request.has_solar and request.solar_power_kwp:
        # Rough estimate: 1 kWp generates ~1000 kWh/year in Czech Republic
        solar_generation_kwh = request.solar_power_kwp * 1000
        # Assume 60% self-consumption
        solar_savings_kwh = solar_generation_kwh * 0.6
        heat_pump_cost -= solar_savings_kwh * ELECTRICITY_PRICE
        heat_pump_cost = max(0, heat_pump_cost)
    
    # Calculate savings
    annual_savings = current_cost - heat_pump_cost
    savings_percentage = (annual_savings / current_cost * 100) if current_cost > 0 else 0
    
    # Investment cost estimation
    if request.property_type == "rodinny_dum":
        tc_cost = 265000  # Heat pump
        fve_cost = 480000 if not request.has_solar else 0
        investment_cost = tc_cost + (fve_cost if request.solar_power_kwp and request.solar_power_kwp > 0 else 0)
    elif request.property_type == "bytovy_dum":
        # Scale based on size
        units = max(1, request.property_size_sqm / 1000)
        tc_cost = 2600000 * units
        fve_cost = 1100000 * units if not request.has_solar else 0
        investment_cost = tc_cost + fve_cost
    else:  # firma
        investment_cost = 1500000
    
    # Subsidies (Nova Zelena Usporam, etc.)
    if request.property_type == "rodinny_dum":
        subsidies = 180000  # NZÚ for RD
    elif request.property_type == "bytovy_dum":
        subsidies = investment_cost * 0.5  # Up to 50% for BD
    else:
        subsidies = investment_cost * 0.3  # 30% for commercial
    
    net_investment = investment_cost - subsidies
    
    # Payback period
    payback_years = net_investment / annual_savings if annual_savings > 0 else 99
    
    # CO2 savings (rough estimate)
    # Coal: ~0.35 kg CO2/kWh, Gas: ~0.2 kg CO2/kWh, Electricity mix: ~0.4 kg CO2/kWh
    co2_factors = {
        "uhli": 0.35,
        "plyn": 0.2,
        "topny_olej": 0.28,
        "elektrina": 0.4
    }
    co2_factor = co2_factors.get(request.current_heating, 0.25)
    # Heat pump with renewable energy has much lower footprint (~0.05)
    co2_savings_kg = (annual_kwh * co2_factor) - (heat_pump_kwh_needed * 0.05)
    
    # Recommendations
    recommendations = []
    if savings_percentage > 50:
        recommendations.append("Výborná příležitost k úsporám! Doporučujeme rychlé jednání.")
    if payback_years < 10:
        recommendations.append(f"Návratnost {payback_years:.1f} let je velmi dobrá.")
    if not request.has_solar:
        recommendations.append("Zvažte kombinaci s fotovoltaikou pro maximální úspory.")
    if request.property_type == "rodinny_dum":
        recommendations.append("Využijte dotaci Nová zelená úsporám až 180 000 Kč.")
    if co2_savings_kg > 5000:
        recommendations.append(f"Snížíte emise CO2 o {co2_savings_kg/1000:.1f} tun ročně.")
    
    return SavingsCalculationResponse(
        current_annual_cost=round(current_cost, 2),
        heat_pump_annual_cost=round(heat_pump_cost, 2),
        annual_savings=round(annual_savings, 2),
        savings_percentage=round(savings_percentage, 1),
        investment_cost=round(investment_cost, 2),
        payback_years=round(payback_years, 1),
        subsidies_available=round(subsidies, 2),
        net_investment=round(net_investment, 2),
        co2_savings_kg=round(co2_savings_kg, 0),
        recommendations=recommendations
    )


@app.post("/api/ai-chat")
async def ai_chat_handler(request: dict):
    from ai_chat_enhanced import ai_chat_endpoint, AIChatRequest
    ai_req = AIChatRequest(**request)
    result = await ai_chat_endpoint(ai_req)
    return result.model_dump()
