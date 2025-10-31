-- Zobrazit všechny unikátní kategorie a počet produktů v každé
SELECT 
  category,
  COUNT(*) as product_count
FROM products
WHERE published = true
GROUP BY category
ORDER BY category;
