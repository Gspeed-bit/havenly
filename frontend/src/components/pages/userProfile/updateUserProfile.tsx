'use client';

import React, { useState, useEffect } from 'react';
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
import { AlertCircle, Camera, Phone, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/users';

const UserProfileUpdate = () => {
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinRequested, setPinRequested] = useState(false);
  // State to control loading behavior
  const user = useUserStore((state) => state.user);

  const router = useRouter(); // Initialize the router for redirection

  useEffect(() => {
    // Wait for user data to be fully loaded
    if (!loading) {
      // Check if user is an admin and redirect accordingly
      if (user) {
        setUserData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
          imgUrl: user.imgUrl || '',
        });
        setIsAdmin(user.isAdmin || false);
      }
    }
  }, [user, isAdmin, router, loading]);
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

  const validateForm = () => {
    const phoneRegex = /^\+?\d{10,15}$/; // Matches 10-15 digits, with optional + for country code
    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors: string[] = [];

    if (!phoneRegex.test(userData.phoneNumber)) {
      errors.push(
        'Please enter a valid phone number (10-15 digits, including optional country code).'
      );
    }
    if (!emailRegex.test(user?.email || '')) {
      errors.push('Please enter a valid email address.');
    }

    if (errors.length > 0) {
      setMessage({
        type: 'error',
        text: errors.join(' '),
      });
      return false;
    }
    return true;
  };

  const handleRequestPin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await apiHandler('/user/request-pin', 'POST');
      if (response.status === 'success') {
        setPinRequested(true);
        setMessage({
          type: 'success',
          text: 'A PIN has been sent to your email.',
        });
      } else {
        throw new Error(response.message || 'Failed to request PIN.');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to request PIN.',
      });
      setPinRequested(false); // Ensure the button is available again on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      let updatedImgUrl = userData.imgUrl;

      // Step 1: Handle Image Upload
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('type', 'user_image');
        formData.append('entityId', user?._id || 'default-entity-id');
        if (isAdmin) formData.append('pin', adminPin);

        const imageResponse = await apiHandler<
          SuccessResponse<{ url: string }>
        >('/image/upload', 'POST', formData);

        if (imageResponse.status === 'success') {
          updatedImgUrl = imageResponse.data?.data?.url || '';
          setUserData((prev) => ({ ...prev, imgUrl: updatedImgUrl }));
          setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } else {
          throw new Error(imageResponse.message || 'Image upload failed.');
        }
      }

      // Step 2: Update Profile Data
      const updatedData = {
        ...userData,
        ...(isAdmin ? { pin: adminPin } : {}),
      };

      const profileResponse = await apiHandler<SuccessResponse<object>>(
        '/user/update',
        'PUT',
        updatedData
      );

      if (profileResponse.status === 'success') {
        setMessage({
          type: 'success',
          text: 'Your profile has been successfully updated.',
        });

        // Update Zustand store
        const { ...userWithoutData } = user;
        useUserStore.getState().setUser({
          ...userWithoutData,
          ...updatedData,
          imgUrl: updatedImgUrl,
        });

        // Optionally reload the page or fetch updated user data
        router.refresh();
      } else {
        throw new Error(profileResponse.message || 'Profile update failed.');
      }
    } catch (error) {
      console.error(error);
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

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className='w-full bg-white shadow-xl rounded-2xl overflow-hidden'>
          <CardHeader className='bg-gradient-to-r from-primary_main to-violet text-white p-6'>
            <CardTitle className='text-2xl font-extrabold'>
              Update Your Profile
            </CardTitle>
            <CardDescription className='mt-2 text-blue-100'>
              {isAdmin
                ? 'Admins require a PIN for profile updates and image uploads.'
                : 'Manage your account details and keep your information up to date.'}
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex flex-col items-center space-y-6'>
                <motion.div
                  className='relative group'
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                >
                  <Avatar className='w-32 h-32 lg:w-40 lg:h-40 border-4 border-primary_main shadow-lg group-hover:border-violet transition-all duration-300'>
                    <AvatarImage
                      src={previewImgUrl || userData.imgUrl}
                      alt='Profile'
                      className='object-cover'
                    />
                    <AvatarFallback className='text-4xl lg:text-5xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white'>
                      {userData.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor='image'
                    className='absolute bottom-0 right-0 bg-primary_main text-white p-2 rounded-full cursor-pointer hover:bg-violet transition-colors duration-300'
                  >
                    <Camera className='w-5 h-5 lg:w-6 lg:h-6' />
                    <Input
                      type='file'
                      id='image'
                      onChange={handleImageChange}
                      className='hidden'
                      accept='image/*'
                    />
                  </Label>
                </motion.div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='firstName'
                    className='text-sm font-medium text-gray-700'
                  >
                    First Name
                  </Label>
                  <div className='relative'>
                    <Input
                      id='firstName'
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-10'
                    />
                    <User
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={18}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label
                    htmlFor='lastName'
                    className='text-sm font-medium text-gray-700'
                  >
                    Last Name
                  </Label>
                  <div className='relative'>
                    <Input
                      id='lastName'
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-10'
                    />
                    <User
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={18}
                    />
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='phoneNumber'
                  className='text-sm font-medium text-gray-700'
                >
                  Phone Number
                </Label>
                <div className='relative'>
                  <Input
                    id='phoneNumber'
                    value={userData.phoneNumber}
                    onChange={(e) =>
                      setUserData({ ...userData, phoneNumber: e.target.value })
                    }
                    type='tel'
                    className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-10'
                  />
                  <Phone
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={18}
                  />
                </div>
              </div>
              {isAdmin && pinRequested && (
                <motion.div
                  className='space-y-2'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label
                    htmlFor='adminPin'
                    className='text-sm font-medium text-gray-700'
                  >
                    Admin PIN
                  </Label>
                  <div className='relative'>
                    <Input
                      id='adminPin'
                      type='text'
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder='Enter your PIN'
                      className='pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 px-10'
                    />
                    <ShieldCheck
                      className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                      size={18}
                    />
                  </div>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    variant={
                      message.type === 'error' ? 'destructive' : 'default'
                    }
                    className={`${
                      message.type === 'error'
                        ? 'bg-red-50 text-red-800'
                        : 'bg-green-50 text-green-800'
                    } rounded-lg p-4`}
                  >
                    <AlertCircle className='w-5 h-5 inline mr-2' />
                    <AlertTitle className='font-semibold'>
                      {message.type === 'success' ? 'Success' : 'Error'}
                    </AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4'>
                {isAdmin && (
                  <Button
                    type='button'
                    onClick={handleRequestPin}
                    disabled={loading}
                    variant='outline'
                    className={`w-full sm:w-auto ${
                      pinRequested
                        ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    } transition-colors duration-300`}
                  >
                    {pinRequested ? 'Request New PIN' : 'Request Admin PIN'}
                  </Button>
                )}
                <Button
                  type='submit'
                  disabled={loading}
                  className='w-full sm:w-auto bg-gradient-to-r  from-primary_main to-purple text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105'
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfileUpdate;
