import { clearAuthToken, isBrowser, setAuthToken } from '../config/helpers';
import { apiHandler } from '../config/server';
import { useAuthStore } from '../store/auth';
import { LoginCredentials, LoginResponse, User } from './types/user.types';

// Log the user out: clear token and reset auth state, only if in the browser
export const logOutUser = () => {
  if (isBrowser()) {
    clearAuthToken();
  }
  // Access Zustand store using the hook
  useAuthStore.getState().clearAuth(); // Clear auth state
};

// Login function
export const login = async (credentials: LoginCredentials) => {
  // Call the apiHandler to send credentials to the backend
  const response = await apiHandler<LoginResponse>(
    '/login',
    'POST',
    credentials
  );

  // Handle the response from the API
  if (response.status === 'success') {
    const { token, user } = response.data;

    // Store the token and user data in the browser (localStorage and Zustand store)
    setAuthToken(token); // Save the token in localStorage
    useAuthStore.getState().setAuth(user as User); // Store user data in Zustand store
    return { status: 'success', message: 'Login successful' };
  } else {
    // Handle login error
    return { status: 'error', message: response.message || 'Login failed' };
  }
};

