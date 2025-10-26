# Stav migrace obrázků - 2025-10-26

## Přehled

- **Celkem článků**: 358
- **S individuálními fotkami**: 35 (10%)
- **S placeholder logem**: 323 (90%)
- **MySQL článků s fotkami**: 296
- **Úspěšnost mapování**: 35/296 (12%)

## Co funguje

✅ **417 foto složek** zkopírováno do `public/images/photo/`
✅ **35 článků** má správné featured images z `/images/photo/[id]/`
✅ **Fotky jsou přístupné** (HTTP 200)
✅ **Fallback logo** pro články bez fotek

## Co chybí

⚠️ **261 článků** z MySQL se nepodařilo zmapovat kvůli:
- Rozdílné slugy (transliterace českých znaků)
- Chybějící fyzické fotky ve složkách
- Články neimportované do Supabase

⚠️ **62 článků** v Supabase nemá odpovídající záznam v MySQL

## Struktura souborů

```
public/images/
├── photo/              # 417 složek, 1.1 GB
│   ├── 192/913.jpg     # Příklad: článek ID 35
│   ├── 270/1372.jpg    # Příklad: článek ID 70
│   └── ...
├── blog/               # 50 SVG placeholderů (604 KB)
│   └── [timestamp]-logo-v2.svg
└── logo-v2.svg         # Fallback (aktuálně 323 článků)
```

## Databáze

### Články s fotkami (35)

```sql
SELECT slug, featured_image
FROM blog_posts
WHERE featured_image LIKE '%/photo/%'
LIMIT 5;
```

Výsledek:
- aktuality-z-kotlikovych-dotaci → /images/photo/192/913.jpg
- ac-heating-v-bruselu → /images/photo/173/817.jpg
- ...

### Články s placeholderem (323)

```sql
SELECT slug, featured_image
FROM blog_posts
WHERE featured_image = '/images/logo-v2.svg'
LIMIT 5;
```

## Skript pro mapování

Soubor: `scripts/fix-blog-images.ts`

**Funguje:**
- Parsuje MySQL export (`articles.sql`)
- Najde `picture_id` pro každý článek
- Mapuje na fyzické soubory v `/photo/[id]/`
- Aktualizuje Supabase featured_image

**Omezení:**
- Vyžaduje přesnou shodu slugu
- Ignoruje články bez fyzických fotek
- Neřeší transliteraci českých znaků

## Další kroky

1. **Fuzzy slug matching** - pro řešení transliterace
2. **Generovat chybějící fotky** - placeholder obrázky pro články bez fotek
3. **Manuální review** - kontrola 261 nenalezených článků
4. **Optimalizace fotek** - WebP konverze pro rychlejší načítání

## Příklad úspěšného mapování

MySQL článek ID 35:
```sql
(35, 'cz', 'Aktuality z kotlíkových dotací',
 'aktuality-z-kotlikovych-dotaci', ..., 192, 'pg', ...)
```

↓ Mapuje na ↓

Supabase blog_post:
```json
{
  "slug": "aktuality-z-kotlikovych-dotaci",
  "featured_image": "/images/photo/192/913.jpg"
}
```

↓ Fyzický soubor ↓

`public/images/photo/192/913.jpg` ✅

## Diagnostika

### Zkontrolovat mapování:
```bash
cd ~/ac-heating-web-new
npx tsx scripts/fix-blog-images.ts
```

### Zobrazit články bez fotek:
```sql
SELECT id, slug, title
FROM blog_posts
WHERE featured_image = '/images/logo-v2.svg'
LIMIT 10;
```

### Test přístupu k fotkám:
```bash
curl -I http://localhost:3100/images/photo/192/913.jpg
# Očekávaný výsledek: HTTP 200
```

---

**Generováno**: 2025-10-26 00:45
**Autor**: Claude Code Migration Tool
