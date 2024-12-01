'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/components/hooks/useUser';
import { useEffect } from 'react';

const UserList = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, router, user]);

  if (!user) {
    return null; // Render nothing while redirecting
  }
  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Profile</h1>
      <div className='bg-white shadow rounded p-6'>
        <picture>
          <img
            src={user.imgUrl}
            alt='Profile'
            className='w-24 h-24 rounded-full mb-4'
          />
        </picture>
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phoneNumber}
        </p>
      </div>
    </div>
  );
};

export default UserList;
