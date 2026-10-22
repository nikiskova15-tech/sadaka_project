// Mock semantic matcher: synonym groups over needs + comment text.
// Prototype "AI search" that scores meaning, not only exact strings.
const SYNONYMS = [
  ['подгузник', 'памперс', 'pampers', 'baby', 'малыш'],
  ['школьная форма', 'форма', 'школа', 'учебник', 'тетрадь', 'рюкзак', 'канцелярия', 'school'],
  ['продукт', 'еда', 'мука', 'масло', 'крупа', 'рис', 'молоко', 'food', 'голод', 'обед'],
  ['куртка', 'одежда', 'обувь', 'тепл', 'зим', 'clothes'],
  ['лекарство', 'медицина', 'витамин', 'астма', 'давление', 'medicine', 'аптека'],
  ['крыша', 'дрова', 'ремонт', 'дом', 'отопление', 'housing'],
  ['игрушка', 'книга', 'детск'],
];

export function scoreFamily(family, query) {
  const text = `${family.comment} ${(family.needs || []).map((n) => n.label).join(' ')}`.toLowerCase();
  const words = String(query).toLowerCase().split(/[\s,.;!?]+/).filter((w) => w.length > 2);
  if (!words.length) return 0;
  let score = 0;
  for (const w of words) {
    if (text.includes(w)) { score += 3; continue; }
    const group = SYNONYMS.find((g) => g.some((s) => w.includes(s) || s.includes(w)));
    if (group && group.some((s) => text.includes(s))) score += 2;
  }
  return score;
}

export function inAgeBucket(age, bucket) {
  if (bucket === '0-3') return age <= 3;
  if (bucket === '4-7') return age >= 4 && age <= 7;
  if (bucket === '8-14') return age >= 8 && age <= 14;
  if (bucket === '14-18') return age > 14 && age <= 18;
  if (bucket === '18+') return age > 18;
  return true;
}
