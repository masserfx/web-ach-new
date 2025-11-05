#!/usr/bin/env python3
"""
AC Heating - Product Seeder
Seeds 8 product variants from business strategy into Supabase
"""

import os
import sys
from datetime import datetime
from supabase import create_client, Client

# Product data from vize_mise_swot_cile.md
PRODUCTS = [
    {
        "slug": "rd-tepelne-cerpadlo",
        "sku": "ACH-RD-TC-001",
        "name": "Tepelné čerpadlo pro rodinné domy",
        "model": "Convert NG ONE",
        "category": "Tepelná čerpadla",
        "subcategory": "Rodinné domy",
        "description": "Kompletní řešení tepelného čerpadla pro rodinné domy. Vlastní výroba Convert NG ONE s 18letou tradicí a 7500+ úspěšných instalací.",
        "product_type": "rd_tc",
        "target_market": "residential",
        "average_price": 265000.00,
        "price_min": 200000.00,
        "price_max": 350000.00,
        "typical_orders_per_project": 1,
        "installation_time_days": 5,
        "warranty_years": 7,
        "savings_percentage": 70,
        "pros": [
            "Vlastní česká výroba Convert NG ONE",
            "18+ let zkušeností na trhu",
            "7500+ spokojených zákazníků",
            "7 let záruky",
            "Úspora až 70% nákladů na vytápění",
            "Komplexní servis a podpora",
            "Dotace až 180 000 Kč",
            "Nízké provozní náklady"
        ],
        "cons": [
            "Vyšší počáteční investice",
            "Vyžaduje technickou místnost",
            "Závisí na venkovní teplotě"
        ],
        "features": {
            "heating": True,
            "cooling": True,
            "hot_water": True,
            "smart_control": True,
            "remote_monitoring": True,
            "inverter_technology": True
        },
        "technical_specs": {
            "heating_capacity": "8-16 kW",
            "cop": "4.5",
            "scop": "4.2",
            "refrigerant": "R32",
            "noise_level": "35-45 dB(A)",
            "power_supply": "400V 3-phase",
            "operating_temp": "-20°C to +35°C",
            "dimensions": "1200 x 600 x 800 mm",
            "weight": "180 kg"
        },
        "financing_options": {
            "cash": True,
            "installments": "6-60 měsíců",
            "leasing": True,
            "subsidies": True
        },
        "subsidies": {
            "nova_zelena_usporam": "až 180 000 Kč",
            "modern_fond": "až 50% nákladů",
            "kotlikove_dotace": "variabilní"
        },
        "in_stock": True,
        "published": True,
        "featured": True
    },
    {
        "slug": "rd-fotovoltaika",
        "sku": "ACH-RD-FVE-001",
        "name": "Fotovoltaika pro rodinné domy",
        "model": "FVE Komplet",
        "category": "Fotovoltaika",
        "subcategory": "Rodinné domy",
        "description": "Kompletní fotovoltaický systém pro rodinné domy včetně instalace, zapojení a uvedení do provozu. Kvalitní panely s dlouhou životností.",
        "product_type": "rd_fve",
        "target_market": "residential",
        "average_price": 480000.00,
        "price_min": 300000.00,
        "price_max": 800000.00,
        "typical_orders_per_project": 18,
        "installation_time_days": 3,
        "warranty_years": 10,
        "savings_percentage": 80,
        "pros": [
            "Úspora až 80% na elektřině",
            "Návratnost 7-10 let",
            "Dotace NZÚ až 180 000 Kč",
            "Zvýšení hodnoty nemovitosti",
            "Ekologické řešení",
            "Minimální údržba",
            "25 let záruka na panely"
        ],
        "cons": [
            "Závisí na slunečním svitu",
            "Vyžaduje vhodnou střechu",
            "Počáteční investice"
        ],
        "features": {
            "monitoring": True,
            "battery_ready": True,
            "smart_optimization": True,
            "grid_connection": True,
            "overproduction_storage": True
        },
        "technical_specs": {
            "typical_power": "5-10 kWp",
            "panel_efficiency": "20-22%",
            "inverter_efficiency": "97-98%",
            "panel_warranty": "25 let",
            "inverter_warranty": "10 let",
            "annual_production": "5000-10000 kWh"
        },
        "financing_options": {
            "cash": True,
            "installments": "6-60 měsíců",
            "leasing": True,
            "subsidies": True
        },
        "subsidies": {
            "nova_zelena_usporam": "až 180 000 Kč",
            "moderna_fond": "variabilní"
        },
        "in_stock": True,
        "published": True,
        "featured": True
    },
    {
        "slug": "klimatizace",
        "sku": "ACH-KLIMA-001",
        "name": "Klimatizace pro rodinné domy",
        "model": "Premium Series",
        "category": "Klimatizace",
        "subcategory": "Rodinné domy",
        "description": "Moderní klimatizační jednotky s funkcí vytápění i chlazení. Energeticky úsporné řešení pro celoroční komfort.",
        "product_type": "klima",
        "target_market": "residential",
        "average_price": 200000.00,
        "price_min": 80000.00,
        "price_max": 400000.00,
        "typical_orders_per_project": 1,
        "installation_time_days": 2,
        "warranty_years": 5,
        "savings_percentage": 40,
        "pros": [
            "Vytápění i chlazení",
            "Nízká spotřeba energie",
            "Rychlá instalace",
            "Tiché provozování",
            "Dálkové ovládání",
            "Čištění vzduchu"
        ],
        "cons": [
            "Vyžaduje pravidelnou údržbu",
            "Nižší výkon v extrémních teplotách"
        ],
        "features": {
            "heating": True,
            "cooling": True,
            "dehumidification": True,
            "air_purification": True,
            "wifi_control": True,
            "inverter": True
        },
        "technical_specs": {
            "cooling_capacity": "2.5-7.0 kW",
            "heating_capacity": "3.0-8.0 kW",
            "energy_class": "A+++",
            "noise_level": "20-35 dB(A)",
            "refrigerant": "R32"
        },
        "in_stock": True,
        "published": True,
        "featured": False
    },
    {
        "slug": "retrofit-modernizace",
        "sku": "ACH-RETRO-001",
        "name": "Retrofit - Modernizace vytápění",
        "model": "Retrofit Solutions",
        "category": "Modernizace",
        "subcategory": "Retrofit",
        "description": "Komplexní modernizace stávajících systémů vytápění na tepelné čerpadlo. Ideální pro výměnu starých kotlů.",
        "product_type": "retrofit",
        "target_market": "residential",
        "average_price": 200000.00,
        "price_min": 150000.00,
        "price_max": 300000.00,
        "typical_orders_per_project": 1,
        "installation_time_days": 7,
        "warranty_years": 5,
        "savings_percentage": 60,
        "pros": [
            "Využití stávajících rozvodů",
            "Nižší investice než nová instalace",
            "Dotace na výměnu kotle",
            "Rychlá návratnost",
            "Ekologické řešení"
        ],
        "cons": [
            "Omezení stávajícím systémem",
            "Možné dodatečné úpravy"
        ],
        "features": {
            "existing_system_integration": True,
            "smart_control": True,
            "gradual_modernization": True
        },
        "in_stock": True,
        "published": True,
        "featured": False
    },
    {
        "slug": "bd-tepelne-cerpadlo",
        "sku": "ACH-BD-TC-001",
        "name": "Tepelné čerpadlo pro bytové domy",
        "model": "Convert NG Commercial",
        "category": "Tepelná čerpadla",
        "subcategory": "Bytové domy",
        "description": "Komplexní systém vytápění a přípravy TUV pro bytové domy. Řešení pro SVJ a bytová družstva s vysokou efektivitou a úsporami.",
        "product_type": "bd_tc",
        "target_market": "commercial",
        "average_price": 2600000.00,
        "price_min": 2000000.00,
        "price_max": 4000000.00,
        "typical_orders_per_project": 1,
        "installation_time_days": 30,
        "warranty_years": 7,
        "savings_percentage": 60,
        "pros": [
            "Úspora až 60% provozních nákladů",
            "Zvýšení hodnoty nemovitosti",
            "Dotace až 50% nákladů",
            "Centrální řízení a monitoring",
            "Komplexní servis",
            "Ekologické řešení pro celý dům"
        ],
        "cons": [
            "Vyšší počáteční investice",
            "Vyžaduje souhlas většiny SVJ",
            "Delší doba instalace"
        ],
        "features": {
            "central_heating": True,
            "hot_water": True,
            "individual_metering": True,
            "remote_monitoring": True,
            "cascade_system": True,
            "backup_heating": True
        },
        "technical_specs": {
            "heating_capacity": "100-500 kW",
            "cop": "4.0-4.5",
            "hot_water_capacity": "5000-20000 l/day",
            "control_system": "BMS integration",
            "cascade_units": "2-6 units"
        },
        "subsidies": {
            "oppik": "až 50% nákladů",
            "modern_fond": "variabilní podle projektu"
        },
        "in_stock": True,
        "published": True,
        "featured": True
    },
    {
        "slug": "bd-fotovoltaika",
        "sku": "ACH-BD-FVE-001",
        "name": "Fotovoltaika pro bytové domy",
        "model": "FVE Commercial",
        "category": "Fotovoltaika",
        "subcategory": "Bytové domy",
        "description": "Fotovoltaický systém pro bytové domy včetně možnosti sdílení elektřiny mezi jednotkami. Snížení společných nákladů na elektřinu.",
        "product_type": "bd_fve",
        "target_market": "commercial",
        "average_price": 1100000.00,
        "price_min": 800000.00,
        "price_max": 2000000.00,
        "typical_orders_per_project": 45,
        "installation_time_days": 14,
        "warranty_years": 10,
        "savings_percentage": 70,
        "pros": [
            "Snížení nákladů na společné prostory",
            "Možnost sdílení elektřiny (komunitní energetika)",
            "Zvýšení hodnoty nemovitosti",
            "Ekologický profil budovy",
            "Dotace až 50%",
            "Dlouhá životnost"
        ],
        "cons": [
            "Vyžaduje souhlas SVJ",
            "Složitější realizace než u RD",
            "Nutnost řešit právní rámec sdílení"
        ],
        "features": {
            "community_sharing": True,
            "individual_metering": True,
            "smart_distribution": True,
            "grid_connection": True,
            "battery_integration": True,
            "monitoring_per_unit": True
        },
        "technical_specs": {
            "typical_power": "50-200 kWp",
            "panel_efficiency": "20-22%",
            "annual_production": "50000-200000 kWh",
            "monitoring": "Real-time per unit"
        },
        "subsidies": {
            "oppik": "až 50% nákladů",
            "nova_zelena_usporam": "variabilní"
        },
        "in_stock": True,
        "published": True,
        "featured": True
    },
    {
        "slug": "bd-komunitni-energetika",
        "sku": "ACH-BD-KE-001",
        "name": "Komunitní energetika pro bytové domy",
        "model": "Community Energy Solution",
        "category": "Fotovoltaika",
        "subcategory": "Komunitní energetika",
        "description": "Kompletní řešení komunitní energetiky s FVE a sdílením elektřiny mezi bytovými jednotkami. Inovativní způsob snížení nákladů.",
        "product_type": "bd_fve_komunita",
        "target_market": "commercial",
        "average_price": 1000000.00,
        "price_min": 700000.00,
        "price_max": 1500000.00,
        "typical_orders_per_project": 30,
        "installation_time_days": 21,
        "warranty_years": 10,
        "savings_percentage": 75,
        "pros": [
            "Maximální využití vyrobené energie",
            "Spravedlivé rozdělení úspor",
            "Podpora energetické soběstačnosti",
            "Inovativní řešení dle nové legislativy",
            "Výrazné snížení nákladů"
        ],
        "cons": [
            "Složitější právní nastavení",
            "Vyžaduje koordinaci s distributorem",
            "Nová oblast legislativy"
        ],
        "features": {
            "smart_sharing": True,
            "automated_billing": True,
            "virtual_metering": True,
            "optimization_algorithm": True,
            "battery_integration": True
        },
        "in_stock": True,
        "published": True,
        "featured": False
    },
    {
        "slug": "developer-reseni",
        "sku": "ACH-DEV-001",
        "name": "Komplexní řešení pro developery",
        "model": "Developer Package",
        "category": "B2B Řešení",
        "subcategory": "Developeři",
        "description": "Kompletní energetická řešení pro developerské projekty. Tepelná čerpadla + FVE + chytré řízení pro nové bytové i komerční objekty.",
        "product_type": "developer",
        "target_market": "developer",
        "average_price": 1500000.00,
        "price_min": 1000000.00,
        "price_max": 5000000.00,
        "typical_orders_per_project": 2,
        "installation_time_days": 45,
        "warranty_years": 7,
        "savings_percentage": 65,
        "pros": [
            "Zvýšení hodnoty projektu",
            "ESG compliance",
            "Nízká uhlíková stopa",
            "Komplexní dodávka",
            "Technická podpora v projekci",
            "Certifikace a dokumentace"
        ],
        "cons": [
            "Vyžaduje včasné zapojení do projektu",
            "Koordinace s dalšími profesemi"
        ],
        "features": {
            "turnkey_solution": True,
            "project_support": True,
            "bms_integration": True,
            "certification_support": True,
            "warranty_management": True
        },
        "target_market": "developer",
        "in_stock": True,
        "published": True,
        "featured": True
    }
]


def main():
    # Get Supabase credentials from environment
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: Missing Supabase credentials")
        print("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)
    
    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    
    print("🚀 Starting product seeding...")
    print(f"📦 Seeding {len(PRODUCTS)} products\n")
    
    success_count = 0
    error_count = 0
    
    for product in PRODUCTS:
        try:
            # Check if product already exists
            existing = supabase.table("products").select("id").eq("slug", product["slug"]).execute()
            
            if existing.data:
                print(f"⚠️  Product '{product['name']}' already exists, updating...")
                result = supabase.table("products").update(product).eq("slug", product["slug"]).execute()
            else:
                print(f"✅ Creating product '{product['name']}'...")
                result = supabase.table("products").insert(product).execute()
            
            success_count += 1
            
        except Exception as e:
            print(f"❌ Error with product '{product.get('name', 'Unknown')}': {str(e)}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print(f"✨ Seeding complete!")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
