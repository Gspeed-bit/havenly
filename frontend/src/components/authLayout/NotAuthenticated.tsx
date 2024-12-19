'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/users';
import { useAuthStore } from '@/store/auth';


interface NotAuthenticatedProps {
  children: React.ReactNode;
}

const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default NotAuthenticated;
