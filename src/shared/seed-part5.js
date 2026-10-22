// Seed data part 5: needs catalog, cities, team and SDG goals (only 1, 2, 10). Raw, bilingual.

// Standard needs families can pick from. `key` is stable; labels are resolved per language.
export const NEED_CATALOG = [
  { key: 'diapers', category: 'baby', label: { ru: 'Подгузники', ky: 'Памперстер' } },
  { key: 'baby-food', category: 'baby', label: { ru: 'Детское питание', ky: 'Балдар тамагы' } },
  { key: 'school-uniform', category: 'school', label: { ru: 'Школьная форма', ky: 'Мектеп формасы' } },
  { key: 'stationery', category: 'school', label: { ru: 'Канцелярия', ky: 'Кеңсе буюмдары' } },
  { key: 'textbooks', category: 'school', label: { ru: 'Учебники', ky: 'Окуу китептери' } },
  { key: 'groceries', category: 'food', label: { ru: 'Продукты питания', ky: 'Азык-түлүк' } },
  { key: 'flour-oil', category: 'food', label: { ru: 'Мука и масло', ky: 'Ун жана май' } },
  { key: 'grains', category: 'food', label: { ru: 'Крупы', ky: 'Жарма' } },
  { key: 'dairy', category: 'food', label: { ru: 'Молочные продукты', ky: 'Сүт азыктары' } },
  { key: 'winter-jackets', category: 'clothes', label: { ru: 'Зимние куртки', ky: 'Кышкы куртка' } },
  { key: 'kids-clothes', category: 'clothes', label: { ru: 'Детская одежда', ky: 'Балдар кийими' } },
  { key: 'shoes', category: 'clothes', label: { ru: 'Обувь', ky: 'Бут кийим' } },
  { key: 'medicine', category: 'medicine', label: { ru: 'Лекарства', ky: 'Дарылар' } },
  { key: 'firewood', category: 'housing', label: { ru: 'Дрова и уголь', ky: 'Отун жана көмүр' } },
  { key: 'roof-materials', category: 'housing', label: { ru: 'Стройматериалы для крыши', ky: 'Чатыр үчүн курулуш материалдары' } },
  { key: 'blankets', category: 'housing', label: { ru: 'Одеяла и постельное бельё', ky: 'Жууркан жана төшөк шаймандары' } },
  { key: 'toys-books', category: 'other', label: { ru: 'Игрушки и книги', ky: 'Оюнчуктар жана китептер' } },
  { key: 'hygiene', category: 'other', label: { ru: 'Средства гигиены', ky: 'Гигиена каражаттары' } },
];

export const CITIES = [
  { key: 'bishkek', name: { ru: 'Бишкек', ky: 'Бишкек' } },
  { key: 'osh', name: { ru: 'Ош', ky: 'Ош' } },
  { key: 'karakol', name: { ru: 'Каракол', ky: 'Каракол' } },
  { key: 'jalal-abad', name: { ru: 'Джалал-Абад', ky: 'Жалал-Абад' } },
  { key: 'talas', name: { ru: 'Талас', ky: 'Талас' } },
  { key: 'naryn', name: { ru: 'Нарын', ky: 'Нарын' } },
  { key: 'batken', name: { ru: 'Баткен', ky: 'Баткен' } },
  { key: 'kara-balta', name: { ru: 'Кара-Балта', ky: 'Кара-Балта' } },
  { key: 'tokmok', name: { ru: 'Токмок', ky: 'Токмок' } },
  { key: 'cholpon-ata', name: { ru: 'Чолпон-Ата', ky: 'Чолпон-Ата' } },
  { key: 'uzgen', name: { ru: 'Узген', ky: 'Өзгөн' } },
];

