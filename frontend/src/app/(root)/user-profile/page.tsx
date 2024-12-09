'use client';

import React from 'react';
import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import ProfileUpdateForm from '@/components/pages/userProfile/updateUserProfile';
import Authenticated from '@/components/authLayout/Authenticated';
import { UserProfileSidebar } from '@/components/pages/userProfile/UserProfileSidebar';

const page = () => {
  return (
    <Authenticated accessLevel='non-admin'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/4'>
            <UserProfileSidebar />
          </div>
          <div className='w-full lg:w-3/4 space-y-8'>
            <ProfileUpdateForm />
            <ChangePassword />
          </div>
        </div>
      </div>
    </Authenticated>
  );
};

export default page;
