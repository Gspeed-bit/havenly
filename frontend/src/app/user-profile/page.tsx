import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import ProfileUpdateForm from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';

const page = () => {
  return (
    <div>
      <ProfileUpdateForm />
      <ChangePassword />
    </div>
  );
};

export default page;
