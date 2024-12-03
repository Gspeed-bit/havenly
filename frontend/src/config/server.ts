import axios, { AxiosError } from 'axios';
import keys from './keys';
import { logOutUser } from '../services/auth/auth';
import { getAuthToken, clearAuthToken } from './helpers';

export interface SuccessResponse<T> {
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


export const apiHandler = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: object | FormData,
  params: object = {},
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken(); // Correctly retrieve token from localStorage
    const isFormData = data instanceof FormData;

    const response = await instance({
      url,
      method,
      data,
      params,
      headers: {
        ...instance.defaults.headers.common,
        Authorization: token ? `Bearer ${token}` : '', // Add token to Authorization header
        ...customHeaders,
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    });

    return {
      status: 'success',
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        logOutUser(); // Handle unauthorized access
        clearAuthToken(); // Clear invalid token
        window.location.href = '/auth/login'; // Redirect to login
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
