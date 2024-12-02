import { apiHandler } from '@/config/server';
import { User } from '@/services/types/user.types';
import { ApiResponse } from '@/config/server';

export const fetchUserApi = async (): Promise<ApiResponse<{ data: User }>> => {
  return apiHandler<{ data: User }>('/user/me', 'GET');
};

export const fetchAllUsersApi = async (): Promise<
  ApiResponse<{ data: User[] }>
> => {
  return apiHandler<{ data: User[] }>('/user', 'GET');
};


export const fetchAllAdminsApi = async (): Promise<
  ApiResponse<{ data: User[] }>
> => {
  return apiHandler<{ data: User[] }>('/user/admin', 'GET');
};
