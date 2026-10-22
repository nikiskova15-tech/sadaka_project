// Mock semantic matcher over families' needs tags (no free-text comments exist anymore).
// It scores meaning, not only exact strings: synonym groups in Russian and Kyrgyz,
// plus a light stem match for inflected words ("подгузников" ~ "подгузники").

const SYNONYMS = [
  // babies
  ['подгузник', 'памперс', 'pampers', 'diaper', 'малыш', 'младенец', 'baby', 'смесь', 'ымыркай', 'бөбөк', 'балдар тамагы'],
  // school
  ['школ', 'форма', 'учебник', 'тетрад', 'рюкзак', 'канцеляр', 'школьн', 'мектеп', 'окуу', 'китеп', 'кеңсе', 'school'],
  // food
  ['продукт', 'еда', 'мука', 'масло', 'круп', 'рис', 'молок', 'молоч', 'обед', 'голод', 'азык', 'тамак', 'жарма', 'food'],
  // clothes
  ['куртк', 'одежд', 'обув', 'тепл', 'зим', 'кийим', 'кышкы', 'жылуу', 'clothes', 'shoes'],
  // medicine
  ['лекарств', 'медицин', 'витамин', 'аптек', 'таблет', 'дарыл', 'дары', 'medicine'],
  // housing and warmth
  ['крыш', 'дрова', 'уголь', 'отоплен', 'ремонт', 'стройматериал', 'одеял', 'постел', 'чатыр', 'отун', 'көмүр', 'жууркан', 'housing'],
  // toys, books, hygiene
  ['игруш', 'книг', 'оюнчук', 'гигиен', 'мыло', 'hygiene', 'toys'],
];

// Filler words that carry no meaning for matching.
const STOP_WORDS = new Set(['нужны', 'нужна', 'нужно', 'нужен', 'для', 'семье', 'семьи', 'помощь', 'керек', 'жана', 'үчүн']);

function tokenize(query) {
  return String(query)
    .toLowerCase()
    .split(/[\s,.;:!?«»"'()]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/** Searchable text for a family: keys, categories and labels in BOTH languages, plus custom needs. */
function needsText(family, catalog) {
  const parts = [];
  for (const need of family.needs || []) {
    const item = need.key ? catalog.find((c) => c.key === need.key) : null;
    if (item) parts.push(item.key, item.category, item.label.ru, item.label.ky);
    else if (need.customLabel) parts.push(need.customLabel);
  }
  return parts.join(' ').toLowerCase();
}

/** Returns a relevance score; 0 means "does not match". `family` is the raw seed record. */
export function scoreFamily(family, query, catalog) {
  const words = tokenize(query);
  if (!words.length) return 0;
  const text = needsText(family, catalog);
  let score = 0;
  for (const word of words) {
    if (text.includes(word)) {
      score += 3;
      continue;
    }
    const stem = word.length > 5 ? word.slice(0, word.length - 2) : '';
    if (stem && text.includes(stem)) {
      score += 2;
      continue;
    }
    const groups = SYNONYMS.filter((g) => g.some((s) => word.includes(s) || s.includes(word)));
    if (groups.some((g) => g.some((s) => text.includes(s)))) score += 2;
  }
  return score;
}