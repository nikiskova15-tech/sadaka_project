// Pure helpers that turn raw bilingual seed records into the language-resolved API payloads.
// They never touch the database object directly: everything comes through a context
// built by makeCtx() in mock-db.js ({ lang, catalog, cities, helps, points, families }).

/** Picks the text for a language from a { ru, ky } object, falling back to Russian. */
export function pick(localized, lang) {
  if (!localized) return '';
  return localized[lang] || localized.ru || '';
}

export function currentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Helps in the current calendar month: the seeded baseline (only valid in the month it was
 * seeded) plus every goods help created through the API since then.
 */
export function monthlyHelpCount(family, helps, now = new Date()) {
  const key = currentMonthKey(now);
  const base = family.baseMonth === key ? family.baseHelpCount || 0 : 0;
  const added = helps.filter(
    (h) => h.familyId === family.id && currentMonthKey(new Date(h.createdAt)) === key,
  ).length;
  return base + added;
}

export function cityName(cities, cityKey, lang) {
  const city = cities.find((c) => c.key === cityKey);
  return city ? pick(city.name, lang) : cityKey;
}

export function buildAddress(city, street, house) {
  return `${city}, ${street}, ${house}`;
}

/** Reads a header from either an AxiosHeaders instance or a plain object. */
export function readHeader(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  return headers[name] || headers[name.toLowerCase()] || '';
}

export function serializeNeed(need, ctx) {
  const item = need.key ? ctx.catalog.find((c) => c.key === need.key) : null;
  return {
    id: need.id,
    key: item ? item.key : null,
    label: item ? pick(item.label, ctx.lang) : need.customLabel || '',
    category: item ? item.category : need.category || 'other',
    urgent: Boolean(need.urgent),
  };
}

export function serializeFamily(family, ctx) {
  return {
    id: family.id,
    label: pick(family.label, ctx.lang),
    cityKey: family.cityKey,
    city: cityName(ctx.cities, family.cityKey, ctx.lang),
    adults: family.adults,
    boys: family.boys,
    girls: family.girls,
    children: family.boys + family.girls,
    needs: family.needs.map((n) => serializeNeed(n, ctx)),
    verified: Boolean(family.verified),
    monthlyHelpCount: monthlyHelpCount(family, ctx.helps),
    needsUpdatedAt: family.needsUpdatedAt,
  };
}

/** Delivery address: only for logged-in donors, never part of the public family payload. */
export function serializeDelivery(family, ctx) {
  const city = cityName(ctx.cities, family.cityKey, ctx.lang);
  const street = pick(family.address.street, ctx.lang);
  const house = family.address.house;
  return { familyId: family.id, city, street, house, address: buildAddress(city, street, house) };
}

export function serializePoint(point, ctx) {
  const city = cityName(ctx.cities, point.cityKey, ctx.lang);
  const name = pick(point.name, ctx.lang);
  const street = pick(point.street, ctx.lang);
  return {
    id: point.id,
    type: point.type,
    cityKey: point.cityKey,
    city,
    name,
    street,
    house: point.house,
    address: buildAddress(city, street, point.house),
    need: pick(point.need, ctx.lang),
    requisites: { bank: point.requisites.bank, account: point.requisites.account, recipient: name },
    lat: point.lat,
    lng: point.lng,
  };
}

export function serializeTeamMember(member, lang) {
  return {
    id: member.id,
    name: member.name,
    role: pick(member.role, lang),
    bio: pick(member.bio, lang),
    photo: member.photo,
  };
}

export function serializeSdg(goal, lang) {
  return {
    id: goal.id,
    number: goal.number,
    code: pick(goal.code, lang),
    title: pick(goal.title, lang),
    text: pick(goal.text, lang),
    contribution: pick(goal.contribution, lang),
    tone: goal.tone,
  };
}

export function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    role: user.role,
    familyId: user.familyId || null,
  };
}

export function serializeGoodsHelp(help, ctx) {
  const family = ctx.families.find((f) => f.id === help.familyId);
  return {
    id: help.id,
    kind: 'goods',
    familyId: help.familyId,
    familyLabel: family ? pick(family.label, ctx.lang) : '',
    city: family ? cityName(ctx.cities, family.cityKey, ctx.lang) : '',
    items: help.items.map((item) => {
      const cat = item.key ? ctx.catalog.find((c) => c.key === item.key) : null;
      return { needId: item.needId, label: cat ? pick(cat.label, ctx.lang) : item.customLabel || '' };
    }),
    weightKg: help.weightKg,
    clothingSize: help.clothingSize || null,
    flow: help.flow,
    provider: help.provider,
    storeId: help.storeId || null,
    receipt: help.receipt,
    createdAt: help.createdAt,
  };
}

export function serializeDonation(donation, ctx) {
  const point = ctx.points.find((p) => p.id === donation.pointId);
  return {
    id: donation.id,
    kind: 'donation',
    pointId: donation.pointId,
    pointName: point ? pick(point.name, ctx.lang) : '',
    amount: donation.amount,
    currency: 'KGS',
    receipt: donation.receipt,
    createdAt: donation.createdAt,
  };
}