// VLOOP Phase 23 - Global Identity & Localization Layer Mock Data

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  languages: string[];
  timezone: string;
  region: string;
  available: boolean;
  comingSoon?: boolean;
}

export interface RegionInfo {
  id: string;
  title: string;
  description: string;
  status: 'available' | 'coming_soon' | 'future';
  icon: string;
}

export interface LocalService {
  id: string;
  name: string;
  description: string;
  available: boolean;
  icon: string;
}

export const COUNTRIES: Country[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
    timezone: 'Asia/Kolkata',
    region: 'Karnataka',
    available: true,
  },
  {
    code: 'AE',
    name: 'UAE',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    languages: ['English', 'Arabic'],
    timezone: 'Asia/Dubai',
    region: 'Dubai',
    available: true,
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'SAR',
    languages: ['English', 'Arabic'],
    timezone: 'Asia/Riyadh',
    region: 'Riyadh',
    available: true,
  },
  {
    code: 'QA',
    name: 'Qatar',
    flag: '🇶🇦',
    currency: 'QAR',
    currencySymbol: 'QAR',
    languages: ['English', 'Arabic'],
    timezone: 'Asia/Qatar',
    region: 'Doha',
    available: true,
  },
  {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    currency: 'OMR',
    currencySymbol: 'OMR',
    languages: ['English', 'Arabic'],
    timezone: 'Asia/Muscat',
    region: 'Muscat',
    available: true,
  },
  {
    code: 'KW',
    name: 'Kuwait',
    flag: '🇰🇼',
    currency: 'KWD',
    currencySymbol: 'KWD',
    languages: ['English', 'Arabic'],
    timezone: 'Asia/Kuwait',
    region: 'Kuwait City',
    available: true,
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    languages: ['English', 'Chinese', 'Malay', 'Tamil'],
    timezone: 'Asia/Singapore',
    region: 'Singapore',
    available: true,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    languages: ['English'],
    timezone: 'Europe/London',
    region: 'London',
    available: false,
    comingSoon: true,
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    languages: ['English', 'Spanish'],
    timezone: 'America/New_York',
    region: 'New York',
    available: false,
    comingSoon: true,
  },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', available: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', available: true },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', available: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', available: true },
  { code: 'ar', name: 'Arabic', native: 'العربية', available: true },
];

export const FUTURE_LANGUAGES = [
  { code: 'zh', name: 'Chinese', native: '中文', available: false },
  { code: 'es', name: 'Spanish', native: 'Español', available: false },
  { code: 'fr', name: 'French', native: 'Français', available: false },
  { code: 'de', name: 'German', native: 'Deutsch', available: false },
];

export const REGIONAL_SERVICES: LocalService[] = [
  { id: '1', name: 'Local Marketplace', description: 'Shop regional products', available: true, icon: 'ShoppingBag' },
  { id: '2', name: 'Local Services', description: 'Trusted nearby services', available: true, icon: 'Wrench' },
  { id: '3', name: 'Partner Stores', description: 'Verified local partners', available: true, icon: 'Store' },
  { id: '4', name: 'Community Activities', description: 'Local events & support', available: true, icon: 'Users' },
  { id: '5', name: 'Care Club', description: 'Community care network', available: true, icon: 'Heart' },
  { id: '6', name: 'Weekly Challenge', description: 'Regional challenges', available: true, icon: 'Trophy' },
];

export const REGION_INFO: RegionInfo[] = [
  { id: '1', title: 'Available Services', description: 'Marketplace, SmartCode, Care Club, Wallet, and more', status: 'available', icon: 'CheckCircle' },
  { id: '2', title: 'Coming Soon', description: 'Digital Academy, Business Loans, Investment Products', status: 'coming_soon', icon: 'Clock' },
  { id: '3', title: 'Future Expansion', description: 'Insurance, Healthcare, Education Partnerships', status: 'future', icon: 'Globe' },
  { id: '4', title: 'Regional Features', description: 'Local language support, Regional payment methods', status: 'available', icon: 'MapPin' },
];

export const ACCESSIBILITY_OPTIONS = [
  { id: 'font-size', name: 'Font Size', options: ['Small', 'Medium', 'Large', 'Extra Large'], default: 'Medium' },
  { id: 'high-contrast', name: 'High Contrast', options: ['Off', 'On'], default: 'Off' },
  { id: 'reduced-motion', name: 'Reduced Motion', options: ['Off', 'On'], default: 'Off' },
  { id: 'language', name: 'Language', options: ['English', 'Malayalam', 'Hindi', 'Tamil', 'Arabic'], default: 'English' },
  { id: 'theme', name: 'Theme', options: ['Light', 'Dark', 'System'], default: 'System' },
];

export const COMPLIANCE_NOTICE = {
  title: 'Global Compliance Notice',
  message: 'Some VLOOP services may vary by country due to local regulations, partnerships, and future rollout schedules.',
};

export const MOCK_LOCAL_TIME = {
  'Asia/Kolkata': () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }),
  'Asia/Dubai': () => new Date().toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dubai' }),
  'Asia/Riyadh': () => new Date().toLocaleTimeString('en-SA', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Riyadh' }),
  'Asia/Qatar': () => new Date().toLocaleTimeString('en-QA', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Qatar' }),
  'Asia/Muscat': () => new Date().toLocaleTimeString('en-OM', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Muscat' }),
  'Asia/Kuwait': () => new Date().toLocaleTimeString('en-KW', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuwait' }),
  'Asia/Singapore': () => new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Singapore' }),
  'Europe/London': () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }),
  'America/New_York': () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' }),
};

export function getMockWeeklyCountdown(): { days: number; hours: number; minutes: number } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(20, 0, 0, 0);

  if (nextSunday <= now) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }

  const diff = nextSunday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

export function getCurrencyExample(country: Country): { amount: number; formatted: string } {
  const examples: Record<string, number> = {
    INR: 1500,
    AED: 65,
    SAR: 65,
    QAR: 65,
    OMR: 7,
    KWD: 5,
    SGD: 25,
    GBP: 15,
    USD: 20,
  };

  const amount = examples[country.currency] || 100;
  const formatted = `${country.currencySymbol}${amount.toLocaleString()}`;

  return { amount, formatted };
}
