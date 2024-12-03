import UserList from '@/components/pages/userList/UserList';
import ProfileUpdateForm from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';

const page = () => {
  return (
    <div>
      <UserList />
      <ProfileUpdateForm />
    </div>
  );
};

export default page;
