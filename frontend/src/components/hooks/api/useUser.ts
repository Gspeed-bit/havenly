'use client';

import { useEffect, useState } from 'react';
import { clearAuthToken } from '../../../config/helpers';
import { User } from '@/services/types/user.types';
import { fetchUserApi } from '@/services/user/userApi';

export const useUser = (): { user: User | null; loading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await fetchUserApi();
      console.log('Fetched users:', response); // Log the response here to check the data
      if (response.status === 'success') {
        setUser(response.data.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user details.');
      }
    } catch (error) {
      console.error('Error loading user:', error);
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
