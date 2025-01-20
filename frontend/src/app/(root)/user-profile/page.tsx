'use client';

import React from 'react';
import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import ProfileUpdateForm from '@/components/pages/userProfile/updateUserProfile';

const page = () => {
  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full space-y-8'>
            <ProfileUpdateForm />
            <ChangePassword />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
