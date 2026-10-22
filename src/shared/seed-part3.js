// Seed data part 3: families И-К (raw, bilingual).
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString();

export const FAMILIES_PART3 = [
  {
    id: 'f-m1s5',
    label: { ru: 'Семья И.', ky: 'И. үй-бүлөсү' },
    cityKey: 'kara-balta',
    address: { street: { ru: 'ул. Токтогула', ky: 'Токтогул көч.' }, house: '56' },
    adults: 2,
    boys: 1,
    girls: 1,
    needs: [
      { id: 'n1', key: 'medicine' },
      { id: 'n2', key: 'kids-clothes' },
      { id: 'n3', key: 'dairy' },
    ],
    verified: true,
    baseHelpCount: 2,
    needsUpdatedAt: hoursAgo(44),
  },
  {
    id: 'f-y3a2',
    label: { ru: 'Семья К.', ky: 'К. үй-бүлөсү' },
    cityKey: 'tokmok',
    address: { street: { ru: 'ул. Ибраимова', ky: 'Ибраимов көч.' }, house: '90' },
    adults: 1,
    boys: 1,
    girls: 2,
    needs: [
      { id: 'n1', key: 'diapers', urgent: true },
      { id: 'n2', key: 'toys-books' },
    ],
    verified: true,
    baseHelpCount: 0,
    needsUpdatedAt: hoursAgo(3),
  },
];