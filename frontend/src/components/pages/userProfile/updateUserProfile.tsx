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
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Lock,
  AlertCircle,
  CheckCircle2,
  Key,
} from 'lucide-react';

const ProfileUpdate = () => {
  const { user, loading: userLoading } = useUser();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    imgUrl: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinRequested, setPinRequested] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      let imageUrl = userData.imgUrl;
      if (image) {
        const uploadResponse = await uploadImage(image);
        imageUrl = uploadResponse.data.url;
      }

      const updatedData = { ...userData, imgUrl: imageUrl };

      if (isAdmin && pinVerified) {
        await updateProfile(updatedData);
      } else if (!isAdmin) {
        await updateProfile(updatedData);
      } else {
        setMessage({
          type: 'error',
          text: 'Please verify your PIN before updating.',
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        type: 'error',
        text: 'An error occurred while updating your profile.',
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
      setMessage({
        type: 'success',
        text: 'Your profile has been successfully updated.',
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handlePinRequest = async () => {
    const response = await apiHandler<SuccessResponse<object>>(
      '/user/request-pin',
      'POST'
    );
    if (response.status === 'success') {
      setPinRequested(true);
      setMessage({
        type: 'success',
        text: 'A PIN has been sent to your registered email.',
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Failed to request PIN. Please try again.',
      });
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
      setMessage({
        type: 'success',
        text: 'Your PIN has been verified. You can now update your profile.',
      });
    } else {
      setMessage({ type: 'error', text: 'Invalid PIN. Please try again.' });
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
            Manage your account details and preferences
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
                <Label htmlFor='firstName' className='text-darkGray'>
                  First Name
                </Label>
                <Input
                  type='text'
                  id='firstName'
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className='transition-all duration-300 focus:ring-2 focus:ring-primary_main border-gray'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName' className='text-darkGray'>
                  Last Name
                </Label>
                <Input
                  type='text'
                  id='lastName'
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className='transition-all duration-300 focus:ring-2 focus:ring-primary_main border-gray'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phoneNumber' className='text-darkGray'>
                Phone Number
              </Label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray' />
                <Input
                  type='tel'
                  id='phoneNumber'
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                  className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary_main border-gray'
                />
              </div>
            </div>

            {isAdmin && (
              <div className='space-y-4 bg-blue p-4 rounded-lg'>
                <h3 className='text-lg font-semibold flex items-center text-primary_main'>
                  <Lock className='mr-2' /> Admin Verification
                </h3>
                {!pinVerified ? (
                  <>
                    <Button
                      type='button'
                      onClick={handlePinRequest}
                      variant='outline'
                      className='w-full border-primary_main text-primary_main hover:bg-primary_main hover:text-white'
                    >
                      Request PIN
                    </Button>
                    {pinRequested && (
                      <div className='space-y-2'>
                        <Label htmlFor='pin' className='text-darkGray'>
                          Enter PIN
                        </Label>
                        <div className='flex space-x-2'>
                          <Input
                            type='text'
                            id='pin'
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className='transition-all duration-300 focus:ring-2 focus:ring-primary_main border-gray'
                          />
                          <Button
                            type='button'
                            onClick={handlePinVerification}
                            className='bg-primary_main text-white hover:bg-violet'
                          >
                            Verify PIN
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-center text-green-600 flex items-center justify-center'>
                    <CheckCircle2 className='mr-2' /> Admin status verified
                  </div>
                )}
              </div>
            )}

            {message && (
              <Alert
                variant={message.type === 'error' ? 'destructive' : 'default'}
                className={
                  message.type === 'error'
                    ? 'bg-pink text-white'
                    : 'bg-blue text-primary_main'
                }
              >
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>
                  {message.type === 'error' ? 'Error' : 'Success'}
                </AlertTitle>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-primary_main hover:bg-violet text-white transition-colors'
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className='w-5 h-5 border-t-2 border-white rounded-full'
                />
              ) : (
                <>
                  <User className='mr-2' />
                  Update Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <PasswordChangeForm />
    </div>
  );
};

const PasswordChangeForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New password and confirm password do not match.',
      });
      setLoading(false);
      return;
    }

    if (passwordStrength < 75) {
      setMessage({ type: 'error', text: 'Please choose a stronger password.' });
      setLoading(false);
      return;
    }

    try {
      const response = await apiHandler<SuccessResponse<object>>(
        '/user/change-password',
        'POST',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Password changed successfully.' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to change password. Please try again.',
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: 'An error occurred while changing the password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-3xl mx-auto border-2 border-violet shadow-lg'>
      <CardHeader className='bg-gradient-to-r from-violet to-pink text-white p-6 rounded-t-lg'>
        <CardTitle className='text-2xl font-bold'>Change Password</CardTitle>
        <CardDescription className='text-blue'>
          Update your account password
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6 bg-veryLightGray'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='currentPassword' className='text-darkGray'>
              Current Password
            </Label>
            <div className='relative'>
              <Key className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray' />
              <Input
                type='password'
                id='currentPassword'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-violet border-gray'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='newPassword' className='text-darkGray'>
              New Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray' />
              <Input
                type='password'
                id='newPassword'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-violet border-gray'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword' className='text-darkGray'>
              Confirm New Password
            </Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray' />
              <Input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-violet border-gray'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-darkGray'>Password Strength</Label>
            <Progress
              value={passwordStrength}
              className={`w-full h-2 ${getStrengthColor(passwordStrength)}`}
            />
          </div>

          {message && (
            <Alert
              variant={message.type === 'error' ? 'destructive' : 'default'}
              className={
                message.type === 'error'
                  ? 'bg-pink text-white'
                  : 'bg-blue text-violet'
              }
            >
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>
                {message.type === 'error' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-violet hover:bg-pink text-white transition-colors'
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-5 h-5 border-t-2 border-white rounded-full'
              />
            ) : (
              <>
                <Key className='mr-2' />
                Change Password
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileUpdate;
