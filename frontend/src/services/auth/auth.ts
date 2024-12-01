import { authStoreActions } from '../../store/auth';
import {
  setAuthToken,
  isBrowser,
  getAuthToken,
  authTokenKey,
} from '../../config/helpers';
import { apiHandler, ApiResponse } from '../../config/server';
import {
  LoginCredentials,
  LoginResponse,
  User,
  VerificationCodeResponse,
  VerifyAccountResponse,
} from '../types/user.types';
import { SignUpRequest, SignUpResponse } from '../types/user.types';

export const logOutUser = () => {
  localStorage.removeItem(authTokenKey);
  window.location.href = '/auth/login'; // Redirect to login page
};

export const login = async (loginData: LoginCredentials) => {
  const response = await apiHandler<LoginResponse>('/login', 'POST', loginData);

  if (response.status === 'success') {
    const { token, user } = response.data;

    if (isBrowser()) {
      setAuthToken(token);
      console.log('Token stored in localStorage:', getAuthToken()); // Debugging log
    }
    localStorage.setItem('authToken', response.data.token);
    console.log('Login successful, token saved to localStorage');

    authStoreActions.setAuth(user as User);
    return { status: 'success', message: 'Login successful' };
  } else {
    return { status: 'error', message: response.message || 'Login failed' };
  }
};

// Signup function
export const signUp = async (
  userData: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    const response = await apiHandler<SignUpResponse>(
      '/register',
      'POST',
      userData
    );
    if (response.status === 'success') {
      return { status: 'success', message: response.data.message };
    } else {
      return { status: 'error', message: response.message || 'Signup failed' };
    }
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'An unexpected error occurred.' };
  }
};

export const verifyAccount = async (data: {
  email: string;
  verificationCode: string;
}): Promise<ApiResponse<VerifyAccountResponse>> => {
  return apiHandler<VerifyAccountResponse>('/verify', 'POST', data);
};

// API to request a new code
export const requestNewVerificationCode = async (
  email: string
): Promise<ApiResponse<VerificationCodeResponse>> => {
  try {
    return await apiHandler<VerificationCodeResponse>(
      '/verification-code/request',
      'POST',
      { email }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      // If rate limit exceeded, propagate the error with a custom message
      throw new Error('Too many requests, please try again later.');
    } else {
      // For other errors, throw a generic message or log them
      throw new Error(
        error?.response?.data?.message || 'An unexpected error occurred.'
      );
    }
  }
};

export const requestResetPassword = async (email: string) => {
  return apiHandler<ApiResponse<{ message: string }>>(
    '/request-reset-password',
    'POST',
    { email }
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  return apiHandler<ApiResponse<{ message: string }>>(
    `reset-password/${token}`,
    'POST',
    { newPassword }
  );
};
