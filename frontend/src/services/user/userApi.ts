
import keys from '@/config/keys';
import { User } from '../types/user.types';
import { getAuthToken } from '@/config/helpers';


export const getUser = async (): Promise<User | null> => {
  const token = getAuthToken();  // Retrieve the token from localStorage

  if (!token) {
    console.warn('No authentication token found.');
    return null;
  }

  try {
    const response = await fetch(`${keys().serverUrl}/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user data:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.data || null; // Assuming the user data is in a `data` field
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};