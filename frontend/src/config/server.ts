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

// Retrieve the token from localStorage and set it in the Authorization header
const getToken = () => localStorage.getItem('authToken'); // Replace with your token storage retrieval

export const apiHandler = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: object | FormData,
  params: object = {},
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getToken(); // Retrieve token from localStorage
    console.log('Using token:', token); // Debug the token value

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
      console.error('Axios error:', axiosError.response?.data); // Debug Axios error
      if (axiosError.response?.status === 401) {
        logOutUser(); // Handle unauthorized access
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
