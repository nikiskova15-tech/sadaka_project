// Home page: hero, mission split, team tab-slider, SDG 1/2/10 only.
import { useState } from 'react';
import { Button, Spin } from 'antd';
import { useTeam, useSdgs } from '../entities/use-content.js';

export function HomePage() {
  const { data: team = [], isLoading: teamLoading } = useTeam();
  const { data: sdgs = [], isLoading: sdgLoading } = useSdgs();
  const [active, setActive] = useState(0);
  const member = team[active];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow" style={{ color: '#ceecb6' }}>Кыргызстан · благотворительность</span>
          <h1>Добро, рождённое в горах</h1>
          <p>«Кто накормит голодного и поможет нуждающемуся — тот уже изменил мир». Садака соединяет сердца donors с семьями по всему Кыргызстану.</p>
          <div className="hero-cta">
            <Button type="primary" size="large" href="#mission">Подробнее</Button>
            <Button size="large" href="/families" style={{ background: '#fff' }}>Помочь семье</Button>
          </div>
        </div>
      </section>

      <section className="split" id="mission">
        <div className="card text-card">
          <span className="eyebrow">О проекте</span>
          <h2>Тепло сообщества — от Бишкека до Баткена</h2>
          <p>Садака — это кайрымдуулук платформа: мы собираем проверенные просьбы семей, детских домов, мечетей и интернатов. Каждая история проходит проверку координатора, а каждая помощь видна в счётчике месяца.</p>
          <p>Как горные реки питают долины, так и маленькие пожертвования — по 100, 500, 1000 сомов — превращаются в продукты, тёплую одежду и учебники для детей.</p>
          <div className="stat-row">
            <div className="stat"><b>10</b><span>семей рядом</span></div>
            <div className="stat"><b>10</b><span>точек на карте</span></div>
            <div className="stat"><b>5/5</b><span>честный лимит</span></div>
          </div>
        </div>
        <img className="side-photo" alt="Горы Кыргызстана" src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop" />
      </section>

      <section style={{ marginTop: 48 }}>
        <span className="eyebrow">Команда</span>
        <h2>Люди, которые проверяют каждую просьбу</h2>
        {teamLoading ? <Spin /> : (
          <>
            <div className="team-tabs">
              {team.map((t, i) => (
                <Button key={t.id} type={i === active ? 'primary' : 'default'} onClick={() => setActive(i)}>{t.name.split(' ')[0]}</Button>
              ))}
            </div>
            {member && (
              <div className="card team-card">
                <img src={member.photo} alt={member.name} />
                <div><span className="eyebrow">{member.role}</span><h3 style={{ fontSize: 34, margin: '6px 0' }}>{member.name}</h3><p>{member.bio}</p></div>
              </div>
            )}
          </>
        )}
      </section>

      <section style={{ marginTop: 48 }}>
        <span className="eyebrow">Цели устойчивого развития</span>
        <h2>Мы работаем по трём целям ООН</h2>
        {sdgLoading ? <Spin /> : (
          <div className="sdg-row">
            {sdgs.map((g) => (
              <div key={g.id} className={`sdg ${g.tone}`}>
                <span className="chip">{g.code}</span>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
