'use client';
import { useEffect, useState } from 'react';
import { fetchAllUsersApi } from '@/services/user/userApi';
import { User } from '@/services/types/user.types';

export const useAllUsers = (): { users: User[] | null; loading: boolean } => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsersApi();

      console.log('Fetched users:', response); // Log response from API

      if (response.status === 'success') {
        setUsers(response.data.data); 
        console.log('Users state after setting:', response.data.data); // Log state after setting
      } else {
        console.error('Error fetching users:', response.message);
        setUsers([]); 
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once on mount

  console.log('Component rendered with users:', users); // Log users during each render

  return { users, loading };
};
