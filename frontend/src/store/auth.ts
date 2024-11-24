import { create } from 'zustand';
import { User } from '../services/types/user.types';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => {
  const isClient = typeof window !== 'undefined'; // Ensure it's client-side
  const storedUser = isClient ? localStorage.getItem('user') : null;

  const initialState = storedUser
    ? { isAuthenticated: true, user: JSON.parse(storedUser) }
    : { isAuthenticated: false, user: null };

  return {
    ...initialState,
    setAuth: (user: User) => {
      if (isClient) {
        localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
      }
      set({ isAuthenticated: true, user });
    },
    clearAuth: () => {
      if (isClient) {
        localStorage.removeItem('user'); // Remove user from localStorage
      }
      set({ isAuthenticated: false, user: null });
    },
  };
});

// Export store actions for external usage
export const authStoreActions = {
  setAuth: (user: User) => useAuthStore.getState().setAuth(user),
  clearAuth: () => useAuthStore.getState().clearAuth(),
};
