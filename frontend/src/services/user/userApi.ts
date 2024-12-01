import { apiHandler, ApiResponse } from '@/config/server';
import { User } from '../types/user.types';
import { getAuthToken } from '@/config/helpers';

// src/lib/api/user.ts

export const fetchUser = async () => {
  const token = getAuthToken();
  console.log(token);

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch('/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
};

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user', 'GET');
};

export const getAllAdmins = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user/admin', 'GET');
};
