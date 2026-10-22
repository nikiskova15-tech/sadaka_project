// Providers: Ant Design theme override + React Query client + router.
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import './global.scss';
import './sections.scss';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

export function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#89ac76', borderRadius: 14, fontFamily: 'Inter, system-ui, sans-serif' } }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
