import { apiHandler } from '@/config/server';
import { User } from '@/services/types/user.types';
import { ApiResponse } from '@/config/server';

export const fetchUserApi = async (): Promise<ApiResponse<User>> => {
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
  return await apiHandler('/user/update', 'PUT', data);
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
