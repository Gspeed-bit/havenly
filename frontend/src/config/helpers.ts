export const isBrowser = () => typeof window !== 'undefined';

export const authTokenKey = 'authToken';

export const setAuthToken = (token: string) => {
  if (isBrowser()) {
    localStorage.setItem(authTokenKey, token); // Save token in localStorage
  }
};

export const getAuthToken = (): string | null => {
  if (isBrowser()) {
    return localStorage.getItem(authTokenKey); // Retrieve token from localStorage
  }
  return null; // Return null if not in browser
};

export const clearAuthToken = () => {
  if (isBrowser()) {
    localStorage.removeItem(authTokenKey); // Clear the token from localStorage
  }
};
