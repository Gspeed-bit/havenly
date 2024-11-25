import { authStoreActions, useAuthStore } from '../store/auth';
import { setAuthToken, isBrowser } from '../config/helpers';
import { apiHandler } from '../config/server';
import { LoginCredentials, LoginResponse, User } from './types/user.types';


// Log the user out: clear token and reset auth state
export const logOutUser = () => {
  useAuthStore.getState().logout(); // Call the logout method
};


// Login function
export const login = async (credentials: LoginCredentials) => {
  const response = await apiHandler<LoginResponse>(
    '/login',
    'POST',
    credentials
  );

  if (response.status === 'success') {
    const { token, user } = response.data;

    if (isBrowser()) {
      setAuthToken(token);
    }
    authStoreActions.setAuth(user as User);
    return { status: 'success', message: 'Login successful' };
  } else {
    return { status: 'error', message: response.message || 'Login failed' };
  }
};
