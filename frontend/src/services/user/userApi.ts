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
