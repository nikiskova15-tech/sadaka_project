// Help flows: money (MBANK/Optima/KICB/Bakai) and goods (Glovo/Yandex).
import { useState } from 'react';
import { Button, InputNumber, Input, Select, Steps, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMoneyHelp, useGoodsHelp } from '../entities/use-families.js';
import { useAuthStore, useHelpStore } from '../app/stores.js';
import { apiErrorMessage, isHelpLimitError, HELP_LIMIT } from '../shared/mock-api.js';

const REQUISITES = {
  MBANK: 'MBANK · *5050 · счёт 1234 5678 9012 · получатель Садака',
  Optima: 'Optima Bank · IBAN KG12 3456 7890 · получатель Садака',
  KICB: 'KICB · карта 4143 0000 1122 3344 · получатель Садака',
  Bakai: 'Bakai Bank · кошелёк 0555 010 203 · получатель Садака',
};

export function HelpBox({ family }) {
  const [tab, setTab] = useState('money');
  const [amount, setAmount] = useState(500);
  const [weight, setWeight] = useState(3);
  const [size, setSize] = useState('');
  const payMethod = useHelpStore((s) => s.payMethod);
  const delivery = useHelpStore((s) => s.delivery);
  const wiz = useHelpStore((s) => s.step);
  const setHelp = useHelpStore((s) => s.set);
  const reset = useHelpStore((s) => s.reset);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const moneyHelp = useMoneyHelp(family.id);
  const goodsHelp = useGoodsHelp(family.id);
  const full = family.monthlyHelpCount >= HELP_LIMIT;

  const guard = () => {
    if (full) { setHelp({ limitModalOpen: true }); return false; }
    if (!user) { message.info('Войдите, чтобы помочь семье'); navigate('/login'); return false; }
    return true;
  };
  const submitMoney = async () => {
    if (!guard()) return;
    try { await moneyHelp.mutateAsync({ familyId: family.id, amount, method: payMethod }); message.success('Спасибо! Помощь засчитана.'); setHelp({ step: 2 }); }
    catch (e) { if (isHelpLimitError(e)) setHelp({ limitModalOpen: true }); else message.error(apiErrorMessage(e)); }
  };
  const submitGoods = async () => {
    if (!guard()) return;
    try { await goodsHelp.mutateAsync({ familyId: family.id, weightKg: weight, clothingSize: size || '—', delivery }); message.success('Заявка на доставку создана!'); setHelp({ step: 2 }); }
    catch (e) { if (isHelpLimitError(e)) setHelp({ limitModalOpen: true }); else message.error(apiErrorMessage(e)); }
  };

  return (
    <aside className="card help-box">
      <Steps current={wiz} size="small" items={[{ title: 'Выбор' }, { title: 'Детали' }, { title: 'Готово' }]} />
      <div style={{ display: 'flex', gap: 8, margin: '14px 0' }}>
        <Button type={tab === 'money' ? 'primary' : 'default'} onClick={() => { setTab('money'); reset(); }}>Деньгами</Button>
        <Button type={tab === 'goods' ? 'primary' : 'default'} onClick={() => { setTab('goods'); reset(); }}>Вещами</Button>
      </div>
      {tab === 'money' ? (
        <div>
          <p>Сумма (сом)</p>
          <InputNumber min={10} value={amount} onChange={(v) => setAmount(v || 0)} style={{ width: '100%' }} />
          <p style={{ marginTop: 12 }}>Способ оплаты</p>
          <Select value={payMethod} onChange={(v) => setHelp({ payMethod: v, step: 1 })} style={{ width: '100%' }} options={['MBANK', 'Optima', 'KICB', 'Bakai'].map((m) => ({ value: m, label: m }))} />
          <div className="card" style={{ padding: 14, marginTop: 12, background: '#fff' }}><b>Реквизиты</b><p>{REQUISITES[payMethod]}</p></div>
          <Button type="primary" block style={{ marginTop: 12 }} loading={moneyHelp.isPending} onClick={submitMoney}>Я помог — засчитать</Button>
        </div>
      ) : (
        <div>
          <p>Вес посылки (кг)</p>
          <InputNumber min={0.5} value={weight} onChange={(v) => setWeight(v || 0)} style={{ width: '100%' }} />
          <p style={{ marginTop: 12 }}>Размер одежды</p>
          <Input placeholder="Например: 128 или M" value={size} onChange={(e) => setSize(e.target.value)} />
          <p style={{ marginTop: 12 }}>Доставка</p>
          <Select value={delivery} onChange={(v) => setHelp({ delivery: v, step: 1 })} style={{ width: '100%' }} options={['Glovo', 'Yandex'].map((m) => ({ value: m, label: m }))} />
          <div className="card" style={{ padding: 14, marginTop: 12, background: '#fff' }}><b>Адрес</b><p>{family.city}, {family.address}</p><p>Нужно: {family.needs.map((n) => n.label).join(', ')}</p></div>
          <Button type="primary" block style={{ marginTop: 12 }} loading={goodsHelp.isPending} onClick={submitGoods}>Я отправил — засчитать</Button>
        </div>
      )}
      {wiz === 2 && <p style={{ marginTop: 12 }}>Спасибо за доброе сердце! Счётчик обновлён.</p>}
    </aside>
  );
}
