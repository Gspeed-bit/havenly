import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import keys from './keys';

import { getAuthToken } from './helpers';
import { authStoreActions } from '@/store/auth';
import { useUserStore } from '@/store/users';

export interface SuccessResponse<T> {
  message: string;
  status: 'success';
  data: T;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

const instance = axios.create({
  baseURL: keys().serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await authStoreActions.logout();
      useUserStore.getState().clearUser();

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiHandler = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: object | FormData,
  params: object = {},
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const isFormData = data instanceof FormData;
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers: {
        ...customHeaders,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    };

    const response = await instance(config);

    return {
      status: 'success',
      message: response.data.message || 'Request successful',
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Handle 401 errors (although they should be caught by the interceptor)
      if (axiosError.response?.status === 401) {
        await authStoreActions.logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }

      return {
        status: 'error',
        message:
          axiosError.response?.data?.message || 'An unexpected error occurred',
        code: axiosError.response?.status?.toString(),
      };
    }

    return {
      status: 'error',
      message: 'An unexpected error occurred',
    };
  }
};
