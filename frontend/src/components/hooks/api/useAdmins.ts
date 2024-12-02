// useAdmins.ts

import { useEffect, useState } from 'react';
import { fetchAllAdminsApi } from '@/services/user/userApi';
import { User } from '@/services/types/user.types';
import { clearAuthToken } from '@/config/helpers';


export const useAdmins = (): { admins: User[] | null; loading: boolean } => {
  const [admins, setAdmins] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await fetchAllAdminsApi();
      console.log('Fetched users:', response); // Log the response here to check the data
      if (response.status === 'success') {
        setAdmins(response.data.data);
      } else {
        throw new Error(response.message || 'Failed to fetch admins.');
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      clearAuthToken(); // Clear token if the fetch fails
      setAdmins(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { admins, loading };
};
