'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/hooks/api/useUser';
import { apiHandler, SuccessResponse } from '@/config/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const UserProfileUpdate = () => {
  const { user, loading: userLoading } = useUser();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    imgUrl: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        imgUrl: user.imgUrl || '',
      });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl = userData.imgUrl;

      if (image) {
        try {
          const uploadResponse = await uploadImage(image);
          imageUrl = uploadResponse?.data?.url ?? userData.imgUrl;
          if (!imageUrl) {
            throw new Error('Image URL is missing from the upload response.');
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload the image. Please try again.');
        }
      }

      const updatedData = { ...userData, imgUrl: imageUrl };
      const response = await updateProfile(updatedData);

      if (response?.status === 'success') {
        setMessage({
          type: 'success',
          text: 'Your profile has been successfully updated.',
        });
      } else {
        throw new Error(response?.data || 'Profile update failed.');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'user_image');
    formData.append('entityId', user?._id || 'default-entity-id');

    const response = await apiHandler<SuccessResponse<{ url: string }>>(
      '/image/upload',
      'POST',
      formData
    );

    if (response.status !== 'success' || !response.data?.url) {
      throw new Error('Invalid upload response or missing URL.');
    }

    return response;
  };

  const updateProfile = async (updatedData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    imgUrl: string;
  }) => {
    const response = await apiHandler<SuccessResponse<{ url: string }>>(
      '/user/update',
      'PUT',
      updatedData
    );

    if (response.status === 'success') {
      return response;
    } else {
      throw new Error(response.message || 'Failed to update profile.');
    }
  };

  if (userLoading) {
    return (
      <div className='flex justify-center items-center h-screen bg-blue'>
        <div className='w-16 h-16 border-t-4 border-primary_main rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='space-y-8 p-4 bg-blue min-h-screen'>
      <Card className='w-full max-w-3xl mx-auto mt-8 border-2 border-primary_main shadow-lg'>
        <CardHeader className='bg-gradient-to-r from-primary_main to-violet text-white p-6 rounded-t-lg'>
          <CardTitle className='text-3xl font-bold'>
            Update Your Profile
          </CardTitle>
          <CardDescription className='text-blue'>
            Manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6 bg-veryLightGray'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='w-32 h-32 border-4 border-primary_main'>
                <AvatarImage
                  src={previewImgUrl || userData.imgUrl}
                  alt='Profile'
                />
                <AvatarFallback className='text-4xl bg-violet text-white'>
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor='image'
                className='cursor-pointer bg-primary_main text-white px-4 py-2 rounded-full hover:bg-violet transition-colors'
              >
                Change Profile Picture
                <Input
                  type='file'
                  id='image'
                  onChange={handleImageChange}
                  className='hidden'
                  accept='image/*'
                />
              </Label>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNumber: e.target.value })
                }
              />
            </div>
            {message && (
              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
              >
                <AlertCircle />
                <AlertTitle>
                  {message.type === 'error' ? 'Error' : 'Success'}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <Button type='submit' disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileUpdate;
