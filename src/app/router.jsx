// Router: createBrowserRouter with loaders + useLoaderData prefetch.
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { FamiliesPage } from '../pages/FamiliesPage.jsx';
import { FamilyProfilePage } from '../pages/FamilyProfilePage.jsx';
import { CharityPage } from '../pages/CharityPage.jsx';
import { LoginPage, RegisterPage } from '../pages/AuthPages.jsx';
import { api } from '../shared/mock-api.js';

async function familiesLoader({ request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  try { return (await api.get('/families', { params })).data; }
  catch { return []; }
}

async function familyLoader({ params }) {
  try { return (await api.get(`/families/${params.id}`)).data; }
  catch { return null; }
}

async function charityLoader({ request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  try { return (await api.get('/charity-points', { params: type ? { type } : {} })).data; }
  catch { return []; }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'families', element: <FamiliesPage />, loader: familiesLoader },
      { path: 'families/:id', element: <FamilyProfilePage />, loader: familyLoader },
      { path: 'charity', element: <CharityPage />, loader: charityLoader },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
