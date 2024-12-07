'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, isBrowser } from '@/config/helpers';
import { useAuthStore } from '@/store/auth';
import { getLoggedInUser } from '@/services/user/userApi';

interface AuthenticatedProps {
  children: React.ReactNode;
  accessLevel?: 'user' | 'admin' | 'non-admin'; // Added "non-admin" as an option
}

const Authenticated: React.FC<AuthenticatedProps> = ({
  children,
  accessLevel = 'user',
}) => {
  const router = useRouter();
  const { isAuthenticated, user, isAdmin } = useAuthStore();
  const token = getAuthToken();
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // If no token, immediately redirect to login
    if (isBrowser() && !token) {
      setLoading(false);
      router.push('/auth/login'); // Redirect if not authenticated
      return;
    }

    // Fetch user data if token exists
    const fetchUser = async () => {
      if (!user && token) {
        await getLoggedInUser(); // Fetch user data from API
      }
      setLoading(false); // End loading state
    };

    fetchUser();
  }, [user, token, router]);

  useEffect(() => {
    // Handle role-based redirection after user data is loaded
    if (!loading && isAuthenticated && user) {
      if (accessLevel === 'non-admin' && isAdmin) {
        router.push('/'); // Redirect admins if they try to access non-admin pages
      } else if (accessLevel === 'admin' && !isAdmin) {
        router.push('/'); // Redirect users from admin-only pages
      }
    }
  }, [loading, isAuthenticated, user, isAdmin, accessLevel, router]);

  // Show a loading state until checks are complete
  if (loading || isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Render children if the user is authenticated
  if (isAuthenticated && user) {
    return <div className="flex-1">{children}</div>;
  }

  return null; // Render nothing if not authenticated
};

export default Authenticated;
