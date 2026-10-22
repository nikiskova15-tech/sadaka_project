// Mock route handlers: catalogs, charity points + donations, team, SDGs, auth, /me.
import { db, makeCtx, tokenFor } from './mock-db.js';
import { fail, okRes, requireUser } from './client.js';
import {
  pick,
  serializeFamily,
  serializePoint,
  serializeTeamMember,
  serializeSdg,
  serializeUser,
  serializeGoodsHelp,
  serializeDonation,
} from './mock-serializers.js';
import { MIN_DONATION, MAX_DONATION } from './config.js';

const POINT_TYPES = ['orphanage', 'mosque', 'internat'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

function register(req) {
  const { name, email, password, phone } = req.body || {};
  const cleanName = String(name || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (cleanName.length < 2 || !EMAIL_RE.test(cleanEmail) || String(password || '').length < 6) {
    fail('Fill in all fields correctly', 'VALIDATION', 422);
  }
  if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) fail('Email is already registered', 'EXISTS', 409);
  const user = {
    id: `u${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password,
    phone: String(phone || '').trim() || null,
    role: 'donor',
    familyId: null,
  };
  db.users.push(user);
  return okRes({ token: tokenFor(user), user: serializeUser(user) }, 201);
}

function login(req) {
  const { email, password } = req.body || {};
  const cleanEmail = String(email || '').trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);
  if (!user) fail('Wrong email or password', 'UNAUTHORIZED', 401);
  return okRes({ token: tokenFor(user), user: serializeUser(user) });
}

function me(req) {
  const user = requireUser(req);
  const ctx = makeCtx(req.lang);
  const family = user.familyId ? db.families.find((f) => f.id === user.familyId) : null;
  return okRes({ ...serializeUser(user), family: family ? serializeFamily(family, ctx) : null });
}

function myHelps(req) {
  const user = requireUser(req);
  const ctx = makeCtx(req.lang);
  return okRes({
    goods: db.helps.filter((h) => h.userId === user.id).sort(byNewest).map((h) => serializeGoodsHelp(h, ctx)),
    donations: db.donations.filter((d) => d.userId === user.id).sort(byNewest).map((d) => serializeDonation(d, ctx)),
  });
}

function donate(req, pointId) {
  const user = requireUser(req);
  const point = db.points.find((p) => p.id === pointId);
  if (!point) fail('Charity point not found', 'NOT_FOUND', 404);
  const amount = Number(req.body?.amount);
  if (!Number.isFinite(amount) || amount < MIN_DONATION || amount > MAX_DONATION) {
    fail('Enter a valid amount', 'VALIDATION', 422);
  }
  const donation = {
    id: `d${Date.now().toString(36)}`,
    userId: user.id,
    pointId: point.id,
    amount: Math.round(amount),
    receipt: `D-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.donations.push(donation);
  return okRes(serializeDonation(donation, makeCtx(req.lang)), 201);
}

/** Returns a response, or null when the path does not belong to this module. */
export async function handleMiscRoutes(req) {
  const { method, path, params, lang } = req;

  if (method === 'get' && path === '/needs-catalog') {
    return okRes(db.needCatalog.map((c) => ({ key: c.key, category: c.category, label: pick(c.label, lang) })));
  }
  if (method === 'get' && path === '/cities') {
    return okRes(db.cities.map((c) => ({ key: c.key, name: pick(c.name, lang) })));
  }

  if (method === 'get' && path === '/charity-points') {
    const ctx = makeCtx(lang);
    let list = db.points;
    if (params.type && POINT_TYPES.includes(params.type)) list = list.filter((p) => p.type === params.type);
    return okRes(list.map((p) => serializePoint(p, ctx)));
  }
  const donateMatch = path.match(/^\/charity-points\/([\w-]+)\/donate$/);
  if (method === 'post' && donateMatch) return donate(req, donateMatch[1]);

  if (method === 'get' && path === '/team') return okRes(db.team.map((m) => serializeTeamMember(m, lang)));
  if (method === 'get' && path === '/sdgs') return okRes(db.sdgs.map((g) => serializeSdg(g, lang)));

  if (method === 'post' && path === '/auth/register') return register(req);
  if (method === 'post' && path === '/auth/login') return login(req);
  if (method === 'get' && path === '/me') return me(req);
  if (method === 'get' && path === '/me/helps') return myHelps(req);

  return null;
}