'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { signUp } from '../../../services/auth/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ThreeDots } from 'react-loader-spinner';
import useLoading from '../../hooks/useLoading';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const router = useRouter();
  const {
    loading: signUpLoading,
    startLoading: startSignUpLoading,
    stopLoading: stopSignUpLoading,
  } = useLoading();

  useEffect(() => {
    if (alertState.type) {
      const timer = setTimeout(() => {
        setAlertState({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertState]);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phoneNumber);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setAlertState({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    if (!validatePassword(password)) {
      setAlertState({
        type: 'error',
        message: 'Password must be at least 8 characters long.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlertState({
        type: 'error',
        message: "Passwords don't match",
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setAlertState({
        type: 'error',
        message: 'Please enter a valid phone number.',
      });
      return;
    }

    const user = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      adminCode,
    };

    startSignUpLoading();
    try {
      const result = await signUp(user);
      if (result.status === 'success') {
        setAlertState({
          type: 'success',
          message: 'Sign Up successful! Redirecting...',
        });

        setTimeout(() => {
          router.push('/auth/verify');
        }, 2000);
      } else {
        setAlertState({
          type: 'error',
          message: result.message || 'Sign Up failed! Please try again.',
        });
      }
    } catch (error) {
      console.log(error);
      setAlertState({
        type: 'error',
        message: 'An unexpected error occurred.',
      });
    } finally {
      stopSignUpLoading();
    }
  };

  return (
    <>
      <CardContent>
        {alertState.type && (
          <Alert
            variant={alertState.type === 'success' ? 'default' : 'destructive'}
            className='mb-4 sticky top-0 z-50 transition-opacity duration-500 ease-in-out'
          >
            <AlertTitle>
              {alertState.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>{alertState.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignUpSubmit}>
          <div className='space-y-4'>
            <div className='w-full flex items-center gap-3'>
              <div className='space-y-2 w-1/2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='John'
                  required
                />
              </div>
              <div className='space-y-2 w-1/2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Doe'
                  required
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='(+49) 123-456-7890'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-2 top-2.5 text-gray focus:outline-none'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-2 top-2.5 text-gray focus:outline-none'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='adminCode'>Admin Code (if any)</Label>
              <Input
                id='adminCode'
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder='Enter Admin Code'
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox id='terms' required />
              <Label
                htmlFor='terms'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                I agree to the{' '}
                <Link href='/terms' className='text-primary hover:underline'>
                  terms and conditions
                </Link>
              </Label>
            </div>
          </div>
          <Button
            type='submit'
            className={`w-full mt-5 py-3 font-bold text-white bg-primary_main hover:bg-purple rounded-lg shadow-lg hover:bg-lightPrimaryfocus:outline-none ${
              signUpLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={signUpLoading}
          >
            {signUpLoading ? (
              <ThreeDots visible height='20' width='50' color='#ffffff' />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex flex-wrap items-center justify-between gap-2'>
        <div className='text-sm text-muted-foreground'>
          <span className='mr-1 sm:inline-block'>Already have an account?</span>
          <Link
            aria-label='Log in'
            href='/auth/login'
            className='text-primary underline-offset-4 transition-colors hover:underline'
          >
            Login
          </Link>
        </div>
      </CardFooter>
    </>
  );
}
