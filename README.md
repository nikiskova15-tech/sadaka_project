# Sadaka — Кайрымдуулук платформасы

Charity donation SPA for Kyrgyzstan. Russian UI copy; code and comments in English.

## Stack
Vite + React 19, react-router-dom v7 (createBrowserRouter), Ant Design 6,
TanStack Query 5, Zustand 5, Axios 1, Sass.

## Run
```bash
npm install
npm run dev
```
Open the printed localhost URL. Home `/` renders immediately.

## Mock backend
No live server needed. `src/shared/mock-*.js` exposes an axios adapter with
latency that implements the course REST contract:
`GET /families`, `GET /families/:id`, `POST /families/:id/needs`,
`POST /families/:id/help-money`, `POST /families/:id/help-goods`,
`GET /charity-points`, `GET /team`, `GET /sdgs`,
`POST /auth/register`, `POST /auth/login`, `GET /me`, `POST /donations`.
Data resets on reload. Help fails with `HELP_LIMIT` after 5/month.

## Demo login
Email `donor@sadaka.kg`, password `sadaka123`.

## Routes
`/` home, `/families`, `/families/:id`, `/charity`, `/login`, `/register`.
Filters live in `useSearchParams` and feed React Query keys.

