// Mock route handlers: charity points, team, SDGs, auth, donations.
import { db, tokenFor, userFromAuth, fail, okRes } from './client.js';

const clone = (v) => JSON.parse(JSON.stringify(v));

export async function handleMiscRoutes(method, path, params, body, config) {
  if (method === 'get' && path === '/charity-points') {
    let list = [...db.points];
    if (params.type) list = list.filter((p) => p.type === params.type);
    return okRes(clone(list));
  }
  if (method === 'get' && path === '/team') return okRes(clone(db.team));
  if (method === 'get' && path === '/sdgs') return okRes(clone(db.sdgs));
  if (method === 'post' && path === '/auth/register') {
    const { name, email, password } = body || {};
    if (!name || !email || !password) return fail('Заполните все поля', 'VALIDATION', 422);
    if (db.users.some((u) => u.email === email)) return fail('Такой email уже зарегистрирован', 'EXISTS', 409);
    const user = { id: `u${Date.now()}`, name, email, password };
    db.users.push(user);
    return okRes({ token: tokenFor(user), user: { id: user.id, name, email } }, 201);
  }
  if (method === 'post' && path === '/auth/login') {
    const { email, password } = body || {};
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) return fail('Неверный email или пароль', 'UNAUTHORIZED', 401);
    return okRes({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } });
  }
  if (method === 'get' && path === '/me') {
    const user = userFromAuth(config.headers);
    if (!user) return fail('Нет сессии', 'UNAUTHORIZED', 401);
    return okRes({ id: user.id, name: user.name, email: user.email });
  }
  if (method === 'post' && path === '/donations') {
    const user = userFromAuth(config.headers);
    if (!user) return fail('Войдите, чтобы помочь', 'UNAUTHORIZED', 401);
    if (Number(body?.amount) <= 0) return fail('Укажите сумму', 'VALIDATION', 422);
    return okRes({ receipt: `D-${Date.now()}` }, 201);
  }
  return null;
}
