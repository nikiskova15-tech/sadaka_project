// React Query hooks: families list + detail with filter-aware keys.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../shared/mock-api.js';

export function useFamilies(filters) {
  const { q, age, gender, city } = filters;
  return useQuery({
    queryKey: ['families', { q, age, gender, city }],
    queryFn: async () => (await api.get('/families', { params: { q, age, gender, city } })).data,
  });
}

export function useFamily(id) {
  return useQuery({
    queryKey: ['family', id],
    queryFn: async () => (await api.get(`/families/${id}`)).data,
    enabled: Boolean(id),
  });
}

export function useAddNeed(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post(`/families/${id}/needs`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family', id] });
      qc.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

export function useMoneyHelp(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post(`/families/${id}/help-money`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family', id] });
      qc.invalidateQueries({ queryKey: ['families'] });
    },
  });
}

export function useGoodsHelp(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post(`/families/${id}/help-goods`, payload)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['family', id] });
      qc.invalidateQueries({ queryKey: ['families'] });
    },
  });
}
