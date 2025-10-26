/**
 * Centralized Site Configuration
 * Single source of truth for all site-wide constants
 */

export const siteConfig = {
  // Site Information
  name: 'AC Heating',
  title: 'AC Heating - Tepelná čerpadla, klimatizace a fotovoltaika',
  description: 'Profesionální instalace tepelných čerpadel, klimatizací a fotovoltaiky. Dotace až 130 000 Kč. 15+ let zkušeností.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100',

  // Contact Information
  contact: {
    email: 'info@ac-heating.cz',
    phone: '+420 725 539 825',
    phoneFormatted: '+420 725 539 825',
    phoneRaw: '+420725539825',
    address: {
      street: 'Staroplzenecká 177',
      city: 'Letkov',
      zip: '326 00',
      country: 'Česká republika',
      full: 'Staroplzenecká 177, 326 00 Letkov',
    },
    hours: {
      weekdays: 'Po-Pá: 8:00 - 17:00',
      weekend: 'So-Ne: Po domluvě',
    },
  },

  // Social Media
  social: {
    facebook: 'https://www.facebook.com/ac.heating.cz',
    linkedin: 'https://www.linkedin.com/company/ac-heating',
    instagram: 'https://www.instagram.com/ac.heating.cz',
    youtube: 'https://www.youtube.com/@ac-heating',
  },

  // Company Information
  company: {
    name: 'KUFI INT, s.r.o.',
    tradingAs: 'AC Heating',
    ico: '26410656',
    dic: 'CZ26410656',
    registeredAt: 'Krajský soud v Plzni',
    established: 2006,
  },

  // Services Coverage
  coverage: {
    regions: [
      'Praha',
      'Středočeský kraj',
      'Plzeňský kraj',
      'Jihočeský kraj',
      'Královéhradecký kraj',
      'Pardubický kraj',
      'Vysočina',
      'Jihomoravský kraj',
    ],
  },

  // SEO Defaults
  seo: {
    defaultTitle: 'AC Heating - Tepelná čerpadla, klimatizace a fotovoltaika',
    titleTemplate: '%s | AC Heating',
    defaultDescription: 'Profesionální instalace tepelných čerpadel, klimatizací a fotovoltaiky. Dotace až 130 000 Kč. 15+ let zkušeností.',
    keywords: [
      'tepelná čerpadla',
      'klimatizace',
      'fotovoltaika',
      'AC Heating',
      'dotace',
      'úspora energie',
    ],
  },

  // Features & Benefits
  features: {
    experienceYears: 18,
    warrantyYears: 7,
    maxSubsidy: 130000,
    installationsYearly: 1500,
    totalHomes: 7500,
    employees: 100,
    satisfactionRate: 98,
  },

  // Navigation
  nav: {
    main: [
      { name: 'Úvod', href: '/' },
      { name: 'O nás', href: '/o-nas' },
      { name: 'Produkty', href: '/produkty' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Kontakt', href: '/kontakt' },
    ],
    products: [
      { name: 'Tepelná čerpadla', href: '/produkty?kategorie=tepelna-cerpadla' },
      { name: 'Klimatizace', href: '/produkty?kategorie=klimatizace' },
      { name: 'Fotovoltaika', href: '/produkty?kategorie=fotovoltaika' },
    ],
    footer: {
      company: [
        { name: 'O společnosti', href: '/o-nas' },
        { name: 'Kariéra', href: '/kariera' },
        { name: 'Kontakt', href: '/kontakt' },
      ],
      services: [
        { name: 'Tepelná čerpadla', href: '/produkty?kategorie=tepelna-cerpadla' },
        { name: 'Klimatizace', href: '/produkty?kategorie=klimatizace' },
        { name: 'Fotovoltaika', href: '/produkty?kategorie=fotovoltaika' },
      ],
      support: [
        { name: 'FAQ', href: '/faq' },
        { name: 'Blog', href: '/blog' },
        { name: 'Připravit rozpočet', href: '/pripravit-rozpocet' },
      ],
      legal: [
        { name: 'Ochrana osobních údajů', href: '/privacy' },
        { name: 'Obchodní podmínky', href: '/terms' },
      ],
    },
  },

  // API Endpoints
  api: {
    quote: '/api/quote',
    contact: '/api/contact',
    newsletter: '/api/newsletter',
  },

  // Pagination & Limits
  pagination: {
    blogPostsPerPage: 12,
    productsPerPage: 12,
    recentPostsCount: 6,
    relatedPostsCount: 3,
  },
} as const;

export type SiteConfig = typeof siteConfig;
