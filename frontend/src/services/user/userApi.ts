import { apiHandler, ApiResponse } from "@/config/server";
import { User } from "../types/user.types";

// Function to fetch the current user details
export const getUserDetails = async () => {
  const token = localStorage.getItem('token');  // Get token from localStorage

  if (!token) {
    console.error('No token found');
    return null;  // Token is missing, return null
  }

  const response = await apiHandler<{ data: User }>('/user/me', 'GET', undefined, {}, {
    Authorization: `Bearer ${token}`, // Pass token in header
  });

  if (response.status === 'success') {
    return response.data; // Return the user data from API response
  } else {
    console.error('Error fetching user details:', response.message);
    return null;
  }
};




export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user', 'GET');
};

export const getAllAdmins = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user/admin', 'GET');
};
