import React, { useState, useEffect } from 'react';
import { getUserDetails } from '@/services/user/userApi';
import { useAuthStore } from '@/store/auth';


const UserList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, setAuth, logout } = useAuthStore(); // Zustand store to manage auth state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserDetails()
        .then((userDetails) => {
          if (userDetails) {
            setAuth(userDetails); // Set user in Zustand store
          } else {
            logout(); // If no user found, logout
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          logout(); // Log out if the API call fails
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      logout(); // Log out if no token is found
    }
  }, [setAuth, logout]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome to the App</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.firstName}</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNumber}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default UserList;
