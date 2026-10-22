// Axios instance with JWT interceptors + mock adapter wiring.
import axios from 'axios';
import { db, HELP_LIMIT, tokenFor, userFromAuth } from './mock-db.js';
import { scoreFamily, inAgeBucket } from './mock-search.js';

export const TOKEN_KEY = 'sadaka_token';
const LATENCY = 350;
const clone = (v) => JSON.parse(JSON.stringify(v));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const okRes = (data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config: {} });

function fail(message, code, status = 400) {
  const err = new Error(message);
  err.response = { data: { message, code }, status };
  err.code = code;
  throw err;
}

async function handle(config) {
  await wait(LATENCY);
  const method = (config.method || 'get').toLowerCase();
  const url = new URL(config.url, 'http://mock');
  const path = url.pathname;
  const params = { ...(config.params || {}) };
  let body = config.data;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  if (method === 'get' && path === '/families') {
    let list = [...db.families];
    const q = String(params.q || '').trim();
    if (q) {
      const scored = list.map((f) => ({ f, s: scoreFamily(f, q) })).filter((x) => x.s > 0);
      scored.sort((a, b) => b.s - a.s);
      list = scored.map((x) => x.f);
    }
    if (params.city) list = list.filter((f) => f.city === params.city);
    if (params.age) list = list.filter((f) => f.members.some((m) => inAgeBucket(m.age, params.age)));
    if (params.gender) list = list.filter((f) => f.members.some((m) => m.gender === params.gender));
    if (!q) list.sort((a, b) => a.monthlyHelpCount - b.monthlyHelpCount || a.id.localeCompare(b.id));
    return okRes(clone(list));
  }
  return fail('Not handled here', 'NOT_FOUND', 404);
}

export const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { db, HELP_LIMIT, tokenFor, userFromAuth, handle, fail, okRes };
export function apiErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Что-то пошло не так';
}
export function isHelpLimitError(err) {
  return err?.response?.data?.code === 'HELP_LIMIT' || err?.code === 'HELP_LIMIT';
}
