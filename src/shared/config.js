// Shared configuration: storage keys, business rules, contacts and external URLs.
// Every value marked PLACEHOLDER must be verified/replaced before production.

// ---------- Storage keys ----------
export const TOKEN_KEY = 'sadaka_token';
export const LANG_KEY = 'sadaka_lang';

// ---------- Languages ----------
export const LANGS = ['ru', 'ky'];
export const DEFAULT_LANG = 'ru';

// ---------- Business rules ----------
export const HELP_LIMIT = 5; // max helps per family per calendar month
export const CURRENCY = 'KGS';
export const DONATION_PRESETS = [100, 500, 1000];
export const MIN_DONATION = 10;
export const MAX_DONATION = 1000000;
export const PARCEL_WEIGHT = { min: 0.5, max: 30, step: 0.5, initial: 3 };
// Need categories for which the donor is asked for a clothing size.
export const SIZE_RELEVANT_CATEGORIES = ['clothes'];

// ---------- Mock API ----------
export const MOCK_LATENCY_MS = 350;

// ---------- Contacts and socials (PLACEHOLDER values) ----------
export const CONTACTS = {
  email: 'hello@sadaka.kg',
  phone: '+996 555 010 203',
  phoneHref: 'tel:+996555010203',
};

export const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/sadaka.kg' },
  { id: 'telegram', label: 'Telegram', url: 'https://t.me/sadaka_kg' },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/996555010203' },
];

// ---------- External apps for the goods flow (PLACEHOLDER URLs) ----------
// deepLink opens the native app when installed; webUrl is the fallback.
// Verify the URL schemes with each provider before production.
export const DELIVERY_PROVIDERS = {
  glovo: { id: 'glovo', name: 'Glovo', deepLink: 'glovo://', webUrl: 'https://glovoapp.com/' },
  yandex: { id: 'yandex', name: 'Yandex Delivery', deepLink: 'yandextaxi://', webUrl: 'https://go.yandex/' },
};

// Stores for the "store first, then delivery" flow (PLACEHOLDER: replace with real store links).
export const STORES = {
  globus: { id: 'globus', name: 'Globus', deepLink: null, webUrl: 'https://example.com/globus' },
  narodny: { id: 'narodny', name: 'Narodny', deepLink: null, webUrl: 'https://example.com/narodny' },
};

// ---------- About page ----------
// Canva short links (canva.link) often refuse to be framed. If the iframe stays empty,
// replace embedUrl with the public embed link, e.g. https://www.canva.com/design/<ID>/view?embed
export const PROJECT_PRESENTATION = {
  url: 'https://canva.link/46ahljq1c8q0xy1',
  embedUrl: 'https://canva.link/46ahljq1c8q0xy1',
};

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop',
  mountains: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop',
};