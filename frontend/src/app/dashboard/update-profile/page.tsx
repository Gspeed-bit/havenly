import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import UserProfileUpdate from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';

const page = () => {
  return (
    <div>
      <UserProfileUpdate />
      <ChangePassword />
    </div>
  );
};

export default page;
