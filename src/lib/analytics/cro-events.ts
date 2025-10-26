/**
 * CRO Events Tracking
 * Spravuje sledování CRO-relevantních events v Google Analytics
 */

export interface CROEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Track GA4 events
 */
export const trackCROEvent = (event: CROEvent) => {
  if (typeof window === 'undefined') return;

  const { gtag } = window as any;
  if (!gtag) return;

  gtag('event', event.name, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
  });
};

/**
 * Lead Magnet Events
 */
export const leadMagnetEvents = {
  // Calculator interactions
  calculatorStart: () =>
    trackCROEvent({
      name: 'calculator_start',
      category: 'lead_magnet',
      label: 'calculator',
    }),
  calculatorComplete: (estimatedSavings: number) =>
    trackCROEvent({
      name: 'calculator_complete',
      category: 'lead_magnet',
      label: 'calculator',
      value: estimatedSavings,
    }),

  // Whitepaper downloads
  whitePaperDownload: (title: string) =>
    trackCROEvent({
      name: 'download',
      category: 'lead_magnet',
      label: `whitepaper_${title}`,
    }),

  // Checklist interactions
  checklistStart: () =>
    trackCROEvent({
      name: 'checklist_start',
      category: 'lead_magnet',
      label: 'checklist',
    }),
};

/**
 * Form Events
 */
export const formEvents = {
  formStart: (formName: string) =>
    trackCROEvent({
      name: 'form_start',
      category: 'form',
      label: formName,
    }),

  formStepComplete: (formName: string, step: number) =>
    trackCROEvent({
      name: 'form_step_complete',
      category: 'form',
      label: `${formName}_step_${step}`,
      value: step,
    }),

  formComplete: (formName: string) =>
    trackCROEvent({
      name: 'form_submit',
      category: 'form',
      label: formName,
    }),

  formError: (formName: string, fieldName: string) =>
    trackCROEvent({
      name: 'form_error',
      category: 'form',
      label: `${formName}_${fieldName}`,
    }),
};

/**
 * CTA Click Events
 */
export const ctaEvents = {
  ctaClick: (ctaText: string, location: string) =>
    trackCROEvent({
      name: 'cta_click',
      category: 'cta',
      label: `${ctaText}_${location}`,
    }),

  heroCTAClick: (variant: string) =>
    trackCROEvent({
      name: 'hero_cta_click',
      category: 'cta',
      label: `hero_${variant}`,
    }),

  phoneClick: (location: string) =>
    trackCROEvent({
      name: 'phone_click',
      category: 'cta',
      label: `phone_${location}`,
    }),
};

/**
 * Objection Handler Events
 */
export const objectionEvents = {
  questionOpen: (question: string) =>
    trackCROEvent({
      name: 'question_open',
      category: 'objection_handler',
      label: question,
    }),

  questionClose: (question: string) =>
    trackCROEvent({
      name: 'question_close',
      category: 'objection_handler',
      label: question,
    }),
};

/**
 * Social Proof Events
 */
export const socialProofEvents = {
  testimonialView: (author: string) =>
    trackCROEvent({
      name: 'testimonial_view',
      category: 'social_proof',
      label: author,
    }),

  trustBadgeView: (badgeType: string) =>
    trackCROEvent({
      name: 'trust_badge_view',
      category: 'social_proof',
      label: badgeType,
    }),
};

/**
 * Engagement Events
 */
export const engagementEvents = {
  scrollDepth: (depth: number) =>
    trackCROEvent({
      name: 'scroll_depth',
      category: 'engagement',
      label: `${depth}%`,
      value: depth,
    }),

  timeOnPage: (seconds: number) =>
    trackCROEvent({
      name: 'time_on_page',
      category: 'engagement',
      value: seconds,
    }),

  internalLink: (href: string) =>
    trackCROEvent({
      name: 'internal_link_click',
      category: 'engagement',
      label: href,
    }),

  externalLink: (href: string) =>
    trackCROEvent({
      name: 'external_link_click',
      category: 'engagement',
      label: href,
    }),
};

/**
 * Conversion Events
 */
export const conversionEvents = {
  lead: (source: string) =>
    trackCROEvent({
      name: 'lead',
      category: 'conversion',
      label: source,
    }),

  quote: (value: number) =>
    trackCROEvent({
      name: 'quote_request',
      category: 'conversion',
      label: 'quote_form',
      value: Math.round(value),
    }),

  phoneCall: (duration: number) =>
    trackCROEvent({
      name: 'phone_call',
      category: 'conversion',
      label: 'incoming_call',
      value: Math.round(duration),
    }),
};
