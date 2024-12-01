export const isBrowser = () => typeof window !== 'undefined';

export const authTokenKey = 'token';

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token); // Save token in localStorage
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken'); // Retrieve token from localStorage
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken'); // Clear the token from localStorage
};