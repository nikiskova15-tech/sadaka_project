// Axios instance with JWT + language interceptors, plus small helpers shared by the mock routes.
import axios from 'axios';
import { TOKEN_KEY, HELP_LIMIT } from './config.js';
import { getLang } from './i18n/lang-state.js';

export { TOKEN_KEY, HELP_LIMIT };

export const api = axios.create({ baseURL: '/api' });

// Every request carries the JWT (when present) and the current UI language.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = getLang();
  return config;
});

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const okRes = (data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config: {} });

/** Throws an Axios-like error. The UI translates it by `code`; `message` is a technical fallback. */
export function fail(message, code, status = 400) {
  const err = new Error(message);
  err.response = { data: { message, code }, status };
  err.code = code;
  throw err;
}

/** Returns the logged-in user or throws 401. */
export function requireUser(req) {
  if (!req.user) fail('Login required', 'UNAUTHORIZED', 401);
  return req.user;
}

export function apiErrorCode(err) {
  return err?.response?.data?.code || err?.code || null;
}

/** Technical fallback message. User-facing text is looked up by apiErrorCode() in the UI. */
export function apiErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Unexpected error';
}

export function isHelpLimitError(err) {
  return apiErrorCode(err) === 'HELP_LIMIT';
}