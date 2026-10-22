// Zustand stores: auth session, map drawer, help wizard UI state.
import { create } from 'zustand';
import { TOKEN_KEY } from '../shared/mock-api.js';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  setSession: (user, token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));

export const useMapStore = create((set) => ({
  selectedId: null,
  drawerOpen: false,
  select: (id) => set({ selectedId: id, drawerOpen: Boolean(id) }),
  close: () => set({ drawerOpen: false, selectedId: null }),
}));

export const useHelpStore = create((set) => ({
  step: 0,
  payMethod: 'MBANK',
  delivery: 'Glovo',
  limitModalOpen: false,
  set: (patch) => set(patch),
  reset: () => set({ step: 0, payMethod: 'MBANK', delivery: 'Glovo' }),
}));
