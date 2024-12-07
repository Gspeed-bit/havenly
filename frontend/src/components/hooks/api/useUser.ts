'use client';

import { useEffect, useState } from 'react';
import { clearAuthToken } from '../../../config/helpers';
import { User } from '@/services/types/user.types';
import { getLoggedInUser } from '@/services/user/userApi';

export const useUser = (): { user: User | null; loading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await getLoggedInUser();
      console.log('Fetched users:', response); // Log the response here to check the data
      if (response.status === 'success') {
        setUser(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user details.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      clearAuthToken(); // Clear token if the user fetch fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading };
};
