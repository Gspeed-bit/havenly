import { create } from 'zustand';
import { User } from '../services/types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  fetchUserData: () => void;
  clearUserData: () => void; // New method to clear user data
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  fetchUserData: async () => {
    try {
      const response = await fetch('/api/user/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({ user: data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
  clearUserData: () => set({ user: null, isAuthenticated: false }),
}));
