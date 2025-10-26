// WCAG Contrast Ratio Calculator
// Analyzes all color combinations used in the homepage

const colors = {
  // Brand colors
  'brand-primary': '#B8540F',
  'brand-primaryDark': '#8B3F0A',
  'brand-secondary': '#4CAF50',
  'brand-secondaryDark': '#3D8B3F',
  'brand-accent': '#FF6B35',
  'brand-accentDark': '#E05020',
  'brand-dark': '#1A1A1A',
  'brand-light': '#F5F5F5',

  // Neutral colors
  'white': '#FFFFFF',
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
  'gray-200': '#E5E7EB',
  'gray-300': '#D1D5DB',
  'gray-400': '#9CA3AF',
  'gray-500': '#6B7280',
  'gray-600': '#4B5563',
  'gray-700': '#374151',
  'gray-800': '#1F2937',
  'gray-900': '#111827',
  'black': '#000000',

  // Additional colors
  'amber-700': '#B45309',
  'green-500': '#22C55E',
  'green-600': '#16A34A',
  'orange-500': '#F97316',
  'orange-600': '#EA580C',
  'purple-600': '#9333EA',
  'pink-600': '#DB2777',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getLuminance(r, g, b) {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function evaluateContrast(ratio) {
  if (ratio >= 7) return { level: 'AAA', status: '✅ PASS AAA', color: '\x1b[32m' };
  if (ratio >= 4.5) return { level: 'AA', status: '✅ PASS AA', color: '\x1b[33m' };
  if (ratio >= 3) return { level: 'FAIL', status: '⚠️  FAIL (Low)', color: '\x1b[31m' };
  return { level: 'FAIL', status: '❌ FAIL (Critical)', color: '\x1b[31m' };
}

// Define color combinations used in the homepage
const combinations = [
  // Hero Section
  { name: 'Hero Heading (gradient on white)', fg: 'brand-primary', bg: 'white', element: 'HeroSection h1 (gradient text)' },
  { name: 'Hero Subtitle', fg: 'gray-900', bg: 'white', element: 'HeroSection h1 "pro váš domov"' },
  { name: 'Hero Paragraph', fg: 'gray-700', bg: 'white', element: 'HeroSection p description' },
  { name: 'Hero Badge', fg: 'white', bg: 'brand-accentDark', element: 'HeroSection badge (18+ LET)' },
  { name: 'Hero CTA Primary', fg: 'white', bg: 'brand-accentDark', element: 'HeroSection "Nezávazná poptávka"' },
  { name: 'Hero CTA Secondary', fg: 'brand-primary', bg: 'white', element: 'HeroSection "Naše produkty"' },
  { name: 'Hero Trust Badges', fg: 'gray-700', bg: 'white', element: 'HeroSection trust indicators' },

  // Feature Grid
  { name: 'Feature Card Title', fg: 'gray-900', bg: 'white', element: 'FeatureGrid card title' },
  { name: 'Feature Card Description', fg: 'gray-600', bg: 'white', element: 'FeatureGrid card description' },

  // Stats Section
  { name: 'Stats Number (gradient)', fg: 'brand-primary', bg: 'white', element: 'StatsSection number (gradient text)' },
  { name: 'Stats Label', fg: 'gray-700', bg: 'white', element: 'StatsSection label' },

  // Common elements
  { name: 'Body Text', fg: 'gray-600', bg: 'white', element: 'General body text' },
  { name: 'Heading Text', fg: 'gray-900', bg: 'white', element: 'General headings' },
  { name: 'Brand Text Primary', fg: 'brand-primary', bg: 'white', element: 'Brand colored text' },
  { name: 'Brand Text Secondary', fg: 'brand-secondary', bg: 'white', element: 'Secondary colored text' },
  { name: 'Brand Text Accent', fg: 'brand-accent', bg: 'white', element: 'Accent colored text' },

  // Buttons and CTAs
  { name: 'Primary Button', fg: 'white', bg: 'brand-accentDark', element: 'Primary CTA buttons' },
  { name: 'Secondary Button', fg: 'white', bg: 'brand-primary', element: 'Secondary buttons' },
  { name: 'Tertiary Button', fg: 'white', bg: 'brand-secondary', element: 'Tertiary buttons' },

  // Alternative backgrounds
  { name: 'Text on gray-50', fg: 'gray-900', bg: 'gray-50', element: 'Text on light gray background' },
  { name: 'Text on gray-100', fg: 'gray-700', bg: 'gray-100', element: 'Text on gray-100' },

  // Specific problematic combinations (identified visually)
  { name: 'Potential Issue: gray-500 on white', fg: 'gray-500', bg: 'white', element: 'Light gray text (may be too light)' },
  { name: 'Potential Issue: gray-400 on white', fg: 'gray-400', bg: 'white', element: 'Very light gray text' },
];

console.log('\x1b[1m\x1b[36m╔═══════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[1m\x1b[36m║         WCAG CONTRAST RATIO ANALYSIS REPORT             ║\x1b[0m');
console.log('\x1b[1m\x1b[36m║              AC Heating Homepage Colors                  ║\x1b[0m');
console.log('\x1b[1m\x1b[36m╚═══════════════════════════════════════════════════════════╝\x1b[0m\n');

console.log('WCAG Requirements:');
console.log('  • AAA: 7:1 or higher (Best)');
console.log('  • AA:  4.5:1 or higher (Good - minimum for body text)');
console.log('  • Fail: Below 4.5:1 (Needs fixing)\n');

console.log('═══════════════════════════════════════════════════════════\n');

const issues = [];
const warnings = [];
const passes = [];

combinations.forEach(combo => {
  const fgColor = colors[combo.fg];
  const bgColor = colors[combo.bg];

  if (!fgColor || !bgColor) {
    console.log(`⚠️  Warning: Color not found: ${combo.fg} or ${combo.bg}`);
    return;
  }

  const ratio = getContrastRatio(fgColor, bgColor);
  const evaluation = evaluateContrast(ratio);

  const result = {
    ...combo,
    fgColor,
    bgColor,
    ratio: ratio.toFixed(2),
    evaluation,
  };

  if (evaluation.level === 'FAIL') {
    issues.push(result);
  } else if (evaluation.level === 'AA') {
    warnings.push(result);
  } else {
    passes.push(result);
  }

  console.log(`${evaluation.color}${evaluation.status}\x1b[0m  ${ratio.toFixed(2)}:1`);
  console.log(`   ${combo.name}`);
  console.log(`   Element: ${combo.element}`);
  console.log(`   Colors: ${combo.fg} (${fgColor}) on ${combo.bg} (${bgColor})`);
  console.log();
});

// Summary
console.log('\n═══════════════════════════════════════════════════════════');
console.log('\x1b[1m📊 SUMMARY\x1b[0m\n');

console.log(`\x1b[32m✅ PASS AAA (7:1+):  ${passes.length} combinations\x1b[0m`);
console.log(`\x1b[33m✅ PASS AA (4.5:1+): ${warnings.length} combinations\x1b[0m`);
console.log(`\x1b[31m❌ FAIL (<4.5:1):    ${issues.length} combinations\x1b[0m\n`);

if (issues.length > 0) {
  console.log('\x1b[1m\x1b[31m🚨 CRITICAL ISSUES - FIX IMMEDIATELY:\x1b[0m\n');
  issues.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.name}`);
    console.log(`   Contrast: ${issue.ratio}:1 ${issue.evaluation.status}`);
    console.log(`   Element: ${issue.element}`);
    console.log(`   Current: ${issue.fg} (${issue.fgColor}) on ${issue.bg} (${issue.bgColor})`);

    // Suggest fix
    if (issue.ratio < 3) {
      console.log(`   \x1b[33m💡 Recommendation: Use much darker text (try gray-800 or gray-900)\x1b[0m`);
    } else if (issue.ratio < 4.5) {
      console.log(`   \x1b[33m💡 Recommendation: Use darker text (try gray-700 or gray-800)\x1b[0m`);
    }
    console.log();
  });
}

if (warnings.length > 0) {
  console.log('\x1b[1m\x1b[33m⚠️  PASSES AA BUT NOT AAA (consider improving):\x1b[0m\n');
  warnings.slice(0, 5).forEach((warning, idx) => {
    console.log(`${idx + 1}. ${warning.name}: ${warning.ratio}:1`);
    console.log(`   Element: ${warning.element}`);
  });
  console.log();
}

console.log('═══════════════════════════════════════════════════════════\n');

// Specific recommendations for gradients
console.log('\x1b[1m🌈 GRADIENT ELEMENTS (Manual Review Needed):\x1b[0m\n');
console.log('Gradients cannot be automatically tested. Please manually verify:');
console.log('  1. Hero heading gradient (brand-primary → accent → secondary)');
console.log('     - Check if text is readable against white background');
console.log('     - Gradient may cause parts of text to have low contrast');
console.log('  2. Stats numbers gradient (various brand colors)');
console.log('     - Verify gradient text is readable');
console.log('  3. CTA button gradients (brand-accentDark gradient)');
console.log('     - Ensure white text is readable across entire gradient\n');

console.log('═══════════════════════════════════════════════════════════\n');

// Export results as JSON
import fs from 'fs';
fs.writeFileSync('/tmp/contrast-analysis.json', JSON.stringify({
  passes,
  warnings,
  issues,
  summary: {
    total: combinations.length,
    passAAA: passes.length,
    passAA: warnings.length,
    fail: issues.length,
  }
}, null, 2));

console.log('📁 Detailed results saved to: /tmp/contrast-analysis.json\n');
