//
'use client';
import { User } from '@/services/types/user.types';
import { getUserInfo } from '@/services/user/getUser';
import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserInfo();
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Verified: {user.isVerified ? 'Yes' : 'No'}</p>
      <picture>
        <img src={user.imgUrl} alt={`${user.firstName} ${user.lastName}`} />
      </picture>
    </div>
  );
};

export default UserProfile;
