// Final axios adapter: builds one request object and dispatches it to the route modules.
import { api, fail, wait } from './client.js';
import { userFromAuth } from './mock-db.js';
import { readHeader } from './mock-serializers.js';
import { handleFamilyRoutes } from './mock-family-routes.js';
import { handleMiscRoutes } from './mock-misc-routes.js';
import { LANGS, DEFAULT_LANG, MOCK_LATENCY_MS } from './config.js';

api.defaults.adapter = async (config) => {
  await wait(MOCK_LATENCY_MS);

  const url = new URL(config.url, 'http://mock');
  let body = config.data;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const headerLang = String(readHeader(config.headers, 'Accept-Language') || '').slice(0, 2);
  const req = {
    method: (config.method || 'get').toLowerCase(),
    path: url.pathname,
    params: { ...(config.params || {}) },
    body,
    headers: config.headers,
    lang: LANGS.includes(headerLang) ? headerLang : DEFAULT_LANG,
    user: userFromAuth(config.headers),
  };

  const res = (await handleFamilyRoutes(req)) || (await handleMiscRoutes(req));
  if (!res) fail('Route not found', 'NOT_FOUND', 404);
  return { ...res, config, headers: {} };
};

export { api };
export { TOKEN_KEY, HELP_LIMIT, apiErrorMessage, apiErrorCode, isHelpLimitError } from './client.js';