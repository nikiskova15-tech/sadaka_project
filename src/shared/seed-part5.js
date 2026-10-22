// Seed data part 5: team, SDG goals (only 1, 2, 10), cities.
export const TEAM = [
  { id: 't1', name: 'Айгерим Токтосунова', role: 'Основатель', bio: 'Запустила Садаку после волонтёрства в детских домах Иссык-Куля. Отвечает за стратегию.', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop' },
  { id: 't2', name: 'Данияр Исаков', role: 'Координатор семей', bio: 'Проверяет заявки семей, выезжает в регионы и ведёт реестр помощи.', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' },
  { id: 't3', name: 'Мээрим Абдыкадырова', role: 'Дизайн и сообщество', bio: 'Делает платформу тёплой и понятной. Ведёт соцсети и истории помощи.', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop' },
  { id: 't4', name: 'Тимур Сарыбаев', role: 'Технологии', bio: 'Отвечает за карту помощи, платежи и прозрачную отчётность.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop' },
];

export const SDGS = [
  { id: 'sdg1', code: 'ЦУР 1', title: 'Нет нищете', text: 'Помогаем семьям выйти из крайней нужды: продукты, одежда, поддержка.', tone: 'pink' },
  { id: 'sdg2', code: 'ЦУР 2', title: 'Нет голоду', text: 'Продуктовые наборы, горячие обеды при мечетях и помощь детям.', tone: 'blue' },
  { id: 'sdg10', code: 'ЦУР 10', title: 'Меньше неравенства', text: 'Дети из интернатов и сёл получают шансы: учёба, тепло и забота.', tone: 'mint' },
];

export const CITIES = ['Бишкек', 'Ош', 'Каракол', 'Джалал-Абад', 'Талас', 'Нарын', 'Баткен', 'Кара-Балта', 'Токмок'];
