-- Seed AC Heating Products (8 variants from business strategy)

-- Clear existing products (optional)
-- TRUNCATE products CASCADE;

-- 1. RD Tepelné čerpadlo
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  typical_orders_per_project, installation_time_days, warranty_years,
  savings_percentage, in_stock, published, featured,
  pros, cons, features, technical_specs, financing_options, subsidies
) VALUES (
  'rd-tepelne-cerpadlo',
  'ACH-RD-TC-001',
  'Tepelné čerpadlo pro rodinné domy',
  'Convert NG ONE',
  'Tepelná čerpadla',
  'Rodinné domy',
  'Kompletní řešení tepelného čerpadla pro rodinné domy. Vlastní výroba Convert NG ONE s 18letou tradicí a 7500+ úspěšných instalací.',
  'rd_tc',
  'residential',
  265000.00,
  200000.00,
  350000.00,
  1,
  5,
  7,
  70,
  true,
  true,
  true,
  ARRAY['Vlastní česká výroba Convert NG ONE', '18+ let zkušeností na trhu', '7500+ spokojených zákazníků', '7 let záruky', 'Úspora až 70% nákladů na vytápění', 'Komplexní servis a podpora', 'Dotace až 180 000 Kč', 'Nízké provozní náklady'],
  ARRAY['Vyšší počáteční investice', 'Vyžaduje technickou místnost', 'Závisí na venkovní teplotě'],
  '{"heating": true, "cooling": true, "hot_water": true, "smart_control": true, "remote_monitoring": true, "inverter_technology": true}'::jsonb,
  '{"heating_capacity": "8-16 kW", "cop": "4.5", "scop": "4.2", "refrigerant": "R32", "noise_level": "35-45 dB(A)", "power_supply": "400V 3-phase", "operating_temp": "-20°C to +35°C", "dimensions": "1200 x 600 x 800 mm", "weight": "180 kg"}'::jsonb,
  '{"cash": true, "installments": "6-60 měsíců", "leasing": true, "subsidies": true}'::jsonb,
  '{"nova_zelena_usporam": "až 180 000 Kč", "modern_fond": "až 50% nákladů", "kotlikove_dotace": "variabilní"}'::jsonb
);

-- 2. RD Fotovoltaika
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  typical_orders_per_project, installation_time_days, warranty_years,
  savings_percentage, in_stock, published, featured,
  pros, cons, features, technical_specs, subsidies
) VALUES (
  'rd-fotovoltaika',
  'ACH-RD-FVE-001',
  'Fotovoltaika pro rodinné domy',
  'FVE Komplet',
  'Fotovoltaika',
  'Rodinné domy',
  'Kompletní fotovoltaický systém pro rodinné domy včetně instalace, zapojení a uvedení do provozu.',
  'rd_fve',
  'residential',
  480000.00,
  300000.00,
  800000.00,
  18,
  3,
  10,
  80,
  true,
  true,
  true,
  ARRAY['Úspora až 80% na elektřině', 'Návratnost 7-10 let', 'Dotace NZÚ až 180 000 Kč', 'Zvýšení hodnoty nemovitosti', 'Ekologické řešení', 'Minimální údržba', '25 let záruka na panely'],
  ARRAY['Závisí na slunečním svitu', 'Vyžaduje vhodnou střechu', 'Počáteční investice'],
  '{"monitoring": true, "battery_ready": true, "smart_optimization": true, "grid_connection": true}'::jsonb,
  '{"typical_power": "5-10 kWp", "panel_efficiency": "20-22%", "inverter_efficiency": "97-98%", "panel_warranty": "25 let", "annual_production": "5000-10000 kWh"}'::jsonb,
  '{"nova_zelena_usporam": "až 180 000 Kč"}'::jsonb
);

-- 3. Klimatizace
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published, pros, cons, features, technical_specs
) VALUES (
  'klimatizace',
  'ACH-KLIMA-001',
  'Klimatizace pro rodinné domy',
  'Premium Series',
  'Klimatizace',
  'Rodinné domy',
  'Moderní klimatizační jednotky s funkcí vytápění i chlazení.',
  'klima',
  'residential',
  200000.00,
  80000.00,
  400000.00,
  2,
  5,
  40,
  true,
  true,
  ARRAY['Vytápění i chlazení', 'Nízká spotřeba energie', 'Rychlá instalace', 'Tiché provozování'],
  ARRAY['Vyžaduje pravidelnou údržbu', 'Nižší výkon v extrémních teplotách'],
  '{"heating": true, "cooling": true, "wifi_control": true, "inverter": true}'::jsonb,
  '{"cooling_capacity": "2.5-7.0 kW", "heating_capacity": "3.0-8.0 kW", "energy_class": "A+++"}'::jsonb
);

