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
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinRequested, setPinRequested] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
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

      if (isAdmin && !pinVerified) {
        setMessage({
          type: 'error',
          text: 'Please verify your PIN before updating.',
        });
        return;
      }

      await updateProfile(updatedData);
      setUserData(updatedData);
      setPreviewImgUrl(null);
      setMessage({
        type: 'success',
        text: 'Your profile has been successfully updated.',
      });
    } catch (_error) {
      console.error(_error);
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

    if (response.status !== 'success') {
      throw new Error('Image upload failed.');
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

    if (response.status !== 'success') {
      throw new Error('Profile update failed.');
    }
  };

  const handlePinRequest = async () => {
    try {
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
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to request PIN. Please try again.',
      });
    }
  };

  const handlePinVerification = async () => {
    try {
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
      }
    } catch {
      setMessage({ type: 'error', text: 'Invalid PIN. Please try again.' });
    }
  };

  if (userLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='spinner' />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <Card className='w-full max-w-3xl mx-auto mt-8'>
        <CardHeader className='bg-gradient-to-r from-primary to-primary-foreground text-white p-6'>
          <CardTitle className='text-3xl font-bold'>
            Update Your Profile
          </CardTitle>
          <CardDescription className='text-gray-200'>
            Manage your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='w-32 h-32 border-4 border-primary'>
                <AvatarImage
                  src={previewImgUrl || userData.imgUrl}
                  alt='Profile'
                />
                <AvatarFallback className='text-4xl'>
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor='image'
                className='cursor-pointer bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors'
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
                  type='text'
                  id='firstName'
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                  className='transition-all duration-300 focus:ring-2 focus:ring-primary'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  type='text'
                  id='lastName'
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                  className='transition-all duration-300 focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <Input
                  type='tel'
                  id='phoneNumber'
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                  className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>

            {isAdmin && (
              <div className='space-y-4 bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-lg font-semibold flex items-center'>
                  <Lock className='mr-2' /> Admin Verification
                </h3>
                {!pinVerified ? (
                  <>
                    <Button
                      type='button'
                      onClick={handlePinRequest}
                      variant='outline'
                      className='w-full'
                    >
                      Request PIN
                    </Button>
                    {pinRequested && (
                      <div className='space-y-2'>
                        <Label htmlFor='pin'>Enter PIN</Label>
                        <div className='flex space-x-2'>
                          <Input
                            type='text'
                            id='pin'
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className='transition-all duration-300 focus:ring-2 focus:ring-primary'
                          />
                          <Button type='button' onClick={handlePinVerification}>
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
              className='w-full bg-primary hover:bg-primary/90'
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
    } catch (_error) {
      console.error(_error);
      setMessage({
        type: 'error',
        text: 'An error occurred while changing the password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader className='bg-gradient-to-r from-secondary to-secondary-foreground text-white p-6'>
        <CardTitle className='text-2xl font-bold'>Change Password</CardTitle>
        <CardDescription className='text-gray-200'>
          Update your account password
        </CardDescription>
      </CardHeader>
      <CardContent className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='currentPassword'>Current Password</Label>
            <div className='relative'>
              <Key className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                type='password'
                id='currentPassword'
                name='currentPassword'
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-secondary'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                type='password'
                id='newPassword'
                name='newPassword'
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-secondary'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm New Password</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className='pl-10 transition-all duration-300 focus:ring-2 focus:ring-secondary'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Password Strength</Label>
            <Progress
              value={passwordStrength}
              className={`w-full h-2 ${getStrengthColor(passwordStrength)}`}
            />
          </div>

          {message && (
            <Alert
              variant={message.type === 'error' ? 'destructive' : 'default'}
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
            className='w-full bg-secondary hover:bg-secondary/90'
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
