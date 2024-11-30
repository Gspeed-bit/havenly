'use client';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/pages/ImageUploadComponent';
import ProfileUpdatePage from '@/components/pages/userProfile/updateUserProfile';
import { useAuthStore } from '@/store/auth';
import React from 'react';
import UserProfile from '@/components/pages/userProfile/updateUserProfile';

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Return null or a loading state while waiting for client-side rendering

  const userId = user?._id;
  console.log(user);

  return (
    <div>
      {/* <ProfileUpdatePage />
      {userId && <ImageUpload entityId={userId} type='user_image' />} */}


      <UserProfile />
    </div>
  );
};

export default Page;
