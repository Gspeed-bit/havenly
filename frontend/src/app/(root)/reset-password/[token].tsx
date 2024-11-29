// src/app/reset-password/[token].tsx

'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Use Next.js navigation to access query params
import { resetPassword } from '@/services/auth'; // API function to handle password reset
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Access token from query params

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

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
    } else {
      setResetError(response.message);
    }
  };

  return (
    <div className='flex min-h-screen'>
      <div className='container min-h-screen py-10 w-full mx-auto lg:w-1/2 flex items-center justify-center p-8'>
        <Card className='w-full max-w-md'>
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
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
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
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
