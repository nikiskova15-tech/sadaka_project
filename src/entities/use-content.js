// React Query hooks: charity points, team, SDGs, auth, donations.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../shared/mock-api.js';
import { useAuthStore } from '../app/stores.js';

export function useCharityPoints(type) {
  return useQuery({
    queryKey: ['charity-points', type || 'all'],
    queryFn: async () => (await api.get('/charity-points', { params: type && type !== 'all' ? { type } : {} })).data,
  });
}

export function useTeam() {
  return useQuery({ queryKey: ['team'], queryFn: async () => (await api.get('/team')).data });
}

export function useSdgs() {
  return useQuery({ queryKey: ['sdgs'], queryFn: async () => (await api.get('/sdgs')).data });
}

export function useMe(enabled) {
  const setSession = useAuthStore((s) => s.setSession);
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const me = (await api.get('/me')).data;
      setSession(me, localStorage.getItem('sadaka_token'));
      return me;
    },
    enabled,
    retry: false,
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p) => (await api.post('/auth/register', p)).data,
    onSuccess: (res) => { setSession(res.user, res.token); qc.invalidateQueries({ queryKey: ['me'] }); },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p) => (await api.post('/auth/login', p)).data,
    onSuccess: (res) => { setSession(res.user, res.token); qc.invalidateQueries({ queryKey: ['me'] }); },
  });
}

export function useDonate() {
  return useMutation({
    mutationFn: async (p) => (await api.post('/donations', p)).data,
  });
}
