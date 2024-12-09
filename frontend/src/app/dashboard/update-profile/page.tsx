import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import UserProfileUpdate from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';

const page = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='w-full lg:w-3/4 space-y-8'>
        <UserProfileUpdate />
        <ChangePassword />
      </div>
    </div>
  );
};

export default page;
