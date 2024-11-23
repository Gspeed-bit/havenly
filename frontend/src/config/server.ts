import axios, { AxiosError } from 'axios';
import keys from './keys';
import { logOutUser } from '../services/auth';

// types/apiResponse.types.ts

// SuccessResponse will be used when the API responds with success
export interface SuccessResponse<T> {
  status: 'success';
  data: T; // This is where the actual data from the API response goes
}

// ErrorResponse is used when the API responds with an error
export interface ErrorResponse {
  status: 'error';
  message: string; // Message to be shown in case of an error
  code?: string; // Optional error code, useful for debugging or specific error handling
}

// ApiResponse unifies both success and error responses to keep everything consistent
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Axios instance configuration
const instance = axios.create({
  baseURL: `${keys().serverUrl}`, // API base URL
  auth: keys().serverAuth, // Authorization for API
});

// This handler function simplifies API calls and keeps error handling consistent
export const apiHandler = async <T>(
  url: string,
  method: string,
  data: object = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await instance({
      method, // POST, GET, etc.
      url,
      data, // The request body, like the username and password
      headers: { 'Content-Type': 'application/json' }, // Always send JSON data
    });

    // If response is successful, return the success response with the data
    return {
      status: 'success',
      data: response.data, // This will contain the actual response data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If it's an Axios error, we handle it here
      const axiosError = error as AxiosError<ErrorResponse>; // Specify the error response type

      // If status is 401, logout the user
      if (axiosError.response?.status === 401) {
        logOutUser(); // Clear the auth token and state
      }

      // Returning the error response in a consistent format
      return {
        status: 'error',
        message:
          axiosError.response?.data?.message || 'An unexpected error occurred',
        code: axiosError.response?.status?.toString(),
      };
    }

    // If the error is not an Axios error, handle it generically
    return {
      status: 'error',
      message: 'An unexpected error occurred',
    };
  }
};
