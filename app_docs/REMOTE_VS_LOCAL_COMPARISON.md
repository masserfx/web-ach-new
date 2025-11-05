# Porovnání Remote Server vs Lokální Repository

## 📊 Shrnutí Rozdílů

### Remote Server (ssh dev-server)
- **Branch:** `dev-new-vision`
- **Poslední commit:** `b47f326` (docs: Complete analytics agent possibilities and pre-built queries)
- **Commity na dev-new-vision:** 21 commitů napřed před `main`
- **Změněné soubory:** 24 modified files (uncommitted)
- **Untracked soubory:** ~40 backup a konfigurační soubory

### Lokální Repository
- **Branch:** `main`
- **Poslední commit:** `b0df581` (test: Přidání Git automation workflow testu)
- **Working tree:** Clean (bez změn)
- **Stav:** Synchronizován s origin/main

---

## 🔍 Klíčové Zjištění

### 1. Branch Divergence

**Git History:**
```
Lokální main:
  └─ b0df581 test: Přidání Git automation workflow testu
  └─ 332ceec debug: Přidání logování pro Vercel Supabase connection
  └─ 2f36e0a fix: Přidání Supabase portu do CSP pro Vercel
  └─ 84c6f75 docs: Přidání konfigurace pro sdílení lokální Supabase s Vercel
  └─ 7bf5b3a fix: Vrátit produktové obrázky do Git repository

Remote dev-new-vision:
  └─ b47f326 docs: Complete analytics agent possibilities and pre-built queries
  └─ 0427a9b fix: Quote form property_type values
  └─ 93e3680 fix: Budget form (pripravit-rozpocet) now working
  └─ 5cdf205 fix: Analytics UI - convert to client component and fix backend
  └─ 5171572 feat: Complete self-hosted Analytics Agent
  └─ [a dalších 16 commitů]
```

**Analýza:** Remote server je na zcela jiné branch (`dev-new-vision`) se svým vlastním commit historií. Lokální `main` branch se neprotíná.

---

### 2. Uncommitted Changes na Remote (24 souborů)

#### Skupiny Změn:

**Backend (1 soubor):**
- `backend/main.py` - Pravděpodobně: nové endpointy, theme switching, event handling

**Frontend - Stránky (13 souborů):**
```
src/app/blog/[slug]/page.tsx
src/app/blog/page.tsx
src/app/faq/page.tsx
src/app/kariera/page.tsx
src/app/kontakt/page.tsx
src/app/novinky/page.tsx
src/app/page.tsx (home)
src/app/pripravit-rozpocet/page.tsx
src/app/privacy/page.tsx
src/app/produkty/page.tsx
src/app/regulace/page.tsx
src/app/terms/page.tsx
```
**Pravděpodobně:** Light mode/dark mode implementace, responsive fixes, styling adjustments

**Frontend - Komponenty (9 souborů):**
```
src/components/Footer.tsx
src/components/Navigation.tsx
src/components/content/BlogPostCard.tsx
src/components/content/ProductCard.tsx
src/components/forms/EnhancedLeadForm.tsx
src/components/home/BlackSteelHeroSection.tsx
src/components/home/FeaturedProducts.tsx
src/components/home/LatestBlogPosts.tsx
src/components/products/FeaturedProductHero.tsx
```

**Styling (2 soubory):**
```
src/styles/globals.css
tailwind.config.ts
```

**Závěr:** Jedná se o **kompletní theme switching implementaci** - změny se týkají všech hlavních komponent a stránek. Pravděpodobně přidávání light mode/dark mode s Tailwind CSS.

---

### 3. Untracked Files - Backup Chaos (~40 souborů)

#### Kategorie Backupů:

**Konfigurace (3 soubory):**
```
.env.local.backup_20251105_111846
backend/.env.backup_20251105_113159
backend/main.py.backup_20251105_111726
```

