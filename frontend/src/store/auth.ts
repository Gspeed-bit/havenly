import { create } from 'zustand';
import { User } from '../services/types/user.types';

// Define types for the authentication store
type AuthStore =
  | {
      isAuthenticated: true;
      user: User;
    }
  | {
      isAuthenticated: false | null;
      user: null;
    };

// Create Zustand store for managing authentication state
export const useAuthStore = create<AuthStore>(() => ({
  isAuthenticated: null,
  user: null,
}));

// Actions to manage authentication state
export const authStoreActions = {
  setAuth: (user: User) => {
    useAuthStore.setState({ isAuthenticated: true, user });
  },
  clearAuth: () => {
    useAuthStore.setState({ isAuthenticated: false, user: null });
  },
};
