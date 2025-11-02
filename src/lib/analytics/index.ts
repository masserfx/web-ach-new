/**
 * Analytics Library for AC Heating
 * Tracks user behavior for data-driven insights
 */

// Event types
export type AnalyticsEvent = 
  | 'page_view'
  | 'calculator_started'
  | 'calculator_completed'
  | 'calculator_results_viewed'
  | 'chatbot_opened'
  | 'chatbot_message_sent'
  | 'chatbot_cta_clicked'
  | 'lead_form_started'
  | 'lead_form_step_completed'
  | 'lead_form_submitted'
  | 'lead_form_abandoned'
  | 'product_viewed'
  | 'product_cta_clicked'
  | 'blog_post_read'
  | 'download_started'
  | 'email_link_clicked'
  | 'phone_link_clicked';

interface BaseEventData {
  timestamp: number;
  session_id?: string;
  user_id?: string;
  page_url: string;
  page_title: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
}

interface CalculatorEventData extends BaseEventData {
  property_type?: string;
  property_size?: number;
  current_heating?: string;
  budget_range?: string;
  has_solar?: boolean;
  estimated_savings?: number;
  roi_years?: number;
}

interface ChatbotEventData extends BaseEventData {
  message_text?: string;
  message_intent?: string;
  response_time?: number;
  suggested_actions?: string[];
}

interface LeadEventData extends BaseEventData {
  lead_id?: string;
  lead_source: string;
  lead_type?: string;
  property_type?: string;
  urgency?: string;
  form_step?: number;
  abandoned_at_step?: number;
}

interface ProductEventData extends BaseEventData {
  product_id?: string;
  product_slug: string;
  product_name: string;
  product_category?: string;
  product_price?: number;
  cta_type?: 'quote_request' | 'callback' | 'calculator' | 'contact';
}

type EventData = 
  | CalculatorEventData 
  | ChatbotEventData 
  | LeadEventData 
  | ProductEventData
  | BaseEventData;

/**
 * Main analytics tracking function
 */
export async function trackEvent(
  eventName: AnalyticsEvent,
  eventData: Partial<EventData> = {}
): Promise<void> {
  try {
    // Enrich with session data
    const enrichedData = {
      ...eventData,
      timestamp: Date.now(),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      session_id: getSessionId(),
      device_type: getDeviceType(),
      ...extractUTMParams(),
    };

    // Send to multiple destinations
    await Promise.allSettled([
      sendToSupabase(eventName, enrichedData),
      sendToGA4(eventName, enrichedData),
      sendToConsole(eventName, enrichedData), // Development only
    ]);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Send event to Supabase for storage and analysis
 */
async function sendToSupabase(
  eventName: AnalyticsEvent,
  eventData: any
): Promise<void> {
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_data: eventData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Supabase tracking failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Supabase tracking error:', error);
  }
}

/**
 * Send event to Google Analytics 4
 */
async function sendToGA4(
  eventName: AnalyticsEvent,
  eventData: any
): Promise<void> {
  if (typeof window === 'undefined' || !(window as any).gtag) {
    return;
  }

  try {
    (window as any).gtag('event', eventName, {
      ...eventData,
      send_to: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    });
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
}

/**
 * Development console logging
 */
function sendToConsole(eventName: AnalyticsEvent, eventData: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, eventData);
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('ac_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ac_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Detect device type
 */
function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Extract UTM parameters from URL
 */
function extractUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
} {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
}

/**
 * Track page view (call on route change)
 */
export function trackPageView(title?: string): void {
  trackEvent('page_view', {
    page_title: title || (typeof document !== 'undefined' ? document.title : ''),
  });
}

/**
 * Track calculator usage
 */
export function trackCalculatorStarted(): void {
  trackEvent('calculator_started');
}

export function trackCalculatorCompleted(data: {
  property_type: string;
  property_size: number;
  estimated_savings: number;
  roi_years: number;
}): void {
  trackEvent('calculator_completed', data);
}

/**
 * Track chatbot interaction
 */
export function trackChatbotOpened(): void {
  trackEvent('chatbot_opened');
}

export function trackChatbotMessage(message: string, intent?: string): void {
  trackEvent('chatbot_message_sent', {
    message_text: message,
    message_intent: intent,
  });
}

/**
 * Track lead form
 */
export function trackLeadFormStarted(source: string): void {
  trackEvent('lead_form_started', {
    lead_source: source,
  });
}

export function trackLeadFormStep(step: number): void {
  trackEvent('lead_form_step_completed', {
    lead_source: 'form',
    form_step: step,
  });
}

export function trackLeadFormSubmitted(leadId: string, data: {
  property_type?: string;
  urgency?: string;
  lead_source: string;
}): void {
  trackEvent('lead_form_submitted', {
    lead_id: leadId,
    ...data,
  });
}

export function trackLeadFormAbandoned(step: number): void {
  trackEvent('lead_form_abandoned', {
    lead_source: 'form',
    abandoned_at_step: step,
  });
}

/**
 * Track product interactions
 */
export function trackProductViewed(product: {
  slug: string;
  name: string;
  category?: string;
  price?: number;
}): void {
  trackEvent('product_viewed', {
    product_slug: product.slug,
    product_name: product.name,
    product_category: product.category,
    product_price: product.price,
  });
}

export function trackProductCTA(product: {
  slug: string;
  name: string;
}, ctaType: 'quote_request' | 'callback' | 'calculator' | 'contact'): void {
  trackEvent('product_cta_clicked', {
    product_slug: product.slug,
    product_name: product.name,
    cta_type: ctaType,
  });
}

/**
 * Track contact actions
 */
export function trackEmailClick(email: string): void {
  trackEvent('email_link_clicked');
}

export function trackPhoneClick(phone: string): void {
  trackEvent('phone_link_clicked');
}
