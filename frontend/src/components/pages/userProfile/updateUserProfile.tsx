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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinRequested, setPinRequested] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        imgUrl: user.imgUrl || '',
      });
      setIsAdmin(user.isAdmin || false);
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


  const handleImageUpload = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append('image', image as File);
      formData.append('type', 'user_image');
      formData.append('entityId', user?._id || 'default-entity-id');
      if (isAdmin) formData.append('pin', adminPin);

      const response = await apiHandler<SuccessResponse<{ url: string }>>(
        '/image/upload',
        'POST',
        formData
      );

      if (response.status === 'success') {
        setUserData({ ...userData, imgUrl: response.data?.data?.url });
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        // Refresh the page after image upload
        window.location.reload();
      } else {
        throw new Error(response.message || 'Image upload failed.');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Image upload failed.',
      });
    }
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

   // Validate the form first
   if (!validateForm()) {
     setLoading(false);
     return; // Stop further execution if validation fails
   }

   try {
     const updatedData = {
       ...userData,
       ...(isAdmin ? { pin: adminPin } : {}),
     };

     if (isAdmin && !pinRequested) {
       setMessage({
         type: 'error',
         text: 'Invalid or missing PIN.',
       });
       setPinRequested(false); // Reset pinRequested to false
       setLoading(false);
       return;
     }

     const response = await apiHandler<SuccessResponse<object>>(
       '/user/update',
       'PUT',
       updatedData
     );

     if (response.status === 'success') {
       setMessage({
         type: 'success',
         text: 'Your profile has been successfully updated.',
       });
       // If image is changed, upload it
       await handleImageUpload();
       // Refresh the page after successful update
       window.location.reload();
     } else {
       throw new Error(response.message || 'Profile update failed.');
     }
   } catch (error) {
     setMessage({
       type: 'error',
       text:
         error instanceof Error
           ? error.message
           : 'An unexpected error occurred.',
     });

     if (
       error instanceof Error &&
       error.message.includes('invalid or missing PIN')
     ) {
       setPinRequested(false); // Ensure button visibility after error
     }
   } finally {
     setLoading(false);
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
          <CardDescription>
            {isAdmin
              ? 'Admins require a PIN for profile updates and image uploads.'
              : 'Manage your account details.'}
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
                type='tel'
              />
            </div>
            {isAdmin && pinRequested && (
              <div className='space-y-2'>
                <Label htmlFor='adminPin'>Admin PIN</Label>
                <Input
                  id='adminPin'
                  type='text'
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder='Enter your PIN'
                />
              </div>
            )}
            {message && (
              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
              >
                <AlertCircle className='w-6 h-6' />
                <AlertTitle>
                  {message.type === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <div className='flex justify-between items-center'>
              {isAdmin && !pinRequested && (
                <Button
                  type='button'
                  onClick={handleRequestPin}
                  disabled={loading}
                  variant='outline'
                  className='bg-blue text-white'
                >
                  Request Admin PIN
                </Button>
              )}
              {isAdmin && pinRequested && (
                <Button
                  type='button'
                  onClick={handleRequestPin}
                  disabled={loading}
                  variant='outline'
                  className='bg-blue text-white'
                >
                  Request New PIN
                </Button>
              )}
              <Button type='submit' className='bg-primary_main text-white'>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileUpdate;
