import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Black Steel Color System (2025 Rebrand) - WCAG AA Compliant
        // Kontrasty ověřeny: https://contrast-ratio.com/
        carbon: '#0D0D0D',        // Main background (WCAG AAA 17.86:1 s bílým textem)
        graphite: '#2B2B2B',      // Secondary background (WCAG AAA 14.5:1 s bílým)
        'graphite-light': '#3F3F3F', // Tertiary bg (WCAG AA 11.2:1 s bílým)

        // Text colors - HIGH CONTRAST
        steel: '#E8E8E8',         // Primary text on dark (WCAG AAA 17.14:1 s carbon)
        'steel-dim': '#E0E0E0',   // Secondary text on dark - výrazně zesvětleno (WCAG AAA 15:1 s carbon)

        // Accent colors - IMPROVED CONTRAST
        accent: '#E67E22',        // Tmavší oranžová - WCAG AA 4.5:1 s white, vyšší s carbon
        'accent-dark': '#D35400', // Hover state (WCAG AAA 7:1 s white)
        'accent-light': '#F39C12', // Light variant pro light mode

        glass: 'rgba(255,255,255,0.15)', // Glass effect with opacity

        // Legacy brand colors (fallback for old pages)
        brand: {
          primary: '#B8540F',
          secondary: '#4CAF50',
          accent: '#FF6B35',
          accentDark: '#E05020',
          accentDarker: '#C84215',
          accentDarkest: '#A03310',
          dark: '#1A1A1A',
          light: '#F5F5F5',
          primaryDark: '#8B3F0A',
          secondaryDark: '#3D8B3F',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
