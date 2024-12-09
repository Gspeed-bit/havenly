'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../../../services/auth/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ThreeDots } from 'react-loader-spinner';
import useLoading from '../../hooks/useLoading';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const router = useRouter();
  const {
    loading: loginLoading,
    startLoading: startLoginLoading,
    stopLoading: stopLoginLoading,
  } = useLoading();

  useEffect(() => {
    const rememberMeValue = localStorage.getItem('rememberMe');
    if (rememberMeValue === 'true') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
    }
  }, []);

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

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

    const loginData = { email, password };

    startLoginLoading();
    try {
      const result = await login(loginData);
      if (result.status === 'success') {
        setAlertState({
          type: 'success',
          message: 'Login successful! Redirecting...',
        });

        // Delay navigation to allow alert to stay visible
        setTimeout(() => {
          router.push('/');
        }, 3000); // Adjust delay to 3 seconds
      } else if (result.message === 'Account not verified') {
        setAlertState({
          type: 'error',
          message:
            'Your account is not verified. Redirecting to verification...',
        });

        setTimeout(() => {
          router.push('/auth/verification-code');
        }, 3000); // Adjust delay to 3 seconds
      } else {
        setAlertState({
          type: 'error',
          message: result.message || 'Login failed! Please try again.',
        });
      }
    } catch {
      setAlertState({
        type: 'error',
        message: 'An unexpected error occurred.',
      });
    } finally {
      stopLoginLoading();
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
        <form onSubmit={handleLoginSubmit}>
          <div className='space-y-4'>
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
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='remember'
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor='remember'
                className='text-sm font-medium leading-none p'
              >
                Remember me
              </Label>
            </div>
          </div>
          <Button
            type='submit'
            className={`w-full mt-5 py-3 font-bold text-white bg-primary_main hover:bg-purple rounded-lg shadow-lg hover:bg-lightPrimaryfocus:outline-none ${
              loginLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <ThreeDots visible height='20' width='50' color='#ffffff' />
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex flex-wrap items-center justify-between gap-2'>
        <div className='text-sm text-muted-foreground'>
          <span className='mr-1 sm:inline-block'>Don't have an account?</span>
          <Link
            aria-label='Sign up'
            href='/auth/register'
            className='text-primary underline-offset-4 transition-colors hover:underline'
          >
            Sign up
          </Link>
        </div>
        <Link
          aria-label='Forgot password'
          href='/forgot-password'
          className='text-primary text-sm hover:underline'
        >
          Forgot password?
        </Link>
      </CardFooter>
    </>
  );
}
