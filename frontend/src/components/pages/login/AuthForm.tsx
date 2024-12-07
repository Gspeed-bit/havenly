'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { login, signUp } from '../../../services/auth/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThreeDots } from 'react-loader-spinner';
import useLoading from '../../hooks/useLoading';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const router = useRouter();
  const pathname = usePathname();
  const {
    loading: loginLoading,
    startLoading: startLoginLoading,
    stopLoading: stopLoginLoading,
  } = useLoading();
  const {
    loading: signUpLoading,
    startLoading: startSignUpLoading,
    stopLoading: stopSignUpLoading,
  } = useLoading();

  useEffect(() => {
    if (pathname === '/auth/register') {
      setActiveTab('signup');
    } else if (pathname === '/auth/login') {
      setActiveTab('login');
    }

    const rememberMeValue = localStorage.getItem('rememberMe');
    if (rememberMeValue === 'true') {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
        setRememberMe(true);
      }
    }
  }, [pathname]);

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

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email');
        }

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else if (result.message === 'Account not verified') {
        setAlertState({
          type: 'error',
          message:
            'Your account is not verified. Redirecting to verification...',
        });

        setTimeout(() => {
          router.push('/auth/verification-code');
        }, 2000);
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
          router.push('/verify');
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
    <div className='flex min-h-screen'>
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src='/authImage/auth.jpg'
          alt='Real Estate'
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <Card className='border-none shadow-lg w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold text-center'>
              Welcome to Havenly
            </CardTitle>
            <CardDescription className='text-center'>
              Enter your email below to create your account or log in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as 'login' | 'signup');
                router.push(
                  value === 'login' ? '/auth/login' : '/auth/register'
                );
              }}
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-2 mb-4'>
                <TabsTrigger value='login'>Login</TabsTrigger>
                <TabsTrigger value='signup'>Sign Up</TabsTrigger>
              </TabsList>
              {alertState.type && (
                <Alert
                  variant={
                    alertState.type === 'success' ? 'default' : 'destructive'
                  }
                  className='mb-4 sticky top-0 z-50 transition-opacity duration-500 ease-in-out'
                >
                  <AlertTitle>
                    {alertState.type === 'success' ? 'Success' : 'Error'}
                  </AlertTitle>
                  <AlertDescription>{alertState.message}</AlertDescription>
                </Alert>
              )}
              <TabsContent value='login'>
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='remember'
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked === true)
                        }
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
                      <ThreeDots
                        visible
                        height='20'
                        width='50'
                        color='#ffffff'
                      />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value='signup'>
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
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
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
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
                        <Link
                          href='/terms'
                          className='text-primary hover:underline'
                        >
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
                      <ThreeDots
                        visible
                        height='20'
                        width='50'
                        color='#ffffff'
                      />
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className='flex flex-wrap items-center justify-between gap-2'>
            <div className='text-sm text-muted-foreground'>
              <span className='mr-1 sm:inline-block'>
                {activeTab === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </span>
              <Link
                aria-label={activeTab === 'login' ? 'Sign up' : 'Log in'}
                href={activeTab === 'login' ? '/auth/register' : '/auth/login'}
                className='text-primary underline-offset-4 transition-colors hover:underline'
              >
                {activeTab === 'login' ? 'Sign up' : 'Login'}
              </Link>
            </div>
            <Link
              aria-label='Forgot password'
              href='/forgot-password'
              className='text-primary text-sm hover:underline'
            >
              {activeTab === 'login' ? 'Forgot password?' : ''}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
