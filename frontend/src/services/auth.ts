import { authStoreActions } from '../store/auth';
import { clearAuthToken, isBrowser } from '../config/helpers';

// Log the user out: clear token and reset auth state, only if in the browser
export const logOutUser = () => {
  if (isBrowser()) {
    clearAuthToken();
  }
  authStoreActions.clearAuth();
};
