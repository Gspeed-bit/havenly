// src/hooks/useUser.ts
'use client';
import { useEffect, useState } from 'react';
import { getAuthToken, clearAuthToken } from '../../config/helpers';
import { User } from '@/services/types/user.types';
import Keys from '@/config/keys';

export const useUser = (): { user: User | null; loading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found.');

      const response = await fetch(`${Keys().serverUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data.data);
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
