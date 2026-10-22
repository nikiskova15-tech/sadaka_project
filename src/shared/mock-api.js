// Final axios adapter: list routes + family routes + misc routes.
import { api, handle, fail } from './client.js';
import { handleFamilyRoutes } from './mock-family-routes.js';
import { handleMiscRoutes } from './mock-misc-routes.js';

api.defaults.adapter = async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = new URL(config.url, 'http://mock');
  const path = url.pathname;
  const params = { ...(config.params || {}) };
  let body = config.data;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  // Family list lives in client.js handle().
  if (method === 'get' && path === '/families') {
    const res = await handle(config);
    return { ...res, config, headers: {} };
  }
  const fam = await handleFamilyRoutes(method, path, body, config);
  if (fam) return { ...fam, config, headers: {} };
  const misc = await handleMiscRoutes(method, path, params, body, config);
  if (misc) return { ...misc, config, headers: {} };
  return fail('Неизвестный маршрут', 'NOT_FOUND', 404);
};

export { api };
export { TOKEN_KEY, apiErrorMessage, isHelpLimitError, HELP_LIMIT } from './client.js';
