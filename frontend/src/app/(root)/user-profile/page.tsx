import ImageUpload from '@/components/pages/ImageUploadComponent';
import ProfileUpdatePage from '@/components/pages/userProfile/updateUserProfile';
import { useAuthStore } from '@/store/auth';
import React from 'react';

const Page = () => {
  const user = useAuthStore((state) => state.user);

  // Ensure user._id is defined before passing to ImageUpload
  const userId = user?._id;
  console.log(userId);
  return (
    <div>
      <ProfileUpdatePage />
      {userId && <ImageUpload entityId={userId} type='user_profile' />}
    </div>
  );
};

export default Page;
