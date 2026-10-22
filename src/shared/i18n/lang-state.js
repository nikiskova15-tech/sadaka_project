// Leaf module that owns the current UI language.
// It has no React or app imports, so both the Axios client and the Zustand store can use it.
import { LANG_KEY, LANGS, DEFAULT_LANG } from '../config.js';

function readInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // localStorage can be unavailable (private mode); fall back to the default.
  }
  return DEFAULT_LANG;
}

let current = readInitialLang();
const listeners = new Set();

/** Keeps <html lang="..."> in sync with the active language. */
export function applyHtmlLang(lang = current) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}

export function getLang() {
  return current;
}

/** Changes the language, persists it, updates <html lang> and notifies subscribers. */
export function setLangValue(lang) {
  if (!LANGS.includes(lang) || lang === current) return;
  current = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Ignore storage failures: the language still changes for this session.
  }
  applyHtmlLang(lang);
  listeners.forEach((fn) => fn(lang));
}

/** Subscribes to language changes. Returns an unsubscribe function. */
export function subscribeLang(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

applyHtmlLang();