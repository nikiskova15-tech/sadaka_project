// Mock route handlers: family list/detail, delivery address, needs CRUD and goods help.
// Families receive goods only: there is no money-help route.
import { db, makeCtx } from './mock-db.js';
import { fail, okRes, requireUser } from './client.js';
import { scoreFamily } from './mock-search.js';
import {
  pick,
  monthlyHelpCount,
  serializeFamily,
  serializeDelivery,
  serializeGoodsHelp,
} from './mock-serializers.js';
import { HELP_LIMIT, DELIVERY_PROVIDERS, STORES, PARCEL_WEIGHT } from './config.js';

const SORTS = ['helpCountAsc', 'recent', 'all'];
const FLOWS = ['delivery', 'store-then-delivery'];
const LABEL_MIN = 3;
const LABEL_MAX = 80;

function findFamily(id) {
  const family = db.families.find((f) => f.id === id);
  if (!family) fail('Family not found', 'NOT_FOUND', 404);
  return family;
}

/** Only a member of the family (low-income family account) may change its needs. */
function requireMember(req, family) {
  const user = requireUser(req);
  if (user.familyId !== family.id) fail('Only family members can change needs', 'FORBIDDEN', 403);
  return user;
}

function touchNeeds(family) {
  family.needsUpdatedAt = new Date().toISOString();
}

function cleanLabel(value) {
  const label = String(value || '').trim();
  if (label.length < LABEL_MIN || label.length > LABEL_MAX) {
    fail('Describe the need in 3 to 80 characters', 'VALIDATION', 422);
  }
  return label;
}

function listFamilies(req) {
  const { q, city, gender } = req.params;
  const sort = SORTS.includes(req.params.sort) ? req.params.sort : 'helpCountAsc';
  const ctx = makeCtx(req.lang);
  const query = String(q || '').trim();

  let rows = db.families.map((family) => ({
    family,
    score: query ? scoreFamily(family, query, db.needCatalog) : 0,
    count: monthlyHelpCount(family, db.helps),
    label: pick(family.label, req.lang),
  }));

  if (query) rows = rows.filter((r) => r.score > 0);
  if (city) rows = rows.filter((r) => r.family.cityKey === city);
  if (gender === 'male') rows = rows.filter((r) => r.family.boys > 0);
  if (gender === 'female') rows = rows.filter((r) => r.family.girls > 0);

  const byUpdated = (a, b) => new Date(b.family.needsUpdatedAt) - new Date(a.family.needsUpdatedAt);
  const bySort = {
    helpCountAsc: (a, b) => a.count - b.count || byUpdated(a, b),
    recent: byUpdated,
    all: (a, b) => a.label.localeCompare(b.label, req.lang) || a.family.id.localeCompare(b.family.id),
  }[sort];

  // Relevance first when searching, then the selected sort as a tie-breaker.
  rows.sort((a, b) => (query ? b.score - a.score : 0) || bySort(a, b));
  return okRes(rows.map((r) => serializeFamily(r.family, ctx)));
}

function createNeed(req, family) {
  requireMember(req, family);
  const { key, label, urgent } = req.body || {};
  const need = { id: `n${Date.now().toString(36)}`, urgent: Boolean(urgent) };
  if (key) {
    if (!db.needCatalog.some((c) => c.key === key)) fail('Unknown need', 'VALIDATION', 422);
    if (family.needs.some((n) => n.key === key)) fail('This need is already in the list', 'EXISTS', 409);
    need.key = key;
  } else {
    need.key = null;
    need.customLabel = cleanLabel(label);
    need.category = 'other';
  }
  family.needs.push(need);
  touchNeeds(family);
  return okRes(serializeFamily(family, makeCtx(req.lang)), 201);
}

