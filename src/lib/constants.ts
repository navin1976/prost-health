// Brand Constants
export const SITE_TITLE = 'Prost Health';
export const SITE_DESCRIPTION =
  'The definitive approach to prostate health. MRI-first screening for clarity, not chance.';
export const SITE_URL = 'https://prost.health'; // Update with actual domain

// Brand Messaging
export const TAGLINE = 'Clarity, Not Chance.';
export const PRIMARY_MESSAGE = 'The smarter, safer path to prostate health.';
export const SECONDARY_MESSAGE =
  'Our MRI-first approach, guided by leading experts and NICE recommendations, provides definitive clarity while helping you avoid unnecessary biopsies.';

// NICE Guidelines
export const NICE_GUIDELINE_URL = 'https://www.nice.org.uk/guidance/ng131';
export const NICE_GUIDELINE_NAME = 'NICE Guideline NG131';

// Trust Signals
export const TRUST_SIGNALS = [
  'Recommended by NICE Guidelines',
  'Interpreted by Leading Uroradiologists',
  '96% Confidence in Negative Scans',
] as const;

// PI-RADS Scoring
export const PIRADS_SCORES = {
  1: {
    level: 'Very Low',
    description: 'Clinically significant cancer is highly unlikely',
    action: 'Biopsy typically not needed',
  },
  2: {
    level: 'Low',
    description: 'Clinically significant cancer is unlikely',
    action: 'Biopsy typically not needed',
  },
  3: {
    level: 'Intermediate',
    description: 'Presence of clinically significant cancer is equivocal',
    action: 'Discuss risks and benefits of biopsy with specialist',
  },
  4: {
    level: 'High',
    description: 'Clinically significant cancer is likely',
    action: 'MRI-guided biopsy recommended',
  },
  5: {
    level: 'Very High',
    description: 'Clinically significant cancer is highly likely',
    action: 'MRI-guided biopsy recommended',
  },
} as const;

// Contact Information
export const CONTACT_EMAIL = 'hello@prost.health'; // Update with actual
export const CONTACT_PHONE = '+44 (0)20 XXXX XXXX'; // Update with actual

// Social Links
export const SOCIAL_LINKS = {
  // linkedin: 'https://linkedin.com/company/prost-health',
  // twitter: 'https://twitter.com/prosthealth',
} as const;

// Content Categories
export const INSIGHT_CATEGORIES = [
  'Understanding the Diagnosis',
  'Navigating the Pathway',
  'Living with Uncertainty',
  'Health & Lifestyle',
] as const;

// Navigation
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'The Science', href: '/the-science' },
  { label: 'Our Experts', href: '/our-experts' },
  { label: 'Request Screening', href: '/request-screening' },
  { label: 'FAQ', href: '/faq' },
] as const;

// External Resources
export const EXTERNAL_RESOURCES = [
  {
    name: 'Prostate Cancer UK',
    url: 'https://prostatecanceruk.org',
    description: 'Support, information, and community for men with prostate cancer',
  },
  {
    name: 'Macmillan Cancer Support',
    url: 'https://www.macmillan.org.uk/cancer-information-and-support/prostate-cancer',
    description: 'Practical and emotional support for cancer patients and families',
  },
  {
    name: 'Cancer Research UK',
    url: 'https://www.cancerresearchuk.org/about-cancer/prostate-cancer',
    description: 'Evidence-based information about prostate cancer',
  },
] as const;
