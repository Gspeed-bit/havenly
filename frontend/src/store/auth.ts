import { create } from 'zustand';
import { User } from '../services/types/user.types';

// Define types for the authentication store
type AuthStore = {
  isAuthenticated: boolean; // boolean, indicating whether the user is authenticated or not
  user: User | null; // The user object or null if not authenticated
  setAuth: (user: User) => void; // Function to set authenticated user
  clearAuth: () => void; // Function to clear authentication state
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
