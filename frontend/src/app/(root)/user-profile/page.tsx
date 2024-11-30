'use client';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/pages/ImageUploadComponent';

import { useAuthStore } from '@/store/auth';
import React from 'react';

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component is mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Return null or a loading state while waiting for client-side rendering

  const userId = user?._id;

  return (
   <ImageUpload entityId={userId || ''} type='user_image' />
  )}
export default Page;
