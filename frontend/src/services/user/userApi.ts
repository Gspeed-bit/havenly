import { apiHandler } from '@/config/server';
import { User } from '@/services/types/user.types';
import { ApiResponse } from '@/config/server';
import { useUserStore } from '@/store/users';

export const getLoggedInUser = async (): Promise<ApiResponse<User>> => {
  return apiHandler<User>('/user/me', 'GET');
};

export const fetchAllUsersApi = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user', 'GET');
};

export const fetchAllAdminsApi = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user/admin', 'GET');
};

export const updateUserProfile = async (
  data: object
): Promise<ApiResponse<User>> => {
  try {
    // Make the API call to update the user profile
    const response = await apiHandler<User>('/user/update', 'PUT', data);

    if (response.status === 'success') {
      // Once the response is successful, update Zustand store with new user data
      useUserStore.getState().setUser(response.data as User);
    }

    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Request admin pin
export const requestAdminPin = async (): Promise<ApiResponse<User>> => {
  return await apiHandler('/user/request-pin', 'POST');
};

export const confirmAdminUpdate = async (
  pin: string,
  updates: object
): Promise<ApiResponse<User>> => {
  return await apiHandler('/user/confirm-update', 'POST', { pin, updates });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<User>> => {
  return await apiHandler('/user/confirm-password', 'POST', {
    currentPassword,
    newPassword,
  });
};


