export const isBrowser = () => typeof window !== 'undefined';

export const authTokenKey = 'token';


export const getAuthToken = () =>
  isBrowser() && localStorage.getItem(authTokenKey);

export const setAuthToken = (token: string) =>
  localStorage.setItem(authTokenKey, token);

export const clearAuthToken = () => localStorage.removeItem(authTokenKey);

