import UserList from '@/components/pages/userList/UserList';
import UpdateProfile from '@/components/pages/userProfile/updateUserProfile';
import React from 'react';

const page = () => {
  return (
    <div>
      <UserList />
      <UpdateProfile />
    </div>
  );
};

export default page;
