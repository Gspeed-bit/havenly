'use client';
import React, { useState, useEffect } from 'react';
import { getUserDetails } from '@/services/user/userApi';
import { useUserStore } from '@/store/users';


const UserList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, setUser } = useUserStore(); // Using Zustand store

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserDetails()
        .then((userDetails) => {
          if (userDetails) {
            setUser(userDetails.data); // Store user in Zustand store
          } else {
            console.error('Failed to fetch user details');
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [setUser]);

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
