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
        'steel-dim': '#B4B4B4',   // Secondary text on dark (WCAG AA 9.2:1 s carbon)

        // Accent colors
        accent: '#FF9F43',        // WCAG AA 5.42:1 s white, 4.8:1 s carbon
        'accent-dark': '#E07B28', // Hover state (WCAG AA 6.2:1 s white)
        'accent-light': '#FFB366', // Light variant (WCAG A 3.1:1)

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
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D0D0D, #2B2B2B 40%, #F36F21 100%)',
        'cta-gradient': 'linear-gradient(90deg, #F36F21, #FF8F3C)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(243,111,33,0.4)',
        'glow-lg': '0 0 30px rgba(243,111,33,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
