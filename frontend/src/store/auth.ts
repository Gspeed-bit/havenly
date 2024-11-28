import { create } from 'zustand';
import { User } from '../services/types/user.types';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  timeLeft: number;
  isCodeExpired: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
  logout: () => void;
  setCountdown: (time: number) => void; // Set countdown time
  setCodeExpired: (expired: boolean) => void; // Set if the code is expired
  resetCountdown: () => void; // Reset countdown
};

export const useAuthStore = create<AuthStore>((set) => {
  const isClient = typeof window !== 'undefined'; // Ensure it's client-side

  // Initialize stored user and countdown state from sessionStorage or localStorage
  const storedUser = isClient ? localStorage.getItem('user') : null;
  const storedTimeLeft = isClient ? sessionStorage.getItem('timeLeft') : null;
  const storedIsCodeExpired = isClient
    ? sessionStorage.getItem('isCodeExpired')
    : null;

  const initialState = storedUser
    ? { isAuthenticated: true, user: JSON.parse(storedUser) }
    : { isAuthenticated: false, user: null };

  const countdownState = storedTimeLeft
    ? {
        timeLeft: Number(storedTimeLeft),
        isCodeExpired: JSON.parse(storedIsCodeExpired || 'false'),
      }
    : { timeLeft: 0, isCodeExpired: false };

  return {
    ...initialState,
    ...countdownState,
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
    logout: () => {
      if (isClient) {
        localStorage.removeItem('user'); // Clear user from localStorage
      }
      set({ isAuthenticated: false, user: null });
    },
    setCountdown: (time: number) => {
      if (isClient) {
        sessionStorage.setItem('timeLeft', String(time)); // Persist timeLeft to sessionStorage
      }
      set({ timeLeft: time });
    },
    setCodeExpired: (expired: boolean) => {
      if (isClient) {
        sessionStorage.setItem('isCodeExpired', JSON.stringify(expired)); // Persist isCodeExpired to sessionStorage
      }
      set({ isCodeExpired: expired });
    },
    resetCountdown: () => {
      if (isClient) {
        sessionStorage.removeItem('timeLeft'); // Remove timeLeft from sessionStorage
        sessionStorage.removeItem('isCodeExpired'); // Remove isCodeExpired from sessionStorage
      }
      set({ timeLeft: 0, isCodeExpired: false });
    },
  };
});

// Export store actions for external usage
export const authStoreActions = {
  setAuth: (user: User) => useAuthStore.getState().setAuth(user),
  clearAuth: () => useAuthStore.getState().clearAuth(),
  setCountdown: (time: number) => useAuthStore.getState().setCountdown(time),
  setCodeExpired: (expired: boolean) =>
    useAuthStore.getState().setCodeExpired(expired),
  resetCountdown: () => useAuthStore.getState().resetCountdown(),
};
