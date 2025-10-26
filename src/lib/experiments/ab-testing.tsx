'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackCROEvent } from '@/lib/analytics/cro-events';

/**
 * A/B Testing Framework
 * Umožňuje snadné spouštění CRO experimentů s variant tracking
 */

interface Variant {
  name: string;
  weight: number; // Procento uživatelů pro tuto variantu (0-100)
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  enabled: boolean;
  startDate: Date;
  endDate?: Date;
}

interface ABTestContextType {
  currentVariant: (experimentId: string) => string | null;
  isVariant: (experimentId: string, variantName: string) => boolean;
  trackExperiment: (experimentId: string, conversions?: Record<string, any>) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

/**
 * useABTest Hook
 * Použijte v komponentách pro přístup k variant informacím
 */
export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest musí být používán uvnitř ABTestProvider');
  }
  return context;
};

/**
 * Vrací random variantu na základě váhy
 */
const selectVariant = (variants: Variant[]): string => {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const variant of variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant.name;
    }
  }

  return variants[0].name;
};

/**
 * AB Test Provider
 */
export function ABTestProvider({
  experiments,
  children,
}: {
  experiments: Experiment[];
  children: React.ReactNode;
}) {
  const [userVariants, setUserVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    // Načíst varianty z localStorage (pro persistent bucketing)
    const stored = localStorage.getItem('ab_test_variants');
    if (stored) {
      setUserVariants(JSON.parse(stored));
    } else {
      // Nový uživatel - vybrat varianty
      const newVariants: Record<string, string> = {};
      for (const experiment of experiments) {
        if (experiment.enabled) {
          const variant = selectVariant(experiment.variants);
          newVariants[experiment.id] = variant;

          // Track experiment assignment
          trackCROEvent({
            name: 'experiment_assigned',
            category: 'ab_test',
            label: `${experiment.id}_${variant}`,
          });
        }
      }
      setUserVariants(newVariants);
      localStorage.setItem('ab_test_variants', JSON.stringify(newVariants));
    }
  }, [experiments]);

  const contextValue: ABTestContextType = {
    currentVariant: (experimentId: string) => userVariants[experimentId] || null,

    isVariant: (experimentId: string, variantName: string) =>
      userVariants[experimentId] === variantName,

    trackExperiment: (experimentId: string, conversions?: Record<string, any>) => {
      const variant = userVariants[experimentId];
      if (variant) {
        trackCROEvent({
          name: 'experiment_conversion',
          category: 'ab_test',
          label: `${experimentId}_${variant}`,
          value: conversions?.value,
        });
      }
    },
  };

  return (
    <ABTestContext.Provider value={contextValue}>
      {children}
    </ABTestContext.Provider>
  );
}

/**
 * Conditional Component - Renderuje obsah jen pro konkrétní variantu
 */
export function Variant({
  experimentId,
  name,
  children,
}: {
  experimentId: string;
  name: string;
  children: React.ReactNode;
}) {
  const { isVariant } = useABTest();
  return isVariant(experimentId, name) ? <>{children}</> : null;
}

/**
 * Predefined Experiments
 */
export const experiments: Experiment[] = [
  {
    id: 'hero_cta_text',
    name: 'Hero CTA Text Variation',
    description: 'Test různých copy textů na hero CTA tlačítku',
    variants: [
      { name: 'control', weight: 50 },    // "Nezávazná poptávka"
      { name: 'urgent', weight: 25 },     // "Zavolej nám hned"
      { name: 'benefit', weight: 25 },    // "Spočítej si úsporu"
    ],
    enabled: true,
    startDate: new Date(),
  },
  {
    id: 'form_length',
    name: 'Form Length Test',
    description: 'Test 3-step vs single-page formu',
    variants: [
      { name: 'short', weight: 50 },      // Single page
      { name: 'progressive', weight: 50 }, // 3 steps
    ],
    enabled: true,
    startDate: new Date(),
  },
  {
    id: 'lead_magnet_position',
    name: 'Lead Magnet Position',
    description: 'Test umístění kalkulátoru na stránce',
    variants: [
      { name: 'middle', weight: 50 },     // Uprostřed (aktuální)
      { name: 'top', weight: 50 },        // Hned po features
    ],
    enabled: false,
    startDate: new Date(),
  },
  {
    id: 'price_anchor',
    name: 'Price Anchor Test',
    description: 'Test zobrazování cen v různých formátech',
    variants: [
      { name: 'range', weight: 50 },      // Rozsah cen
      { name: 'starting', weight: 50 },   // "Od X Kč"
    ],
    enabled: false,
    startDate: new Date(),
  },
];

/**
 * Experiment Results Mock
 * V budoucnu bude čteno z analytics backendu
 */
export const mockResults = {
  hero_cta_text: {
    control: { clicks: 150, conversions: 25, rate: 0.167 },
    urgent: { clicks: 180, conversions: 36, rate: 0.2 },
    benefit: { clicks: 200, conversions: 48, rate: 0.24 },
  },
  form_length: {
    short: { submissions: 100, completions: 45, rate: 0.45 },
    progressive: { submissions: 150, completions: 75, rate: 0.5 },
  },
};
