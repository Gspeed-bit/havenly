import axios, { AxiosError } from 'axios';
import keys from './keys';
import { logOutUser } from '../services/auth/auth';

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
  auth: keys().serverAuth,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiHandler = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: object,
  params: object = {},
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await instance({
      url,
      method,
      data,
      params,
      headers: { ...instance.defaults.headers.common, ...customHeaders },
    });

    return {
      status: 'success',
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Handle 429 error (rate-limiting)
      if (axiosError.response?.status === 429) {
        return {
          status: 'error',
          message: 'Too many requests, please try again later.',
          code: '429',
        };
      }

      // Handle other errors like 401
      if (axiosError.response?.status === 401) {
        logOutUser();
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
