import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken, clearAuthToken } from '../config/helpers';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      setAuth: (token: string) => {
        setAuthToken(token);
        set({ isAuthenticated: true, token });
      },
      clearAuth: () => {
        clearAuthToken();
        set({ isAuthenticated: false, token: null });
      },
      logout: async () => {
        get().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const authStoreActions = {
  setAuth: (token: string) => useAuthStore.getState().setAuth(token),
  clearAuth: () => useAuthStore.getState().clearAuth(),
  logout: () => useAuthStore.getState().logout(),
};
