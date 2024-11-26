import { authStoreActions, useAuthStore } from '../store/auth';
import { setAuthToken, isBrowser } from '../config/helpers';
import { apiHandler, ApiResponse } from '../config/server';
import { LoginCredentials, LoginResponse, User, VerificationCodeResponse, VerifyAccountResponse } from './types/user.types';
import { SignUpRequest, SignUpResponse } from './types/user.types';


// Log the user out: clear token and reset auth state
export const logOutUser = () => {
  useAuthStore.getState().logout(); // Call the logout method
};


// Login function
export const login = async (loginData: LoginCredentials) => {
  const response = await apiHandler<LoginResponse>('/login', 'POST', loginData);

  if (response.status === 'success') {
    const { token, user } = response.data;

    if (isBrowser()) {
      setAuthToken(token);
    }
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
    console.log(error)
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
  return apiHandler<VerificationCodeResponse>(
    '/verification-code/request',
    'POST',
    { email }
  );
};


