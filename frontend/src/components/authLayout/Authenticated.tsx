'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/config/helpers';
import { useAuthStore } from '@/store/auth';
import { useUserStore } from '@/store/users';
import { getLoggedInUser } from '@/services/user/userApi';

interface AuthenticatedProps {
  children: React.ReactNode;
  accessLevel?: 'user' | 'admin';
}

const Authenticated: React.FC<AuthenticatedProps> = ({
  children,
  accessLevel = 'user',
}) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          logout();
          router.push('/auth/login');
          return;
        }

        if (!user) {
          const response = await getLoggedInUser();
          if (response.status !== 'success') {
            throw new Error('Failed to fetch user data');
          }
          setUser(response.data);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        logout();
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, router, logout, setUser]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (accessLevel === 'admin' && !user.isAdmin) {
        router.push('/'); // Redirect non-admin users trying to access admin routes
      } else if (accessLevel === 'user' && user.isAdmin) {
        router.push('/dashboard'); // Redirect admin users trying to access user routes
      }
    }
  }, [loading, isAuthenticated, user, accessLevel, router]);

  if (loading) {
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
