// Families catalog: AI search + filters synced to useSearchParams + Query keys.
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input, Select, Tag, Spin, Empty, Badge } from 'antd';
import { useFamilies } from '../entities/use-families.js';
import { CITIES } from '../shared/seed-part5.js';

const AGES = ['0-3', '4-7', '8-14', '14-18', '18+'];

function timeAgo(iso) {
  const h = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 3600000));
  if (h < 24) return `${h} ч. назад`;
  return `${Math.round(h / 24)} дн. назад`;
}

export function FamiliesPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const filters = {
    q: params.get('q') || '',
    age: params.get('age') || '',
    gender: params.get('gender') || '',
    city: params.get('city') || '',
  };
  const { data = [], isLoading } = useFamilies(filters);
  const set = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
  };

  return (
    <main className="page">
      <span className="eyebrow">Каталог</span>
      <h1 style={{ fontSize: 52, margin: '8px 0' }}>Помощь семьям</h1>
      <p>Сначала показываем тех, кто получил меньше всего помощи в этом месяце.</p>
      <div className="card search-hero">
        <Input.Search
          size="large"
          placeholder="Умный поиск: «нужны подгузники и школьная форма»"
          defaultValue={filters.q}
          allowClear
          enterButton="Найти"
          onSearch={(v) => set('q', v)}
        />
        <div className="filters" style={{ marginTop: 14 }}>
          <Select placeholder="Возраст ребёнка" allowClear value={filters.age || undefined} onChange={(v) => set('age', v || '')} options={AGES.map((a) => ({ value: a, label: a }))} />
          <Select placeholder="Пол" allowClear value={filters.gender || undefined} onChange={(v) => set('gender', v || '')} options={[{ value: 'male', label: 'Мальчик' }, { value: 'female', label: 'Девочка' }]} />
          <Select placeholder="Город" allowClear value={filters.city || undefined} onChange={(v) => set('city', v || '')} options={CITIES.map((c) => ({ value: c, label: c }))} />
          <span style={{ alignSelf: 'center', color: '#8c9dad' }}>Найдено: {data.length}</span>
        </div>
      </div>
      {isLoading ? <Spin /> : data.length === 0 ? <Empty description="Ничего не найдено — попробуйте другой запрос" /> : (
        <div className="family-grid">
          {data.map((f) => (
            <article key={f.id} className="card family-card" onClick={() => navigate(`/families/${f.id}`, { state: { family: f } })}>
              <img src={f.photo} alt={f.displayId} />
              <div className="family-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>{f.displayId}</b>
                  {f.verified && <Badge count="Проверена" style={{ background: '#89ac76' }} />}
                </div>
                <p style={{ color: '#8c9dad', margin: '6px 0' }}>{f.city} · взрослых: {f.adults} · детей: {f.children}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {f.needs.slice(0, 3).map((n) => <Tag key={n.id} color="green">{n.label}</Tag>)}
                </div>
                <p style={{ marginTop: 10 }}>{f.comment}</p>
                <small style={{ color: '#8c9dad' }}>Обновлено: {timeAgo(f.updatedAt)}</small>
                <div><b>Получено помощи: {f.monthlyHelpCount}/5</b></div>
                <div className="progress"><i style={{ width: `${(f.monthlyHelpCount / 5) * 100}%` }} /></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
