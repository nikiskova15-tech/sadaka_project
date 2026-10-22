// Mock route handlers: family detail, needs, money + goods help.
import { db, HELP_LIMIT, userFromAuth, fail, okRes } from './client.js';

const clone = (v) => JSON.parse(JSON.stringify(v));

export async function handleFamilyRoutes(method, path, body, config) {
  const famMatch = path.match(/^\/families\/([\w-]+)$/);
  if (method === 'get' && famMatch) {
    const f = db.families.find((x) => x.id === famMatch[1]);
    if (!f) return fail('Семья не найдена', 'NOT_FOUND', 404);
    return okRes(clone(f));
  }
  const needMatch = path.match(/^\/families\/([\w-]+)\/needs$/);
  if (method === 'post' && needMatch) {
    const f = db.families.find((x) => x.id === needMatch[1]);
    if (!f) return fail('Семья не найдена', 'NOT_FOUND', 404);
    const label = String(body?.label || '').trim();
    if (label.length < 3) return fail('Опишите нужду подробнее', 'VALIDATION', 422);
    f.needs.push({ id: `n${Date.now()}`, label, category: body?.category || 'other' });
    f.updatedAt = new Date().toISOString();
    return okRes(clone(f), 201);
  }
  const moneyMatch = path.match(/^\/families\/([\w-]+)\/help-money$/);
  if (method === 'post' && moneyMatch) {
    const user = userFromAuth(config.headers);
    if (!user) return fail('Войдите, чтобы помочь', 'UNAUTHORIZED', 401);
    const f = db.families.find((x) => x.id === moneyMatch[1]);
    if (!f) return fail('Семья не найдена', 'NOT_FOUND', 404);
    if (f.monthlyHelpCount >= HELP_LIMIT) return fail('Лимит 5 помощей в месяц исчерпан', 'HELP_LIMIT', 409);
    if (!body?.method || Number(body?.amount) <= 0) return fail('Укажите сумму и способ оплаты', 'VALIDATION', 422);
    f.monthlyHelpCount += 1;
    return okRes({ family: clone(f), receipt: `M-${Date.now()}` }, 201);
  }
  const goodsMatch = path.match(/^\/families\/([\w-]+)\/help-goods$/);
  if (method === 'post' && goodsMatch) {
    const user = userFromAuth(config.headers);
    if (!user) return fail('Войдите, чтобы помочь', 'UNAUTHORIZED', 401);
    const f = db.families.find((x) => x.id === goodsMatch[1]);
    if (!f) return fail('Семья не найдена', 'NOT_FOUND', 404);
    if (f.monthlyHelpCount >= HELP_LIMIT) return fail('Лимит 5 помощей в месяц исчерпан', 'HELP_LIMIT', 409);
    if (Number(body?.weightKg) <= 0 || !body?.delivery) return fail('Укажите вес и доставку', 'VALIDATION', 422);
    f.monthlyHelpCount += 1;
    return okRes({ family: clone(f), receipt: `G-${Date.now()}` }, 201);
  }
  return null;
}
