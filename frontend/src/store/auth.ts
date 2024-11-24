import { create } from 'zustand';
import { User } from '../services/types/user.types';

// Define types for the authentication store
type AuthStore =
  | {
      isAuthenticated: true;
      user: User;
    setAuth: (user: User) => void;
    clearAuth: () => void;
  }
  | {
      isAuthenticated: false | null;
      user: null;
      setAuth: (user: User) => void;
      clearAuth: () => void;
    };

// Create Zustand store for managing authentication state
export const useAuthStore = create<AuthStore>((set) => {
  const storedUser = localStorage.getItem('user');
  const initialState = storedUser
    ? { isAuthenticated: true, user: JSON.parse(storedUser) }
    : { isAuthenticated: false, user: null };

  return {
    ...initialState,
    setAuth: (user: User) => {
      localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
      set({ isAuthenticated: true, user });
    },
    clearAuth: () => {
      localStorage.removeItem('user'); // Remove user from localStorage
      set({ isAuthenticated: false, user: null });
    },
  };
});

export const authStoreActions = {
  setAuth: (user: User) => useAuthStore.getState().setAuth(user),
  clearAuth: () => useAuthStore.getState().clearAuth(),
};
