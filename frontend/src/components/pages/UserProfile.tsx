import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/auth';

const UserProfile = () => {
  const { isAuthenticated, user, fetchUserData } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserData(); // Fetch user data if the user is authenticated
    }
  }, [isAuthenticated, user, fetchUserData]);

  if (!isAuthenticated) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.phoneNumber}</p>
      {/* You can render more user data here */}
    </div>
  );
};

export default UserProfile;
