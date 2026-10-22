// In-memory database for the mock backend.
import { FAMILIES_PART1 } from './seed-part1.js';
import { FAMILIES_PART2 } from './seed-part2.js';
import { FAMILIES_PART3 } from './seed-part3.js';
import { CHARITY_POINTS } from './seed-part4.js';
import { TEAM, SDGS } from './seed-part5.js';

export const HELP_LIMIT = 5;
const clone = (v) => JSON.parse(JSON.stringify(v));

export const db = {
  families: clone([...FAMILIES_PART1, ...FAMILIES_PART2, ...FAMILIES_PART3]),
  points: clone(CHARITY_POINTS),
  team: clone(TEAM),
  sdgs: clone(SDGS),
  users: [{ id: 'u1', name: 'Демо Донор', email: 'donor@sadaka.kg', password: 'sadaka123' }],
};

export function tokenFor(user) {
  return `mock-jwt.${user.id}.${Date.now()}`;
}

export function userFromAuth(headers = {}) {
  const h = headers.Authorization || headers.authorization || '';
  const m = String(h).match(/^Bearer mock-jwt\.(.+?)\./);
  if (!m) return null;
  return db.users.find((u) => u.id === m[1]) || null;
}
