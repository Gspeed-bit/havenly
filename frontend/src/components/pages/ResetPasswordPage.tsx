'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Use useParams for dynamic route params
import { requestResetPassword, resetPassword } from '@/services/auth'; // API functions
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router

const ResetPasswordPage = () => {
  const { token } = useParams(); // Access the token from the URL
  const [activeTab, setActiveTab] = useState<'request' | 'reset'>('request'); // Default to 'request' tab

  // Request Reset Password State
  const [email, setEmail] = useState('');
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  // Handle Request Reset Password
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestLoading(true);
    setRequestMessage(null);
    setRequestError(null);

    const response = await requestResetPassword(email);
    setIsRequestLoading(false);

    if (response.status === 'success') {
      setRequestMessage('Reset link sent to your email!');
    } else {
      setRequestError(response.message);
    }
  };

  // Handle Reset Password
  const router = useRouter(); // Initialize the router
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match!');
      return;
    }

    setIsResetLoading(true);
    setResetMessage(null);
    setResetError(null);

    const response = await resetPassword(token as string, newPassword);
    setIsResetLoading(false);

    if (response.status === 'success') {
      setResetMessage('Password has been reset!');
      router.push('/auth/login'); // Redirect to login page
    } else {
      setResetError(response.message);
    }
  };

  // Automatically switch to reset tab if token is present
  useEffect(() => {
    if (token) {
      setActiveTab('reset'); // Switch to 'reset' tab if a token is present
    }
  }, [token]);

  return (
    <div className='flex min-h-screen'>
      {/* Left side image (hidden on small screens) */}
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src='/authImage/password.png'
          alt='Real Estate'
          layout='fill'
          objectFit='cover'
        />
      </div>
      {/* Right side content: Form */}
      <div className='container min-h-screen py-10 w-full mx-auto lg:w-1/2 flex items-center justify-center p-8'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Reset or Request Password</CardTitle>
            <CardDescription>
              Reset your password securely or request a password reset link to
              your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as 'request' | 'reset')
              }
              className='w-full'
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger
                  value='request'
                  className={activeTab === 'request' ? 'border-blue-500' : ''}
                >
                  Request Reset
                </TabsTrigger>
                <TabsTrigger
                  value='reset'
                  disabled={!token} // Disable if no token
                  className={
                    activeTab === 'reset' ? 'border-b-2 border-blue-500' : ''
                  }
                >
                  Reset Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value='request'>
                <CardHeader>
                  <CardTitle>Request Password Reset</CardTitle>
                  <CardDescription>
                    Enter your email to receive a password reset link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type='submit'
                      className='w-full bg-primary_main hover:bg-purple'
                      disabled={isRequestLoading}
                    >
                      {isRequestLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  {requestError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{requestError}</AlertDescription>
                    </Alert>
                  )}
                  {requestMessage && (
                    <Alert>
                      <CheckCircle2 className='h-4 w-4' />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{requestMessage}</AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </TabsContent>

              <TabsContent value='reset'>
                <CardHeader>
                  <CardTitle>Reset Your Password</CardTitle>
                  <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetSubmit} className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='new-password'>New Password</Label>
                      <Input
                        id='new-password'
                        type='password'
                        placeholder='Enter new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='confirm-password'>
                        Confirm New Password
                      </Label>
                      <Input
                        id='confirm-password'
                        type='password'
                        placeholder='Confirm new password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type='submit'
                      className='w-full bg-primary_main hover:bg-purple'
                      disabled={isResetLoading}
                    >
                      {isResetLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  {resetError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{resetError}</AlertDescription>
                    </Alert>
                  )}
                  {resetMessage && (
                    <Alert>
                      <CheckCircle2 className='h-4 w-4' />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{resetMessage}</AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