export const TEAM = [
  {
    id: 't1',
    name: 'Айгерим Токтосунова',
    role: { ru: 'Основатель', ky: 'Негиздөөчү' },
    bio: {
      ru: 'Запустила Садаку после волонтёрства в детских домах Иссык-Куля. Отвечает за стратегию.',
      ky: 'Ысык-Көлдөгү балдар үйлөрүндө ыктыярчы болгондон кийин Садака платформасын ишке киргизген. Стратегияга жооптуу.',
    },
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't2',
    name: 'Данияр Исаков',
    role: { ru: 'Координатор семей', ky: 'Үй-бүлөлөрдүн координатору' },
    bio: {
      ru: 'Проверяет заявки семей, выезжает в регионы и ведёт реестр помощи.',
      ky: 'Үй-бүлөлөрдүн арыздарын текшерет, аймактарга барат жана жардам реестрин жүргүзөт.',
    },
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't3',
    name: 'Мээрим Абдыкадырова',
    role: { ru: 'Дизайн и сообщество', ky: 'Дизайн жана коомчулук' },
    bio: {
      ru: 'Делает платформу тёплой и понятной. Ведёт соцсети и истории помощи.',
      ky: 'Платформаны жылуу жана түшүнүктүү кылат. Социалдык тармактарды жана жардам окуяларын жүргүзөт.',
    },
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 't4',
    name: 'Тимур Сарыбаев',
    role: { ru: 'Технологии', ky: 'Технологиялар' },
    bio: {
      ru: 'Отвечает за карту помощи, платежи и прозрачную отчётность.',
      ky: 'Жардам картасына, төлөмдөргө жана ачык отчеттуулукка жооптуу.',
    },
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
  },
];

// Only goals 1, 2 and 10. Never 16 or 17.
export const SDGS = [
  {
    id: 'sdg1',
    number: 1,
    tone: 'pink',
    code: { ru: 'ЦУР 1', ky: 'ТӨМ 1' },
    title: { ru: 'Нет нищете', ky: 'Жакырчылыкка чекит' },
    text: {
      ru: 'Помогаем семьям выйти из крайней нужды: продукты, одежда, поддержка.',
      ky: 'Үй-бүлөлөргө курч муктаждыктан чыгууга жардам беребиз: азык-түлүк, кийим, колдоо.',
    },
    contribution: {
      ru: 'Адресная помощь проверенным семьям: не более 5 раз в месяц, чтобы хватило всем.',
      ky: 'Текшерилген үй-бүлөлөргө дарекке жардам: айына 5 жолудан ашпайт, баарына жетиши үчүн.',
    },
  },
  {
    id: 'sdg2',
    number: 2,
    tone: 'blue',
    code: { ru: 'ЦУР 2', ky: 'ТӨМ 2' },
    title: { ru: 'Нет голоду', ky: 'Ачарчылыкка чекит' },
    text: {
      ru: 'Продуктовые наборы, горячие обеды при мечетях и помощь детям.',
      ky: 'Азык-түлүк топтомдору, мечиттердеги ысык тамактар жана балдарга жардам.',
    },
    contribution: {
      ru: 'Продукты и горячие обеды: в списках нужд семей и на карте точек добра.',
      ky: 'Азык-түлүк жана ысык тамактар: үй-бүлөлөрдүн муктаждык тизмесинде жана жакшылык картасында.',
    },
  },
  {
    id: 'sdg10',
    number: 10,
    tone: 'mint',
    code: { ru: 'ЦУР 10', ky: 'ТӨМ 10' },
    title: { ru: 'Меньше неравенства', ky: 'Теңсиздикти азайтуу' },
    text: {
      ru: 'Дети из интернатов и сёл получают шансы: учёба, тепло и забота.',
      ky: 'Интернаттардагы жана айылдардагы балдар мүмкүнчүлүккө ээ болот: окуу, жылуулук жана камкордук.',
    },
    contribution: {
      ru: 'Платформа охватывает регионы, от Бишкека до Баткена, а не только столицу.',
      ky: 'Платформа аймактарды камтыйт, Бишкектен Баткенге чейин, борбор шаар гана эмес.',
    },
  },
];