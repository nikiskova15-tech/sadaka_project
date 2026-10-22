// Family profile page: loader data + live query + needs + limit modal.
import { useState } from 'react';
import { useParams, useLocation, useLoaderData, useNavigate, Link } from 'react-router-dom';
import { Button, Tag, Modal, Input, Spin, message } from 'antd';
import { useFamily, useAddNeed } from '../entities/use-families.js';
import { useHelpStore } from '../app/stores.js';
import { apiErrorMessage } from '../shared/mock-api.js';
import { HelpBox } from '../features/HelpBox.jsx';

export function FamilyProfilePage() {
  const { id } = useParams();
  const loaderFamily = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: live, isLoading } = useFamily(id);
  const family = live || location.state?.family || loaderFamily;
  const [needText, setNeedText] = useState('');
  const limitOpen = useHelpStore((s) => s.limitModalOpen);
  const setHelp = useHelpStore((s) => s.set);
  const addNeed = useAddNeed(id);

  if (isLoading && !family) return <main className="page"><Spin /></main>;
  if (!family) return <main className="page"><h1>Семья не найдена</h1><Link to="/families">Назад</Link></main>;

  return (
    <main className="page">
      <Link to="/families">← Все семьи</Link>
      <h1 style={{ fontSize: 48, margin: '8px 0' }}>{family.displayId}</h1>
      <p>{family.city} · {family.address} · взрослых: {family.adults} · детей: {family.children} {family.verified ? <Tag color="green">Проверена</Tag> : <Tag>На проверке</Tag>}</p>
      <div className="profile">
        <div>
          <img className="profile-photo" src={family.photo} alt={family.displayId} />
          <div className="card" style={{ padding: 22, marginTop: 16 }}>
            <h3>История семьи</h3><p>{family.comment}</p>
            <h4>Список нужд</h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{family.needs.map((n) => <Tag key={n.id} color={n.urgent ? 'red' : 'green'}>{n.label}</Tag>)}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Input placeholder="Добавить нужду" value={needText} onChange={(e) => setNeedText(e.target.value)} />
              <Button onClick={async () => { try { await addNeed.mutateAsync({ label: needText }); setNeedText(''); message.success('Нужда добавлена'); } catch (e) { message.error(apiErrorMessage(e)); } }} loading={addNeed.isPending}>Добавить</Button>
            </div>
            <p style={{ marginTop: 14 }}>Получено помощи: <b>{family.monthlyHelpCount}/5</b> · Обновлено: {new Date(family.updatedAt).toLocaleString('ru-RU')}</p>
            <h4>Состав семьи</h4>
            {family.members.map((m) => <p key={m.id} style={{ margin: '4px 0' }}>{m.name} · {m.age} лет · {m.registered ? 'зарегистрирован' : 'не зарегистрирован'}</p>)}
          </div>
        </div>
        <HelpBox family={family} />
      </div>
      <Modal open={limitOpen} onCancel={() => setHelp({ limitModalOpen: false })} title="Спасибо за ваше добро!"
        footer={[<Button key="a" type="primary" onClick={() => { setHelp({ limitModalOpen: false }); navigate('/families'); }}>Помочь другой семье</Button>]}>
        <p>Эта семья уже получила 5 помощей в этом месяце — наш честный лимит, чтобы поддержка досталась всем.</p>
        <p>Пожалуйста, помогите другой семье рядом.</p>
      </Modal>
    </main>
  );
}
