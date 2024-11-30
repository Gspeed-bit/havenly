import { apiHandler } from "@/config/server";
import { User } from "../types/user.types";

export const getUserInfo = async (): Promise<User | null> => {
  try {
    const response = await apiHandler<User>('/user/me', 'GET');

    if (response.status === 'success') {
      // The response.data will now include the imgUrl
      const user = response.data;
      return user;
    } else {
      console.error('Failed to fetch user data:', response.message);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching user data:', error);
    return null;
  }
};