function patchNeed(req, family, needId) {
  requireMember(req, family);
  const need = family.needs.find((n) => n.id === needId);
  if (!need) fail('Need not found', 'NOT_FOUND', 404);
  const { key, label, urgent } = req.body || {};
  if (key === undefined && label === undefined && urgent === undefined) {
    fail('Nothing to update', 'VALIDATION', 422);
  }
  if (key) {
    if (!db.needCatalog.some((c) => c.key === key)) fail('Unknown need', 'VALIDATION', 422);
    if (family.needs.some((n) => n.key === key && n.id !== needId)) fail('This need is already in the list', 'EXISTS', 409);
    need.key = key;
    delete need.customLabel;
    delete need.category;
  } else if (label !== undefined) {
    need.key = null;
    need.customLabel = cleanLabel(label);
    need.category = 'other';
  }
  if (urgent !== undefined) need.urgent = Boolean(urgent);
  touchNeeds(family);
  return okRes(serializeFamily(family, makeCtx(req.lang)));
}

function deleteNeed(req, family, needId) {
  requireMember(req, family);
  const index = family.needs.findIndex((n) => n.id === needId);
  if (index === -1) fail('Need not found', 'NOT_FOUND', 404);
  family.needs.splice(index, 1);
  touchNeeds(family);
  return okRes(serializeFamily(family, makeCtx(req.lang)));
}

function createGoodsHelp(req, family) {
  const user = requireUser(req);

  // Abuse protection: the 6th help in a calendar month is never completed.
  if (monthlyHelpCount(family, db.helps) >= HELP_LIMIT) {
    fail('This family already received 5 helps this month', 'HELP_LIMIT', 409);
  }

  const { needIds, weightKg, clothingSize, flow, provider, storeId } = req.body || {};
  const ids = Array.isArray(needIds) ? needIds : [];
  const needs = ids.map((id) => family.needs.find((n) => n.id === id));
  if (!ids.length || needs.some((n) => !n)) fail('Pick items from the needs list', 'VALIDATION', 422);

  const weight = Number(weightKg);
  if (!(weight >= PARCEL_WEIGHT.min && weight <= PARCEL_WEIGHT.max)) {
    fail('Parcel weight is out of range', 'VALIDATION', 422);
  }
  if (!FLOWS.includes(flow)) fail('Unknown help flow', 'VALIDATION', 422);
  if (!DELIVERY_PROVIDERS[provider]) fail('Unknown delivery service', 'VALIDATION', 422);
  if (flow === 'store-then-delivery' && !STORES[storeId]) fail('Pick a store', 'VALIDATION', 422);

  const help = {
    id: `h${Date.now().toString(36)}`,
    userId: user.id,
    familyId: family.id,
    items: needs.map((n) => ({ needId: n.id, key: n.key, customLabel: n.customLabel })),
    weightKg: weight,
    clothingSize: String(clothingSize || '').trim().slice(0, 20) || null,
    flow,
    provider,
    storeId: flow === 'store-then-delivery' ? storeId : null,
    receipt: `G-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.helps.push(help);

  const ctx = makeCtx(req.lang);
  return okRes({ help: serializeGoodsHelp(help, ctx), family: serializeFamily(family, ctx) }, 201);
}

/** Returns a response, or null when the path does not belong to this module. */
export async function handleFamilyRoutes(req) {
  const { method, path } = req;

  if (method === 'get' && path === '/families') return listFamilies(req);

  const detail = path.match(/^\/families\/([\w-]+)$/);
  if (method === 'get' && detail) {
    return okRes(serializeFamily(findFamily(detail[1]), makeCtx(req.lang)));
  }

  const delivery = path.match(/^\/families\/([\w-]+)\/delivery$/);
  if (method === 'get' && delivery) {
    requireUser(req);
    return okRes(serializeDelivery(findFamily(delivery[1]), makeCtx(req.lang)));
  }

  const needs = path.match(/^\/families\/([\w-]+)\/needs$/);
  if (method === 'post' && needs) return createNeed(req, findFamily(needs[1]));

  const oneNeed = path.match(/^\/families\/([\w-]+)\/needs\/([\w-]+)$/);
  if (method === 'patch' && oneNeed) return patchNeed(req, findFamily(oneNeed[1]), oneNeed[2]);
  if (method === 'delete' && oneNeed) return deleteNeed(req, findFamily(oneNeed[1]), oneNeed[2]);

  const goods = path.match(/^\/families\/([\w-]+)\/help-goods$/);
  if (method === 'post' && goods) return createGoodsHelp(req, findFamily(goods[1]));

  return null;
}