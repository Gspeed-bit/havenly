import { apiHandler, ApiResponse } from "@/config/server";
import { UserProfileUpdateResponse } from "../types/user.types";


// API to update user profile
export const updateUserProfile = async (
  data: FormData
): Promise<ApiResponse<UserProfileUpdateResponse>> => {
  try {
    const response = await apiHandler<UserProfileUpdateResponse>(
      '/user/update',
      'PUT',
      data,
      {},
      { 'Content-Type': 'multipart/form-data' }
    );
    return response;
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'An unexpected error occurred' };
  }
};
