'use client';

import { useUser } from '@/components/hooks/api/useUser';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserList = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    // Ensure the component is hydrated
    setIsHydrated(true);

    // Navigate to login page if not authenticated
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Prevent rendering on the server
  if (!isHydrated) {
    return null; // Render nothing until hydrated
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <div className='bg-white shadow rounded p-6'>
        <p>
          <strong>Name:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Phone:</strong> {user?.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default UserList;


