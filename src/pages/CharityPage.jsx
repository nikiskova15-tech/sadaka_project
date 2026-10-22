// Charity map: Kyrgyzstan-only stylized map, category chips in URL, slide-over drawer.
import { useSearchParams } from 'react-router-dom';
import { Button, Drawer, InputNumber, Input, message, Spin } from 'antd';
import { useState } from 'react';
import { useCharityPoints, useDonate } from '../entities/use-content.js';
import { useMapStore, useAuthStore } from '../app/stores.js';
import { apiErrorMessage } from '../shared/mock-api.js';

const LABELS = { all: 'Все', orphanage: 'Детские дома', mosque: 'Мечети', internat: 'Интернаты' };
const ICONS = { orphanage: '🏠', mosque: '🕌', internat: '🏫' };

// Normalize lng/lat of Kyrgyzstan into % positions on the stylized panel.
function pos(p) {
  const x = ((p.lng - 69.5) / (80.2 - 69.5)) * 100;
  const y = ((43.3 - p.lat) / (43.3 - 39.2)) * 100;
  return { left: `${8 + (x / 100) * 84}%`, top: `${10 + (y / 100) * 78}%` };
}

export function CharityPage() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') || 'all';
  const { data = [], isLoading } = useCharityPoints(type);
  const selectedId = useMapStore((s) => s.selectedId);
  const open = useMapStore((s) => s.drawerOpen);
  const select = useMapStore((s) => s.select);
  const close = useMapStore((s) => s.close);
  const user = useAuthStore((s) => s.user);
  const donate = useDonate();
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState('');
  const selected = data.find((p) => p.id === selectedId) || null;

  const give = async () => {
    const sum = Number(custom) > 0 ? Number(custom) : amount;
    if (!user) { message.info('Войдите, чтобы пожертвовать'); return; }
    try { await donate.mutateAsync({ pointId: selected.id, amount: sum }); message.success(`Спасибо! ${sum} сом отправлено.`); setCustom(''); }
    catch (e) { message.error(apiErrorMessage(e)); }
  };

  return (
    <main className="page">
      <span className="eyebrow">Карта добра</span>
      <h1 style={{ fontSize: 52, margin: '8px 0' }}>Благотворительность</h1>
      <p>Только Кыргызстан: детские дома, мечети и интернаты. Нажмите на метку — детали откроются справа.</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {Object.entries(LABELS).map(([k, label]) => (
          <Button key={k} type={type === k ? 'primary' : 'default'} onClick={() => { const n = new URLSearchParams(params); if (k === 'all') n.delete('type'); else n.set('type', k); setParams(n); close(); }}>{label}</Button>
        ))}
      </div>
      {isLoading ? <Spin /> : (
        <div className="kg-map">
          <svg viewBox="0 0 800 420" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
            <path d="M120 190 L210 130 L330 120 L470 90 L600 120 L680 190 L620 300 L480 340 L320 330 L190 290 Z" fill="#ceecb6" stroke="#89ac76" strokeWidth="4" />
            <text x="330" y="230" fontSize="26" fill="#5f8550" fontFamily="Outfit">КЫРГЫЗСТАН</text>
          </svg>
          {data.map((p) => (
            <button key={p.id} className={`pin ${selectedId === p.id ? 'active' : ''}`} style={pos(p)} onClick={() => select(p.id)} title={p.name}>
              {ICONS[p.type]}<span className="pin-label">{p.city}</span>
            </button>
          ))}
        </div>
      )}
      <Drawer title={selected?.name || 'Точка помощи'} open={open && Boolean(selected)} onClose={close} width={420} styles={{ body: { background: '#f4efe7' } }}>
        {selected && (
          <div>
            <p><b>{LABELS[selected.type]}</b> · {selected.city}</p>
            <p>{selected.address}</p>
            <div className="card" style={{ padding: 16 }}><b>Сейчас нужно</b><p>{selected.need}</p></div>
            <div style={{ display: 'flex', gap: 14, marginTop: 16, alignItems: 'center' }}>
              <div className="qr" title={selected.qrText} />
              <small>Наведите камеру, чтобы пожертвовать: {selected.qrText}</small>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[100, 500, 1000].map((s) => <Button key={s} type={amount === s && !custom ? 'primary' : 'default'} onClick={() => { setAmount(s); setCustom(''); }}>{s} сом</Button>)}
            </div>
            <Input placeholder="Своя сумма" value={custom} onChange={(e) => setCustom(e.target.value)} style={{ marginTop: 10 }} suffix="сом" />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <InputNumber value={amount} onChange={(v) => setAmount(v || 0)} style={{ flex: 1 }} />
              <Button type="primary" loading={donate.isPending} onClick={give}>Пожертвовать</Button>
            </div>
          </div>
        )}
      </Drawer>
    </main>
  );
}
