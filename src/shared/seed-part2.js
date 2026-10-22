// Seed data part 2: families Д-З (raw, bilingual).
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString();

export const FAMILIES_PART2 = [
  {
    id: 'f-r5t1',
    label: { ru: 'Семья Д.', ky: 'Д. үй-бүлөсү' },
    cityKey: 'jalal-abad',
    address: { street: { ru: 'ул. Советская', ky: 'Советская көч.' }, house: '77' },
    adults: 3,
    boys: 2,
    girls: 1,
    needs: [
      { id: 'n1', key: 'medicine', urgent: true },
      { id: 'n2', key: 'flour-oil' },
    ],
    verified: true,
    baseHelpCount: 3,
    needsUpdatedAt: hoursAgo(70),
  },
  {
    id: 'f-h8c3',
    label: { ru: 'Семья Е.', ky: 'Е. үй-бүлөсү' },
    cityKey: 'talas',
    address: { street: { ru: 'ул. Манаса', ky: 'Манас көч.' }, house: '12' },
    adults: 2,
    boys: 2,
    girls: 3,
    needs: [
      { id: 'n1', key: 'diapers' },
      { id: 'n2', key: 'kids-clothes', urgent: true },
      { id: 'n3', key: 'groceries', urgent: true },
    ],
    verified: true,
    baseHelpCount: 4,
    needsUpdatedAt: hoursAgo(30),
  },
  {
    id: 'f-z9v4',
    label: { ru: 'Семья Ж.', ky: 'Ж. үй-бүлөсү' },
    cityKey: 'naryn',
    address: { street: { ru: 'ул. Орозбекова', ky: 'Орозбеков көч.' }, house: '3' },
    adults: 1,
    boys: 1,
    girls: 0,
    needs: [
      { id: 'n1', key: 'winter-jackets', urgent: true },
      { id: 'n2', key: 'textbooks' },
    ],
    verified: true,
    baseHelpCount: 5, // already at the monthly limit: handy for testing the limit modal
    needsUpdatedAt: hoursAgo(100),
  },
  {
    id: 'f-b6j7',
    label: { ru: 'Семья З.', ky: 'З. үй-бүлөсү' },
    cityKey: 'batken',
    address: { street: { ru: 'ул. Достук', ky: 'Достук көч.' }, house: '19' },
    adults: 3,
    boys: 1,
    girls: 2,
    needs: [
      { id: 'n1', key: 'roof-materials', urgent: true },
      { id: 'n2', key: 'school-uniform' },
      { id: 'n3', key: 'grains' },
    ],
    verified: false,
    baseHelpCount: 1,
    needsUpdatedAt: hoursAgo(15),
  },
];