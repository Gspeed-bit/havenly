import { apiHandler, ApiResponse } from "@/config/server";
import { User } from "../types/user.types";
import { getAuthToken } from "@/config/helpers";




// Function to fetch the current user details
export const getUserDetails = async () => {
  const token = getAuthToken(); // Get token from localStorage

  if (!token) {
    console.error('No token found');
    return;
  }

  const response = await apiHandler<{ data: User }>(
    '/user/me',
    'GET',
    undefined,
    {},
    {
      Authorization: `Bearer ${token}`, // Pass token in header
    }
  );

  if (response.status === 'success') {
    console.log('User details:', response.data);
    return response.data; // This will be the user details
  } else {
    console.error('Error fetching user details:', response.message);
  }
};




export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user', 'GET');
};

export const getAllAdmins = async (): Promise<ApiResponse<User[]>> => {
  return apiHandler<User[]>('/user/admin', 'GET');
};
