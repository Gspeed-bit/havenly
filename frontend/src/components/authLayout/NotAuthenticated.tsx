'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, isBrowser } from '@/config/helpers';
import { logOutUser } from '@/services/auth/auth';
import { useAuthStore } from '@/store/auth';
import { getLoggedInUser } from '@/services/user/userApi';

interface NotAuthenticatedProps {
  children: React.ReactNode;
}

const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const token = getAuthToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isAuthenticated === null) {
          if (!token && isBrowser()) {
            logOutUser(); // Log out if no token is available
          }
          if (!user && token) {
            const response = await getLoggedInUser();
            if (response.status === 'success') {
              useAuthStore.getState().setAuth(response.data, token); // Set auth state
            }
          }
        }
      } catch {
        logOutUser(); // Clear auth state if fetching user fails
      }
    };

    fetchUser();
  }, [isAuthenticated, user, token]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin) {
        router.push('/'); // Redirect admins to their dashboard
      } else {
        router.push('/'); // Redirect users to the homepage
      }
    }
  }, [isAuthenticated, user, isAdmin, router]);

  return (
    <div className='flex flex-col'>
      {isAuthenticated === false && <main className='flex-1'>{children}</main>}
    </div>
  );
};

export default NotAuthenticated;
