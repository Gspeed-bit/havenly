'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/config/helpers';
import { useAuthStore } from '@/store/auth';
import { getLoggedInUser } from '@/services/user/userApi';

interface AuthenticatedProps {
  children: React.ReactNode;
  accessLevel?: 'user' | 'admin' | 'non-admin';
}

const Authenticated: React.FC<AuthenticatedProps> = ({
  children,
  accessLevel = 'user',
}) => {
  const router = useRouter();
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          // If no token, redirect to login
          router.push('/auth/login');
          return;
        }

        // If user data is not yet loaded, fetch it
        if (!user) {
          await getLoggedInUser();
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/auth/login'); // Redirect to login on failure
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchUser();
  }, [user, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (accessLevel === 'admin' && !isAdmin) {
        router.push('/'); // Redirect non-admins from admin-only pages
      } else if (accessLevel === 'non-admin' && isAdmin) {
        router.push('/'); // Redirect admins from non-admin pages
      }
    }
  }, [loading, isAuthenticated, user, isAdmin, accessLevel, router]);

  if (loading || isAuthenticated === null) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  return null;
};

export default Authenticated;
