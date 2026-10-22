// App layout: sticky header with brand lockup, nav tabs, auth state, footer.
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAuthStore } from './stores.js';

export function Layout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark">◭</span>
            <span><span className="brand-name">САДАКА</span><br /><span className="brand-sub">Кайрымдуулук платформасы</span></span>
          </Link>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Главная</NavLink>
            <NavLink to="/families" className={({ isActive }) => (isActive ? 'active' : '')}>Помощь семьям</NavLink>
            <NavLink to="/charity" className={({ isActive }) => (isActive ? 'active' : '')}>Благотворительность</NavLink>
            <a href="/#about">О нас</a>
          </nav>
          <span className="lang-pill">RU | KG</span>
          {user ? (
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <b>{user.name}</b>
              <Button size="small" onClick={() => { logout(); navigate('/'); }}>Выйти</Button>
            </span>
          ) : (
            <span style={{ display: 'flex', gap: 8 }}>
              <Button size="small" onClick={() => navigate('/login')}>Войти</Button>
              <Button size="small" type="primary" onClick={() => navigate('/register')}>Регистрация</Button>
            </span>
          )}
        </div>
      </header>
      <Outlet />
      <footer className="footer" id="about">
        <div>
          <div className="brand"><span className="brand-mark">◭</span><span><span className="brand-name">САДАКА</span><br /><span className="brand-sub">Кайрымдуулук платформасы</span></span></div>
          <p>Платформа соединяет жертвователей с семьями, детскими домами, мечетями и интернатами по всему Кыргызстану.</p>
          <small>hello@sadaka.kg · +996 555 010 203 · Бишкек</small>
        </div>
        <div><h4>Направления</h4><p>Помощь семьям<br />Детские дома<br />Мечети<br />Интернаты</p></div>
        <div><h4>Мы на связи</h4><p>Instagram · Telegram · WhatsApp<br />Отчёты каждый месяц</p><small>Сделано с теплом в Кыргызстане</small></div>
      </footer>
    </>
  );
}
