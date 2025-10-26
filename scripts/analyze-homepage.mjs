import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const URL = 'http://localhost:3100/';
const OUTPUT_DIR = '/tmp/homepage-analysis';

// Vytvoř výstupní adresář
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function analyzeHomepage() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('🔗 Navigating to:', URL);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. SCREENSHOT ANALÝZA
  console.log('\n📸 Taking full page screenshot...');
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'homepage-full.png'),
    fullPage: true
  });

  // Screenshot hero section
  const heroElement = await page.$('section:first-of-type');
  if (heroElement) {
    await heroElement.screenshot({
      path: path.join(OUTPUT_DIR, 'hero-section.png')
    });
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
      contrastIssues: []
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
      const rgb1 = color1.match(/\d+/g).map(Number);
      const rgb2 = color2.match(/\d+/g).map(Number);

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
        .filter(c => !c.startsWith('_'))
        .slice(0, 3)
        .join('.');

      if (classes) return `.${classes}`;

      return element.tagName.toLowerCase();
    }

    // 1. HERO SECTION ANALÝZA
    const heroSection = document.querySelector('section:first-of-type') ||
                       document.querySelector('[class*="hero"]') ||
                       document.querySelector('main > section:first-child');

    if (heroSection) {
      const heroHeading = heroSection.querySelector('h1');
      const heroText = heroSection.querySelector('p');
      const heroCTA = heroSection.querySelector('button, a[class*="button"], a[class*="btn"]');

      results.heroSection = {
        selector: getSelector(heroSection),
        bgColor: getComputedColor(heroSection, 'background-color'),
        bgImage: getComputedColor(heroSection, 'background-image'),
        heading: heroHeading ? {
          text: heroHeading.textContent.trim().substring(0, 50),
          color: getComputedColor(heroHeading, 'color'),
          fontSize: getComputedColor(heroHeading, 'font-size'),
          fontWeight: getComputedColor(heroHeading, 'font-weight')
        } : null,
        paragraph: heroText ? {
          text: heroText.textContent.trim().substring(0, 50),
          color: getComputedColor(heroText, 'color'),
          fontSize: getComputedColor(heroText, 'font-size')
        } : null,
        cta: heroCTA ? {
          text: heroCTA.textContent.trim(),
          color: getComputedColor(heroCTA, 'color'),
          bgColor: getComputedColor(heroCTA, 'background-color'),
          bgImage: getComputedColor(heroCTA, 'background-image'),
          border: getComputedColor(heroCTA, 'border')
        } : null
      };

      // Contrast check pro hero
      if (heroHeading) {
        const textColor = getComputedColor(heroHeading, 'color');
        const bgColor = getComputedColor(heroSection, 'background-color');
        try {
          const contrast = getContrastRatio(textColor, bgColor);
          if (contrast < 4.5) {
            results.contrastIssues.push({
              element: 'Hero Heading',
              selector: getSelector(heroHeading),
              textColor,
              bgColor,
              contrastRatio: contrast.toFixed(2),
              wcagAA: contrast >= 4.5 ? '✅ PASS' : '❌ FAIL',
              wcagAAA: contrast >= 7 ? '✅ PASS' : '❌ FAIL'
            });
          }
        } catch (e) {
          // Skip gradient backgrounds
        }
      }
    }

    // 2. FEATURE CARDS ANALÝZA
    const featureCards = document.querySelectorAll('[class*="feature"], [class*="card"], article');
    featureCards.forEach((card, idx) => {
      const heading = card.querySelector('h2, h3, h4');
      const text = card.querySelector('p');

      if (heading || text) {
        const cardData = {
          index: idx,
          selector: getSelector(card),
          bgColor: getComputedColor(card, 'background-color'),
          bgImage: getComputedColor(card, 'background-image'),
          heading: heading ? {
            text: heading.textContent.trim().substring(0, 40),
            color: getComputedColor(heading, 'color')
          } : null,
          text: text ? {
            content: text.textContent.trim().substring(0, 40),
            color: getComputedColor(text, 'color')
          } : null
        };

        results.featureCards.push(cardData);

        // Contrast check
        if (text) {
          const textColor = getComputedColor(text, 'color');
          const bgColor = getComputedColor(card, 'background-color');
          try {
            const contrast = getContrastRatio(textColor, bgColor);
            if (contrast < 4.5) {
              results.contrastIssues.push({
                element: `Feature Card #${idx}`,
                selector: getSelector(text),
                textColor,
                bgColor,
                contrastRatio: contrast.toFixed(2),
                wcagAA: '❌ FAIL'
              });
            }
          } catch (e) {}
        }
      }
    });

    // 3. CTA BUTTONS ANALÝZA
    const buttons = document.querySelectorAll('button, a[class*="button"], a[class*="btn"], a[class*="cta"]');
    buttons.forEach((btn, idx) => {
      const btnData = {
        index: idx,
        text: btn.textContent.trim(),
        selector: getSelector(btn),
        color: getComputedColor(btn, 'color'),
        bgColor: getComputedColor(btn, 'background-color'),
        bgImage: getComputedColor(btn, 'background-image'),
        border: getComputedColor(btn, 'border'),
        position: btn.getBoundingClientRect().top < 1000 ? 'above-fold' : 'below-fold'
      };

      results.ctaButtons.push(btnData);

      // Contrast check
      const textColor = getComputedColor(btn, 'color');
      const bgColor = getComputedColor(btn, 'background-color');
      const hasGradient = bgColor.includes('gradient');

      if (!hasGradient) {
        try {
          const contrast = getContrastRatio(textColor, bgColor);
          if (contrast < 4.5) {
            results.contrastIssues.push({
              element: `Button: "${btnData.text}"`,
              selector: getSelector(btn),
              textColor,
              bgColor,
              contrastRatio: contrast.toFixed(2),
              wcagAA: '❌ FAIL'
            });
          }
        } catch (e) {}
      } else {
        results.gradients.push({
          element: `Button: "${btnData.text}"`,
          selector: getSelector(btn),
          gradient: bgColor
        });
      }
    });

    // 4. GRADIENT ANALÝZA
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const bgImage = getComputedColor(el, 'background-image');
      if (bgImage.includes('gradient')) {
        results.gradients.push({
          element: el.tagName,
          selector: getSelector(el),
          gradient: bgImage
        });
      }
    });

    // 5. TEXT NA BAREVNÝCH POZADÍCH
    const coloredBgs = document.querySelectorAll('[class*="bg-"], [style*="background"]');
    coloredBgs.forEach(el => {
      const texts = el.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a');
      texts.forEach(text => {
        if (text.textContent.trim()) {
          const textColor = getComputedColor(text, 'color');
          const bgColor = getComputedColor(el, 'background-color');

          if (bgColor !== 'rgba(0, 0, 0, 0)' && !bgColor.includes('gradient')) {
            try {
              const contrast = getContrastRatio(textColor, bgColor);
              results.textOnColoredBg.push({
                text: text.textContent.trim().substring(0, 30),
                selector: getSelector(text),
                textColor,
                bgColor,
                contrastRatio: contrast.toFixed(2),
                pass: contrast >= 4.5
              });
            } catch (e) {}
          }
        }
      });
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
  console.log('📊 HOMEPAGE ANALYSIS REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Hero Section
  console.log('🎯 HERO SECTION');
  console.log('───────────────────────────────────────────────────────────');
  if (analysis.heroSection.heading) {
    console.log(`Heading: "${analysis.heroSection.heading.text}"`);
    console.log(`  Color: ${analysis.heroSection.heading.color}`);
    console.log(`  Font Size: ${analysis.heroSection.heading.fontSize}`);
  }
  if (analysis.heroSection.paragraph) {
    console.log(`Paragraph: "${analysis.heroSection.paragraph.text}"`);
    console.log(`  Color: ${analysis.heroSection.paragraph.color}`);
  }
  if (analysis.heroSection.cta) {
    console.log(`CTA Button: "${analysis.heroSection.cta.text}"`);
    console.log(`  Text Color: ${analysis.heroSection.cta.color}`);
    console.log(`  BG Color: ${analysis.heroSection.cta.bgColor}`);
    console.log(`  BG Image: ${analysis.heroSection.cta.bgImage !== 'none' ? 'HAS GRADIENT' : 'none'}`);
  }
  console.log();

  // Feature Cards
  console.log('🎴 FEATURE CARDS');
  console.log('───────────────────────────────────────────────────────────');
  analysis.featureCards.slice(0, 5).forEach(card => {
    console.log(`Card #${card.index}: ${card.selector}`);
    if (card.heading) {
      console.log(`  Heading: "${card.heading.text}" (${card.heading.color})`);
    }
    if (card.text) {
      console.log(`  Text: "${card.text.content}" (${card.text.color})`);
    }
    console.log(`  BG: ${card.bgColor}`);
  });
  console.log();

  // CTA Buttons
  console.log('🔘 CTA BUTTONS');
  console.log('───────────────────────────────────────────────────────────');
  analysis.ctaButtons.forEach(btn => {
    console.log(`"${btn.text}" (${btn.position})`);
    console.log(`  Selector: ${btn.selector}`);
    console.log(`  Text: ${btn.color}`);
    console.log(`  BG: ${btn.bgColor}`);
    if (btn.bgImage !== 'none') {
      console.log(`  Gradient: YES`);
    }
  });
  console.log();

  // Gradients
  console.log('🌈 GRADIENTS FOUND');
  console.log('───────────────────────────────────────────────────────────');
  const uniqueGradients = [...new Set(analysis.gradients.map(g => g.selector))];
  uniqueGradients.slice(0, 10).forEach(selector => {
    console.log(`  ${selector}`);
  });
  console.log();

  // Contrast Issues
  console.log('⚠️  CONTRAST ISSUES');
  console.log('───────────────────────────────────────────────────────────');
  if (analysis.contrastIssues.length === 0) {
    console.log('✅ No major contrast issues found!');
  } else {
    analysis.contrastIssues.forEach(issue => {
      console.log(`❌ ${issue.element}`);
      console.log(`   Selector: ${issue.selector}`);
      console.log(`   Text: ${issue.textColor}`);
      console.log(`   BG: ${issue.bgColor}`);
      console.log(`   Contrast: ${issue.contrastRatio}:1 ${issue.wcagAA}`);
      console.log();
    });
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📁 Full analysis saved to: ${OUTPUT_DIR}/analysis.json`);
  console.log(`📸 Screenshots saved to: ${OUTPUT_DIR}/`);
  console.log('═══════════════════════════════════════════════════════════\n');

  await browser.close();
}

analyzeHomepage().catch(console.error);
