import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:3100/';
const OUTPUT_DIR = '/tmp/homepage-analysis';

// Vytvoř výstupní adresář
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function analyzeHomepage() {
  console.log('🚀 Starting homepage analysis...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('🔗 Navigating to:', URL);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000); // Počkej na animace

  // 1. SCREENSHOT ANALÝZA
  console.log('\n📸 Taking screenshots...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'homepage-full.png'),
    fullPage: true
  });

  // Screenshot hero section
  const heroSelector = 'section:first-of-type, [class*="hero"], main > section:first-child';
  const heroElement = await page.$(heroSelector);
  if (heroElement) {
    await heroElement.screenshot({
      path: path.join(OUTPUT_DIR, 'hero-section.png')
    });
    console.log('  ✓ Hero section screenshot saved');
  }

  // 2. DOM + CSS INSPECTION
  console.log('\n🔍 Analyzing DOM and CSS...\n');

  const analysis = await page.evaluate(() => {
    const results = {
      heroSection: {},
      featureCards: [],
      ctaButtons: [],
      gradients: [],
      textOnColoredBg: [],
      contrastIssues: [],
      allColoredElements: []
    };

    // Helper: Získej computed styles
    function getComputedColor(element, property) {
      return window.getComputedStyle(element).getPropertyValue(property);
    }

    // Helper: Vypočítej relativní luminanci
    function getLuminance(r, g, b) {
      const rsRGB = r / 255;
      const gsRGB = g / 255;
      const bsRGB = b / 255;

      const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
      const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
      const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

      return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    // Helper: Vypočítej contrast ratio
    function getContrastRatio(color1, color2) {
      const rgb1 = color1.match(/\d+/g)?.map(Number);
      const rgb2 = color2.match(/\d+/g)?.map(Number);

      if (!rgb1 || !rgb2 || rgb1.length < 3 || rgb2.length < 3) return null;

      const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);

      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);

      return (lighter + 0.05) / (darker + 0.05);
    }

    // Helper: Získej CSS selector
    function getSelector(element) {
      if (element.id) return `#${element.id}`;

      const classes = Array.from(element.classList)
        .filter(c => !c.startsWith('_') && !c.match(/^jsx-/))
        .slice(0, 3);

      if (classes.length > 0) return `.${classes.join('.')}`;

      return element.tagName.toLowerCase();
    }

    // Helper: Je element viditelný?
    function isVisible(element) {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' &&
             style.visibility !== 'hidden' &&
             style.opacity !== '0' &&
             element.offsetParent !== null;
    }

    // 1. HERO SECTION ANALÝZA
    const heroSection = document.querySelector('section:first-of-type') ||
                       document.querySelector('[class*="hero"]') ||
                       document.querySelector('main > section:first-child');

    if (heroSection && isVisible(heroSection)) {
      const heroHeading = heroSection.querySelector('h1');
      const heroText = heroSection.querySelector('p');
      const heroButtons = heroSection.querySelectorAll('button, a[class*="button"], a[class*="btn"], [role="button"]');

      results.heroSection = {
        selector: getSelector(heroSection),
        classes: Array.from(heroSection.classList).join(' '),
        bgColor: getComputedColor(heroSection, 'background-color'),
        bgImage: getComputedColor(heroSection, 'background-image'),
        heading: heroHeading ? {
          text: heroHeading.textContent.trim().substring(0, 60),
          selector: getSelector(heroHeading),
          classes: Array.from(heroHeading.classList).join(' '),
          color: getComputedColor(heroHeading, 'color'),
          fontSize: getComputedColor(heroHeading, 'font-size'),
          fontWeight: getComputedColor(heroHeading, 'font-weight')
        } : null,
        paragraph: heroText ? {
          text: heroText.textContent.trim().substring(0, 60),
          selector: getSelector(heroText),
          classes: Array.from(heroText.classList).join(' '),
          color: getComputedColor(heroText, 'color'),
          fontSize: getComputedColor(heroText, 'font-size')
        } : null,
        buttons: Array.from(heroButtons).map(btn => ({
          text: btn.textContent.trim(),
          selector: getSelector(btn),
          classes: Array.from(btn.classList).join(' '),
          color: getComputedColor(btn, 'color'),
          bgColor: getComputedColor(btn, 'background-color'),
          bgImage: getComputedColor(btn, 'background-image'),
          border: getComputedColor(btn, 'border')
        }))
      };

      // Contrast check pro hero heading
      if (heroHeading && isVisible(heroHeading)) {
        const textColor = getComputedColor(heroHeading, 'color');
        const bgColor = getComputedColor(heroSection, 'background-color');
        const contrast = getContrastRatio(textColor, bgColor);

        if (contrast && contrast < 4.5) {
          results.contrastIssues.push({
            element: 'Hero Heading',
            selector: getSelector(heroHeading),
            classes: Array.from(heroHeading.classList).join(' '),
            textColor,
            bgColor,
            contrastRatio: contrast.toFixed(2),
            wcagAA: contrast >= 4.5 ? 'PASS' : 'FAIL',
            wcagAAA: contrast >= 7 ? 'PASS' : 'FAIL',
            recommendation: contrast < 3 ? 'CRITICAL - change immediately' :
                          contrast < 4.5 ? 'Fix needed for WCAG AA' :
                          contrast < 7 ? 'Passes AA, fails AAA' : 'Passes all'
          });
        }
      }

      // Contrast check pro hero paragraph
      if (heroText && isVisible(heroText)) {
        const textColor = getComputedColor(heroText, 'color');
        const bgColor = getComputedColor(heroSection, 'background-color');
        const contrast = getContrastRatio(textColor, bgColor);

        if (contrast && contrast < 4.5) {
          results.contrastIssues.push({
            element: 'Hero Paragraph',
            selector: getSelector(heroText),
            classes: Array.from(heroText.classList).join(' '),
            textColor,
            bgColor,
            contrastRatio: contrast.toFixed(2),
            wcagAA: 'FAIL',
            recommendation: 'Increase text darkness'
          });
        }
      }
    }

    // 2. VŠECHNY TLAČÍTKA (CTA) ANALÝZA
    const allButtons = document.querySelectorAll(
      'button, a[class*="button"], a[class*="btn"], [role="button"], a[class*="cta"]'
    );

    allButtons.forEach((btn, idx) => {
      if (!isVisible(btn)) return;

      const textColor = getComputedColor(btn, 'color');
      const bgColor = getComputedColor(btn, 'background-color');
      const bgImage = getComputedColor(btn, 'background-image');
      const hasGradient = bgImage !== 'none' && bgImage.includes('gradient');

      const btnData = {
        index: idx,
        text: btn.textContent.trim().substring(0, 40),
        selector: getSelector(btn),
        classes: Array.from(btn.classList).join(' '),
        color: textColor,
        bgColor: bgColor,
        bgImage: bgImage !== 'none' ? (hasGradient ? 'GRADIENT' : bgImage) : 'none',
        position: btn.getBoundingClientRect().top < 1000 ? 'above-fold' : 'below-fold',
        hasGradient
      };

      results.ctaButtons.push(btnData);

      // Contrast check (jen pro solid backgrounds)
      if (!hasGradient && bgColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = getContrastRatio(textColor, bgColor);
        if (contrast && contrast < 4.5) {
          results.contrastIssues.push({
            element: `Button: "${btnData.text}"`,
            selector: getSelector(btn),
            classes: Array.from(btn.classList).join(' '),
            textColor,
            bgColor,
            contrastRatio: contrast.toFixed(2),
            wcagAA: 'FAIL',
            recommendation: hasGradient ? 'Review gradient contrast manually' :
                          'Increase contrast between text and background'
          });
        }
      }

      // Zapsat gradients
      if (hasGradient) {
        results.gradients.push({
          element: `Button: "${btnData.text}"`,
          selector: getSelector(btn),
          classes: Array.from(btn.classList).join(' '),
          gradient: bgImage
        });
      }
    });

    // 3. FEATURE CARDS / SECTIONS
    const sections = document.querySelectorAll('section');
    sections.forEach((section, idx) => {
      if (!isVisible(section) || idx === 0) return; // Skip hero

      const heading = section.querySelector('h2, h3');
      const paragraphs = section.querySelectorAll('p');

      if (heading || paragraphs.length > 0) {
        const sectionData = {
          index: idx,
          selector: getSelector(section),
          classes: Array.from(section.classList).join(' '),
          bgColor: getComputedColor(section, 'background-color'),
          bgImage: getComputedColor(section, 'background-image'),
          heading: heading ? {
            text: heading.textContent.trim().substring(0, 50),
            color: getComputedColor(heading, 'color'),
            classes: Array.from(heading.classList).join(' ')
          } : null,
          paragraphs: Array.from(paragraphs).slice(0, 3).map(p => ({
            text: p.textContent.trim().substring(0, 50),
            color: getComputedColor(p, 'color'),
            classes: Array.from(p.classList).join(' ')
          }))
        };

        results.featureCards.push(sectionData);

        // Contrast check pro paragraphs
        paragraphs.forEach(p => {
          if (!isVisible(p)) return;
          const textColor = getComputedColor(p, 'color');
          const bgColor = getComputedColor(section, 'background-color');
          const contrast = getContrastRatio(textColor, bgColor);

          if (contrast && contrast < 4.5) {
            results.contrastIssues.push({
              element: `Section #${idx} text`,
              selector: getSelector(p),
              classes: Array.from(p.classList).join(' '),
              textColor,
              bgColor,
              contrastRatio: contrast.toFixed(2),
              wcagAA: 'FAIL',
              recommendation: 'Use darker text color'
            });
          }
        });
      }
    });

    // 4. VŠECHNY PRVKY S BARVAMI (kompletní sken)
    const coloredElements = document.querySelectorAll('[class*="text-"], [class*="bg-"], [style*="color"], [style*="background"]');
    coloredElements.forEach(el => {
      if (!isVisible(el)) return;

      const textColor = getComputedColor(el, 'color');
      const bgColor = getComputedColor(el, 'background-color');
      const bgImage = getComputedColor(el, 'background-image');

      if (textColor !== 'rgb(0, 0, 0)' || bgColor !== 'rgba(0, 0, 0, 0)' || bgImage !== 'none') {
        results.allColoredElements.push({
          tag: el.tagName,
          selector: getSelector(el),
          classes: Array.from(el.classList).join(' '),
          textColor,
          bgColor,
          bgImage: bgImage !== 'none' ? 'YES' : 'none'
        });
      }
    });

    return results;
  });

  // Ulož výsledky
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'analysis.json'),
    JSON.stringify(analysis, null, 2)
  );

  // 3. CONSOLE OUTPUT - Formátovaný report
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 HOMEPAGE VISUAL ANALYSIS REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Hero Section
  console.log('🎯 HERO SECTION');
  console.log('───────────────────────────────────────────────────────────');
  console.log(`Selector: ${analysis.heroSection.selector}`);
  console.log(`Classes: ${analysis.heroSection.classes || 'none'}`);
  console.log(`Background Color: ${analysis.heroSection.bgColor}`);
  if (analysis.heroSection.bgImage !== 'none') {
    console.log(`Background Image/Gradient: YES`);
  }
  console.log();

  if (analysis.heroSection.heading) {
    console.log(`📝 Heading: "${analysis.heroSection.heading.text}"`);
    console.log(`   Selector: ${analysis.heroSection.heading.selector}`);
    console.log(`   Classes: ${analysis.heroSection.heading.classes}`);
    console.log(`   Color: ${analysis.heroSection.heading.color}`);
    console.log(`   Font Size: ${analysis.heroSection.heading.fontSize}`);
    console.log(`   Font Weight: ${analysis.heroSection.heading.fontWeight}`);
    console.log();
  }

  if (analysis.heroSection.paragraph) {
    console.log(`📄 Paragraph: "${analysis.heroSection.paragraph.text}"`);
    console.log(`   Selector: ${analysis.heroSection.paragraph.selector}`);
    console.log(`   Classes: ${analysis.heroSection.paragraph.classes}`);
    console.log(`   Color: ${analysis.heroSection.paragraph.color}`);
    console.log();
  }

  if (analysis.heroSection.buttons && analysis.heroSection.buttons.length > 0) {
    console.log(`🔘 CTA Buttons in Hero:`);
    analysis.heroSection.buttons.forEach((btn, idx) => {
      console.log(`\n   Button #${idx + 1}: "${btn.text}"`);
      console.log(`   Selector: ${btn.selector}`);
      console.log(`   Classes: ${btn.classes}`);
      console.log(`   Text Color: ${btn.color}`);
      console.log(`   BG Color: ${btn.bgColor}`);
      if (btn.bgImage !== 'none') {
        console.log(`   BG Gradient/Image: YES`);
      }
    });
    console.log();
  }

  // All CTA Buttons
  console.log('\n🔘 ALL CTA BUTTONS ON PAGE');
  console.log('───────────────────────────────────────────────────────────');
  analysis.ctaButtons.forEach((btn, idx) => {
    console.log(`\n${idx + 1}. "${btn.text}" (${btn.position})`);
    console.log(`   Selector: ${btn.selector}`);
    console.log(`   Classes: ${btn.classes}`);
    console.log(`   Text: ${btn.color}`);
    console.log(`   BG: ${btn.bgColor}`);
    if (btn.hasGradient) {
      console.log(`   ⚠️  HAS GRADIENT - manual contrast review needed`);
    }
  });

  // Feature Sections
  console.log('\n\n🎴 FEATURE SECTIONS');
  console.log('───────────────────────────────────────────────────────────');
  analysis.featureCards.slice(0, 5).forEach((section, idx) => {
    console.log(`\nSection #${section.index}:`);
    console.log(`  Selector: ${section.selector}`);
    console.log(`  Classes: ${section.classes}`);
    console.log(`  BG Color: ${section.bgColor}`);
    if (section.heading) {
      console.log(`  Heading: "${section.heading.text}"`);
      console.log(`    Color: ${section.heading.color}`);
      console.log(`    Classes: ${section.heading.classes}`);
    }
    if (section.paragraphs && section.paragraphs.length > 0) {
      console.log(`  Paragraphs (${section.paragraphs.length}):`);
      section.paragraphs.forEach(p => {
        console.log(`    - "${p.text.substring(0, 40)}..."`);
        console.log(`      Color: ${p.color}`);
        console.log(`      Classes: ${p.classes}`);
      });
    }
  });

  // Gradients
  console.log('\n\n🌈 GRADIENTS FOUND');
  console.log('───────────────────────────────────────────────────────────');
  if (analysis.gradients.length === 0) {
    console.log('No gradients found');
  } else {
    const uniqueGradients = [...new Map(analysis.gradients.map(g => [g.selector, g])).values()];
    uniqueGradients.forEach((grad, idx) => {
      console.log(`\n${idx + 1}. ${grad.element}`);
      console.log(`   Selector: ${grad.selector}`);
      console.log(`   Classes: ${grad.classes}`);
      console.log(`   Gradient: ${grad.gradient.substring(0, 100)}...`);
    });
  }

  // CRITICAL: Contrast Issues
  console.log('\n\n⚠️  CONTRAST ISSUES (WCAG FAILURES)');
  console.log('═══════════════════════════════════════════════════════════');
  if (analysis.contrastIssues.length === 0) {
    console.log('✅ No contrast issues found! All elements pass WCAG AA.');
  } else {
    console.log(`Found ${analysis.contrastIssues.length} elements with contrast issues:\n`);

    analysis.contrastIssues.forEach((issue, idx) => {
      console.log(`${idx + 1}. ❌ ${issue.element}`);
      console.log(`   Selector: ${issue.selector}`);
      console.log(`   Classes: ${issue.classes}`);
      console.log(`   Text Color: ${issue.textColor}`);
      console.log(`   BG Color: ${issue.bgColor}`);
      console.log(`   Contrast Ratio: ${issue.contrastRatio}:1`);
      console.log(`   WCAG AA (4.5:1): ${issue.wcagAA}`);
      if (issue.wcagAAA) {
        console.log(`   WCAG AAA (7:1): ${issue.wcagAAA}`);
      }
      console.log(`   📋 Recommendation: ${issue.recommendation}`);
      console.log();
    });
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📁 Analysis saved to: ${OUTPUT_DIR}/analysis.json`);
  console.log(`📸 Screenshots saved to: ${OUTPUT_DIR}/`);
  console.log('═══════════════════════════════════════════════════════════\n');

  await browser.close();
}

analyzeHomepage()
  .then(() => {
    console.log('✅ Analysis complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
