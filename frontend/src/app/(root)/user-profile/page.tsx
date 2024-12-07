import { ChangePassword } from '@/components/pages/userProfile/ChangePassword';
import ProfileUpdateForm from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';
import Authenticated from '@/components/authLayout/Authenticated';

const page = () => {
  return (
    <Authenticated accessLevel='non-admin'>
      <ProfileUpdateForm />
      <ChangePassword />
    </Authenticated>
  );
};

export default page;