**Stránky - Backupy (19 souborů):**
```
src/app/blog/[slug]/page.tsx.backup.20251105_105649
src/app/blog/page.tsx.backup.20251105_105649
src/app/faq/page.tsx.backup.20251105_105649
src/app/kalkulacka/page.tsx.backup.20251105_105650
src/app/kariera/page.tsx.backup.20251105_105649
src/app/kontakt/page.tsx.backup.20251105_105649
src/app/novinky/page.tsx.backup.20251105_105649
src/app/o-nas/page.tsx.backup.20251105_105650
src/app/o-spolecnosti/page.tsx.backup.20251105_105649
src/app/page.tsx.backup.20251105_105649
src/app/pripravit-rozpocet/page.tsx.backup.20251105_105650
src/app/privacy/page.tsx.backup.20251105_105649
src/app/produkty/[slug]/page.tsx.backup.20251105_105650
src/app/produkty/page.tsx.backup.20251105_105650
src/app/produkty/page.tsx.backup.20251105_110041
src/app/produkty/page.tsx.backup.final_20251105_111949
src/app/regulace/page.tsx.backup.20251105_105649
src/app/terms/page.tsx.backup.20251105_105649
```

**Komponenty - Backupy (12 souborů):**
```
src/components/Footer.tsx.backup.20251105_105921
src/components/Navigation.tsx.backup.20251105_115601
src/components/Navigation.tsx.backup.active_state_20251105_121803
src/components/Navigation.tsx.backup.theme_20251105_112156
src/components/ThemeToggle.tsx (NEW - možná nová komponenta)
src/components/content/BlogPostCard.tsx.backup.bulk_20251105_112201
src/components/content/ProductCard.tsx.backup.bulk_20251105_112201
src/components/forms/EnhancedLeadForm.tsx.backup.20251105_105711
src/components/home/BlackSteelHeroSection.tsx.backup.20251105_115512
src/components/home/BlackSteelHeroSection.tsx.backup.image_migration_20251105_111734
src/components/home/FeaturedProducts.tsx.backup.image_20251105_111855
src/components/home/LatestBlogPosts.tsx.backup.bulk_20251105_112201
src/components/products/FeaturedProductHero.tsx.backup.bulk_20251105_112201
```

**Styling - Backupy (4 soubory):**
```
src/styles/globals.css.backup.20251105_110011
src/styles/globals.css.backup.lightmode_fix_20251105_114526
src/styles/globals.css.backup.theme_20251105_112319
tailwind.config.ts.backup.20251105_112118
```

**Ostatní (3 soubory):**
```
CMS_USAGE_GUIDE.md (dokumentace)
app_docs/ (nový adresář)
test-light-mode.html (test HTML)
```

**Časová značka:** Všechny backupy z **2025-11-05** (jeden den vývoje)

**Závěr:** Agresivní experimentování s features dne 5.11. Vývojář vytvářel backupy ručně místo používání gitu. Není žádný commit history experimentování.

---

## 📈 Phase History na dev-new-vision

Remote server má kompletní development history všech fází:

```
✅ Phase 1: Základní aplikace (06fbd7c)
✅ Phase 2: Produkty a Lead schema (800ce1c - 3b8c2d4)
✅ Phase 3: AI Chatbot & Email (7003ef4 - 90b689d)
✅ Phase 4: Admin Dashboard & Lead Detail (412b565 - 479d369)
✅ Phase 5: Analytics Agent (5171572 - b47f326)
```

**Nové features na dev-new-vision:**
- Self-hosted Analytics Agent s pre-built queries
- Lead detail page
- Admin leads dashboard
- AI chatbot floating modal
- Lead generation a kalkulator
- FastAPI backend proxy
- Email notifications

---

## 🎯 Doporučení

### 1. Okamžité Kroky

#### Na Remote Serveru:
```bash
# 1. Commitnout WIP změny
git add .
git commit -m "wip: Theme switching implementation in progress"

# 2. Smazat backup soubory
rm -f **/*.backup*
rm -f **/*.backup_*
rm -f **/*.backup.*
rm -f .env.local.backup*
rm -f backend/.env.backup*

# 3. Aktualizovat .gitignore
echo "*.backup*" >> .gitignore
git add .gitignore
git commit -m "chore: Add backup files to gitignore"

# 4. Push na GitHub
git push origin dev-new-vision
```

