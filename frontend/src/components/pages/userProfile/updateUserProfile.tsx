'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/hooks/api/useUser';
import { apiHandler, SuccessResponse } from '@/config/server';

const ProfileUpdate = () => {
  const { user, loading: userLoading } = useUser();
  const [userData, setUserData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    imgUrl: user?.imgUrl || '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [pin, setPin] = useState('');
  const [pinRequested, setPinRequested] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update user data when `user` changes
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        imgUrl: user.imgUrl || '',
      });
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = userData.imgUrl;
      if (image) {
        const uploadResponse = await uploadImage(image);
        imageUrl = uploadResponse.data.url; // Assuming success returns image URL
      }

      const updatedData = { ...userData, imgUrl: imageUrl };

      // Update profile based on admin status and pin verification
      if (isAdmin && pinVerified) {
        await updateProfile(updatedData);
      } else if (!isAdmin) {
        await updateProfile(updatedData);
      } else {
        alert('Please verify your PIN');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    // Ensure folder is defined (e.g., based on user or profile)
const folderName = user?.firstName
  ? `profile-pictures/${user.firstName}`
  : 'profile-pictures/default';    
  console.log('Folder Name:', folderName);
    const response = await apiHandler<SuccessResponse<{ url: string }>>(
      '/image/upload',
      'POST',
      formData,
      { params: { folder: folderName } } // Pass the folder name here
    );

    if (response.status === 'error') {
      throw new Error(response.message);
    }

    return response.data;
  };

  const updateProfile = async (updatedData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imgUrl: string;
  }) => {
    const response = await apiHandler<SuccessResponse<object>>(
      '/user/update',
      'PUT',
      updatedData
    );
    if (response.status === 'success') {
      alert('Profile updated successfully');
    } else {
      alert('Failed to update profile');
    }
  };

  const handlePinRequest = async () => {
    const response = await apiHandler<SuccessResponse<object>>(
      '/user/request-pin',
      'POST'
    );
    if (response.status === 'success') {
      setPinRequested(true);
    } else {
      console.error('Failed to request PIN:', response.message);
    }
  };

  const handlePinVerification = async () => {
    const response = await apiHandler<SuccessResponse<object>>(
      '/user/confirm-update',
      'POST',
      { pin }
    );
    if (response.status === 'success') {
      setPinVerified(true);
      alert('PIN verified. You can now update your profile.');
    } else {
      alert('Invalid PIN');
    }
  };

  if (userLoading) return <div>Loading...</div>;

  return (
    <div className='profile-update-form'>
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='firstName'>First Name</label>
          <input
            type='text'
            id='firstName'
            value={userData.firstName}
            onChange={(e) =>
              setUserData({ ...userData, firstName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='lastName'>Last Name</label>
          <input
            type='text'
            id='lastName'
            value={userData.lastName}
            onChange={(e) =>
              setUserData({ ...userData, lastName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='phoneNumber'>Phone Number</label>
          <input
            type='text'
            id='phoneNumber'
            value={userData.phoneNumber}
            onChange={(e) =>
              setUserData({ ...userData, phoneNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='image'>Profile Image</label>
          <input type='file' id='image' onChange={handleImageChange} />
          {userData.imgUrl && (
            <picture>
              <img src={userData.imgUrl} alt='Profile' width={100} />
            </picture>
          )}
        </div>

        {isAdmin && !pinVerified && (
          <div>
            <button type='button' onClick={handlePinRequest}>
              Request PIN
            </button>
            {pinRequested && (
              <div>
                <label htmlFor='pin'>Enter PIN</label>
                <input
                  type='text'
                  id='pin'
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
                <button type='button' onClick={handlePinVerification}>
                  Verify PIN
                </button>
              </div>
            )}
          </div>
        )}

        <button type='submit' disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
