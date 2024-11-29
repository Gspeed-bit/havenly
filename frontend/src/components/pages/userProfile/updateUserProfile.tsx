'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Camera, Lock, Phone } from 'lucide-react';
import Image from 'next/image';
import { updateUserProfile } from '@/services/user/user';

const ProfileUpdatePage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setPreviewImage('/home.png');
  }, []); // Simulating fetching user data

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const calculatePasswordStrength = (password: string) => {
    const strength = password.length > 8 ? 100 : password.length * 10;
    setPasswordStrength(strength);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phoneNumber', phoneNumber);
      if (password) formData.append('password', password);
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await updateUserProfile(formData);
      if (response.status === 'success') {
        setSuccessMessage('Profile updated successfully!');
      } else {
        setError(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 p-4 md:p-8'>
      <div className='w-full max-w-6xl flex flex-col lg:flex-row items-stretch bg-white rounded-3xl shadow-2xl overflow-hidden'>
        <div className='w-full lg:w-1/2 h-64 lg:h-auto relative overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105'>
          <Image
            src='/home-profile.jpg'
            alt='Profile Update Background'
            layout='fill'
            objectFit='cover'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 flex items-center justify-center'>
            <h1 className='text-4xl font-bold text-white text-center px-4'>
              Elevate Your Profile
            </h1>
          </div>
        </div>

        <div className='w-full lg:w-1/2 p-6 md:p-8 bg-white transition-all duration-500 ease-in-out transform hover:shadow-lg'>
          <Card className='bg-transparent shadow-none border-none h-full flex flex-col'>
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-gray-800'>
                Update Your Profile
              </CardTitle>
              <CardDescription className='text-gray-600'>
                Refine your details and enhance your presence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleUpdateSubmit}
                className='space-y-6 h-full flex flex-col'
              >
                <div className='flex-grow'>
                  <div className='flex flex-col md:flex-row gap-6'>
                    <div className='w-full md:w-1/3 flex flex-col items-center space-y-4'>
                      <div className='relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg mx-auto mb-4'>
                        {previewImage && (
                          <Image
                            src={previewImage}
                            alt='Profile'
                            layout='fill'
                            objectFit='cover'
                          />
                        )}
                      </div>
                      <Label htmlFor='profileImage' className='cursor-pointer'>
                        <div className='flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors'>
                          <Camera size={16} />
                          <span>Change Photo</span>
                        </div>
                      </Label>
                      <Input
                        id='profileImage'
                        type='file'
                        className='hidden'
                        onChange={handleImageChange}
                        accept='image/*'
                      />
                    </div>
                    <div className='w-full md:w-2/3 space-y-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='firstName' className='text-gray-700'>
                          First Name
                        </Label>
                        <div className='relative'>
                          <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='firstName'
                            type='text'
                            value={firstName}
                            placeholder='Enter your first name'
                            onChange={(e) => setFirstName(e.target.value)}
                            className='pl-10 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                            required
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='lastName' className='text-gray-700'>
                          Last Name
                        </Label>
                        <div className='relative'>
                          <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='lastName'
                            type='text'
                            value={lastName}
                            placeholder='Enter your last name'
                            onChange={(e) => setLastName(e.target.value)}
                            className='pl-10 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                            required
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='phoneNumber' className='text-gray-700'>
                          Phone Number
                        </Label>
                        <div className='relative'>
                          <Phone className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='phoneNumber'
                            type='tel'
                            value={phoneNumber}
                            placeholder='Enter your phone number'
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className='pl-10 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                            required
                          />
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='password' className='text-gray-700'>
                          New Password
                        </Label>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='password'
                            type='password'
                            value={password}
                            placeholder='Enter a new password'
                            onChange={(e) => {
                              setPassword(e.target.value);
                              calculatePasswordStrength(e.target.value);
                            }}
                            className='pl-10 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                          />
                        </div>
                        {password && (
                          <Progress value={passwordStrength} className='h-1' />
                        )}
                      </div>
                      <div className='space-y-2'>
                        <Label
                          htmlFor='confirmPassword'
                          className='text-gray-700'
                        >
                          Confirm Password
                        </Label>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                          <Input
                            id='confirmPassword'
                            type='password'
                            value={confirmPassword}
                            placeholder='Confirm your new password'
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='pl-10 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-md'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className='flex flex-col space-y-4 p-0'>
                  <Button
                    type='submit'
                    className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105'
                    disabled={isLoading}
                    onClick={handleUpdateSubmit}
                  >
                    {isLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                  {error && (
                    <Alert variant='destructive'>
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert>
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;
