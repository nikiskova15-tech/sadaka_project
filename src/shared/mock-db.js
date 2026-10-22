// In-memory database for the mock backend. Data resets on page reload.
import { FAMILIES_PART1 } from './seed-part1.js';
import { FAMILIES_PART2 } from './seed-part2.js';
import { FAMILIES_PART3 } from './seed-part3.js';
import { CHARITY_POINTS } from './seed-part4.js';
import { NEED_CATALOG, CITIES, TEAM, SDGS } from './seed-part5.js';
import { HELP_LIMIT } from './config.js';
import { currentMonthKey, readHeader } from './mock-serializers.js';

export { HELP_LIMIT };

const clone = (v) => JSON.parse(JSON.stringify(v));
const seedMonth = currentMonthKey();

export const db = {
  // baseHelpCount only counts for the month in which the seed was loaded.
  families: clone([...FAMILIES_PART1, ...FAMILIES_PART2, ...FAMILIES_PART3]).map((f) => ({
    ...f,
    baseMonth: seedMonth,
  })),
  points: clone(CHARITY_POINTS),
  team: clone(TEAM),
  sdgs: clone(SDGS),
  needCatalog: clone(NEED_CATALOG),
  cities: clone(CITIES),
  helps: [], // goods helps created through the API
  donations: [], // donations to charity points created through the API
  users: [
    {
      id: 'u1',
      name: 'Демо Донор',
      email: 'donor@sadaka.kg',
      password: 'sadaka123',
      phone: '+996 555 000 111',
      role: 'donor',
      familyId: null,
    },
    {
      id: 'u2',
      name: 'Демо Семья',
      email: 'family@sadaka.kg',
      password: 'sadaka123',
      phone: '+996 555 000 222',
      role: 'family',
      familyId: 'f-k3m9',
    },
  ],
};

/** Serialization context for one request language. */
export function makeCtx(lang) {
  return {
    lang,
    catalog: db.needCatalog,
    cities: db.cities,
    helps: db.helps,
    points: db.points,
    families: db.families,
  };
}

export function tokenFor(user) {
  return `mock-jwt.${user.id}.${Date.now()}`;
}

/** Resolves the user from the Authorization header. Returns null for missing/unknown tokens. */
export function userFromAuth(headers) {
  const header = String(readHeader(headers, 'Authorization') || '');
  const match = header.match(/^Bearer mock-jwt\.(.+?)\./);
  if (!match) return null;
  return db.users.find((u) => u.id === match[1]) || null;
}