export const isBrowser = () => typeof window !== 'undefined';

const authTokenKey = 'token';

export const getAuthToken = () =>
  isBrowser() ? localStorage.getItem(authTokenKey) : null;
export const setAuthToken = (token: string) =>
  isBrowser() && localStorage.setItem(authTokenKey, token);
export const clearAuthToken = () =>
  isBrowser() && localStorage.removeItem(authTokenKey);