-- 4. BD Tepelné čerpadlo
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published, featured,
  pros, cons, features, technical_specs, subsidies
) VALUES (
  'bd-tepelne-cerpadlo',
  'ACH-BD-TC-001',
  'Tepelné čerpadlo pro bytové domy',
  'Convert NG Commercial',
  'Tepelná čerpadla',
  'Bytové domy',
  'Komplexní systém vytápění a přípravy TUV pro bytové domy.',
  'bd_tc',
  'commercial',
  2600000.00,
  2000000.00,
  4000000.00,
  30,
  7,
  60,
  true,
  true,
  true,
  ARRAY['Úspora až 60% provozních nákladů', 'Zvýšení hodnoty nemovitosti', 'Dotace až 50% nákladů', 'Centrální řízení a monitoring'],
  ARRAY['Vyšší počáteční investice', 'Vyžaduje souhlas většiny SVJ', 'Delší doba instalace'],
  '{"central_heating": true, "hot_water": true, "remote_monitoring": true, "cascade_system": true}'::jsonb,
  '{"heating_capacity": "100-500 kW", "cop": "4.0-4.5", "control_system": "BMS integration"}'::jsonb,
  '{"oppik": "až 50% nákladů"}'::jsonb
);

-- 5. BD Fotovoltaika
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published, featured,
  pros, cons, features, technical_specs, subsidies
) VALUES (
  'bd-fotovoltaika',
  'ACH-BD-FVE-001',
  'Fotovoltaika pro bytové domy',
  'FVE Commercial',
  'Fotovoltaika',
  'Bytové domy',
  'Fotovoltaický systém pro bytové domy včetně možnosti sdílení elektřiny.',
  'bd_fve',
  'commercial',
  1100000.00,
  800000.00,
  2000000.00,
  14,
  10,
  70,
  true,
  true,
  true,
  ARRAY['Snížení nákladů na společné prostory', 'Možnost sdílení elektřiny', 'Zvýšení hodnoty nemovitosti', 'Dotace až 50%'],
  ARRAY['Vyžaduje souhlas SVJ', 'Nutnost řešit právní rámec sdílení'],
  '{"community_sharing": true, "smart_distribution": true, "monitoring_per_unit": true}'::jsonb,
  '{"typical_power": "50-200 kWp", "annual_production": "50000-200000 kWh"}'::jsonb,
  '{"oppik": "až 50% nákladů"}'::jsonb
);

-- 6. BD Komunitní energetika
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published,
  pros, cons, features
) VALUES (
  'bd-komunitni-energetika',
  'ACH-BD-KE-001',
  'Komunitní energetika pro bytové domy',
  'Community Energy Solution',
  'Fotovoltaika',
  'Komunitní energetika',
  'Kompletní řešení komunitní energetiky s FVE a sdílením elektřiny.',
  'bd_fve_komunita',
  'commercial',
  1000000.00,
  700000.00,
  1500000.00,
  21,
  10,
  75,
  true,
  true,
  ARRAY['Maximální využití vyrobené energie', 'Spravedlivé rozdělení úspor', 'Podpora energetické soběstačnosti'],
  ARRAY['Složitější právní nastavení', 'Nová oblast legislativy'],
  '{"smart_sharing": true, "automated_billing": true, "optimization_algorithm": true}'::jsonb
);

-- 7. Developer řešení
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published, featured,
  pros, cons, features
) VALUES (
  'developer-reseni',
  'ACH-DEV-001',
  'Komplexní řešení pro developery',
  'Developer Package',
  'B2B Řešení',
  'Developeři',
  'Kompletní energetická řešení pro developerské projekty.',
  'developer',
  'developer',
  1500000.00,
  1000000.00,
  5000000.00,
  45,
  7,
  65,
  true,
  true,
  true,
  ARRAY['Zvýšení hodnoty projektu', 'ESG compliance', 'Nízká uhlíková stopa', 'Komplexní dodávka'],
  ARRAY['Vyžaduje včasné zapojení do projektu', 'Koordinace s dalšími profesemi'],
  '{"turnkey_solution": true, "project_support": true, "bms_integration": true}'::jsonb
);

-- 8. Retrofit modernizace
INSERT INTO products (
  slug, sku, name, model, category, subcategory, description,
  product_type, target_market, average_price, price_min, price_max,
  installation_time_days, warranty_years, savings_percentage,
  in_stock, published,
  pros, cons, features
) VALUES (
  'retrofit-modernizace',
  'ACH-RETRO-001',
  'Retrofit - Modernizace vytápění',
  'Retrofit Solutions',
  'Modernizace',
  'Retrofit',
  'Komplexní modernizace stávajících systémů vytápění na tepelné čerpadlo.',
  'retrofit',
  'residential',
  200000.00,
  150000.00,
  300000.00,
  7,
  5,
  60,
  true,
  true,
  ARRAY['Využití stávajících rozvodů', 'Nižší investice než nová instalace', 'Dotace na výměnu kotle'],
  ARRAY['Omezení stávajícím systémem', 'Možné dodatečné úpravy'],
  '{"existing_system_integration": true, "smart_control": true}'::jsonb
);

-- Verify insertion
SELECT slug, name, average_price, product_type, target_market FROM products ORDER BY average_price;
