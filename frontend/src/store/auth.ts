import { create } from 'zustand';
import { User } from '../services/types/user.types';

type AuthStore = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => {
  const isClient = typeof window !== 'undefined'; // Ensure it's client-side
  const storedUser = isClient ? localStorage.getItem('user') : null;
  const storedToken = isClient ? localStorage.getItem('token') : null;

  const initialState =
    storedUser && storedToken
      ? {
          isAuthenticated: true,
          isAdmin: JSON.parse(storedUser).isAdmin, // Fetch isAdmin from stored user
          user: JSON.parse(storedUser),
          token: storedToken,
        }
      : { isAuthenticated: false, isAdmin: false, user: null, token: null };

  return {
    ...initialState,
    setAuth: (user: User, token: string) => {
      if (isClient) {
        localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
        localStorage.setItem('token', token); // Persist token to localStorage
      }
      set({
        isAuthenticated: true,
        isAdmin: user?.isAdmin || false,
        user,
        token,
      });
    },
    clearAuth: () => {
      if (isClient) {
        localStorage.removeItem('user'); // Remove user from localStorage
        localStorage.removeItem('token'); // Remove token from localStorage
      }
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
    },
    logout: () => {
      if (isClient) {
        localStorage.removeItem('user'); // Remove user from localStorage
        localStorage.removeItem('token'); // Remove token from localStorage
      }
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
    },
  };
});

// Export store actions for external usage
export const authStoreActions = {
  setAuth: (user: User, token: string) =>
    useAuthStore.getState().setAuth(user, token),
  clearAuth: () => useAuthStore.getState().clearAuth(),
  logout: () => useAuthStore.getState().logout(),
};