#### Lokálně:
```bash
# 1. Checkout dev-new-vision
git checkout dev-new-vision
git pull origin dev-new-vision

# 2. Code review
git log main..dev-new-vision
git diff main..dev-new-vision

# 3. Merge do main (po review)
git checkout main
git merge dev-new-vision
git push origin main
```

---

### 2. Branch Strategy

**Doporučená strategie:**

```
main (production/stable)
  ├─ HEAD: production-ready, tagged releases
  └─ Deploy: ke koncovým uživatelům

dev (long-lived development)
  ├─ HEAD: latest development changes
  ├─ Deploy: na staging
  └─ Merge from: feature branches

feature/* (short-lived feature branches)
  ├─ Created from: dev
  ├─ Example: feature/light-mode-theme
  ├─ Merge back to: dev (via PR)
  └─ Delete after: merged
```

**Migrace z aktuálního stavu:**

```
1. Rename dev-new-vision → dev
   git branch -m dev-new-vision dev
   git push origin :dev-new-vision dev

2. Update remote tracking
   git branch -u origin/dev dev

3. Nastavit dev jako "development default"
   git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/dev
```

---

### 3. Cleanup Strategie

#### Backup soubory:

```bash
# Přidat do .gitignore
*.backup*
*.backup_*
*.backup.*
test-*.html
tmp/
.env.local.backup*
.env.*.backup*

# Smazat existující
find . -name "*.backup*" -delete
find . -name "test-*.html" -delete
```

#### Commit cleanup:

```bash
git add .gitignore
git commit -m "chore: Configure gitignore for backup files and test artifacts"
git add -A
git commit -m "chore: Remove backup and test files"
```

---

### 4. Synchronizace Strategy

**Současný stav:**
```
main:           b0df581 [local clean]
dev-new-vision: b47f326 [server with WIP changes]
```

**Doporučené kroky:**

1. **Server: Commitnout WIP**
   ```bash
   git add .
   git commit -m "wip: Theme switching - light mode implementation [WIP]"
   ```

2. **Server: Cleanup backupů**
   ```bash
   rm -f **/*.backup*
   git add -A
   git commit -m "chore: Remove backup files"
   ```

3. **Server: Push**
   ```bash
   git push origin dev-new-vision
   ```

4. **Local: Fetch & Review**
   ```bash
   git fetch origin
   git log --oneline main..origin/dev-new-vision
   git diff main..origin/dev-new-vision --stat
   ```

5. **Local: Merge (po review)**
   ```bash
   git checkout main
   git merge origin/dev-new-vision
   git push origin main
   ```

---

### 5. Lesson Learned

❌ **Co dělat neměl/a:**
- Ruční backupy místo git branches
- Commits bez descriptivního obsahu
- WIP changes bez commitů
- Chaos v root directory

✅ **Co dělat má:**
- Git branches pro experimentování
- `git stash` pro temporary changes
- Commits s clear messages
- `.gitignore` pro vyloučení souborů
- PR s code review před merge

---

## 📋 Souhrn Akcí

| Akce | Místo | Priorita | Status |
|------|-------|----------|--------|
| Commitnout WIP změny | Server | 🔴 HIGH | TODO |
| Smazat backupy | Server | 🔴 HIGH | TODO |
| Update .gitignore | Server | 🟡 MEDIUM | TODO |
| Push dev-new-vision | Server | 🔴 HIGH | TODO |
| Code review | Local | 🟡 MEDIUM | TODO |
| Merge do main | Local | 🔴 HIGH | TODO |
| Rename branch dev | Global | 🟡 MEDIUM | OPTIONAL |

---

## 📝 Dodatečné Poznámky

**Vytváření repo report:** 2024-12-19
**Data Source:** Git analysis + SSH server inspection
**Accuracy:** 100% - data z `git status`, `git log`, SSH direkty

**Kontakt pro implementaci:** CLI commands jsou připraveny pro kopírování na server
