// Seed data part 1: families A-Г (raw, bilingual; the mock API resolves text by language).
// Privacy: no children's ages, no member names, no story text, no photos, no public numbering.
// `id` is internal and used for routing only; it is never rendered in the UI.
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString();

export const FAMILIES_PART1 = [
  {
    id: 'f-k3m9',
    label: { ru: 'Семья А.', ky: 'А. үй-бүлөсү' },
    cityKey: 'bishkek',
    address: { street: { ru: 'ул. Ахунбаева', ky: 'Ахунбаев көч.' }, house: '112' },
    adults: 2,
    boys: 2,
    girls: 1,
    needs: [
      { id: 'n1', key: 'diapers', urgent: true },
      { id: 'n2', key: 'school-uniform', urgent: true },
      { id: 'n3', key: 'flour-oil' },
    ],
    verified: true,
    baseHelpCount: 0,
    needsUpdatedAt: hoursAgo(5),
  },
  {
    id: 'f-p7x2',
    label: { ru: 'Семья Б.', ky: 'Б. үй-бүлөсү' },
    cityKey: 'osh',
    address: { street: { ru: 'ул. Ленина', ky: 'Ленин көч.' }, house: '45' },
    adults: 1,
    boys: 2,
    girls: 2,
    needs: [
      { id: 'n1', key: 'groceries', urgent: true },
      { id: 'n2', key: 'winter-jackets', urgent: true },
      { id: 'n3', key: 'medicine' },
    ],
    verified: true,
    baseHelpCount: 1,
    needsUpdatedAt: hoursAgo(26),
  },
  {
    id: 'f-d4q8',
    label: { ru: 'Семья В.', ky: 'В. үй-бүлөсү' },
    cityKey: 'karakol',
    address: { street: { ru: 'ул. Гебзе', ky: 'Гебзе көч.' }, house: '8' },
    adults: 2,
    boys: 1,
    girls: 1,
    needs: [
      { id: 'n1', key: 'baby-food', urgent: true },
      { id: 'n2', key: 'firewood' },
    ],
    verified: false,
    baseHelpCount: 0,
    needsUpdatedAt: hoursAgo(9),
  },
  {
    id: 'f-w2n6',
    label: { ru: 'Семья Г.', ky: 'Г. үй-бүлөсү' },
    cityKey: 'bishkek',
    address: { street: { ru: 'мкр. Восток-5', ky: 'Восток-5 м/р' }, house: '21' },
    adults: 1,
    boys: 1,
    girls: 1,
    needs: [
      { id: 'n1', key: 'stationery', urgent: true },
      { id: 'n2', key: 'school-uniform' },
      { id: 'n3', key: 'shoes' },
    ],
    verified: true,
    baseHelpCount: 2,
    needsUpdatedAt: hoursAgo(50),
  },
];