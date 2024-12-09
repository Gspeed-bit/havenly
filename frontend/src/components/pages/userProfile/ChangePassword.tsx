'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { changePassword } from '@/services/user/userApi';
import { useRouter } from 'next/navigation';
import { authStoreActions } from '@/store/auth';
import { motion } from 'framer-motion';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

type AlertState = {
  type: 'default' | 'destructive' | null;
  message: string;
};

export function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Track if the user starts typing

  const [alertState, setAlertState] = useState<AlertState>({
    type: null,
    message: '',
  });
  const router = useRouter();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setLoading(true);
    try {
      const response = await changePassword(
        data.currentPassword,
        data.newPassword
      );

      if (response.status === 'success') {
        setAlertState({
          type: 'default',
          message: 'Your password has been changed successfully.',
        });
        form.reset();

        authStoreActions.clearAuth();
        setTimeout(() => {
          router.push('/auth/login');
        }, 500);
      } else {
        setAlertState({
          type: 'destructive',
          message:
            response.message || 'Failed to change password. Please try again.',
        });
      }
    } catch (error) {
      console.log(error);
      setAlertState({
        type: 'destructive',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const strengthChecks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return strengthChecks.filter(Boolean).length * 20;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='w-full bg-white shadow-xl rounded-2xl overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-primary_main to-violet text-white p-6'>
          <CardTitle className='text-2xl font-extrabold'>
            Change Password
          </CardTitle>
          <CardDescription className='text-blue-600'>
            Enhance your account security by updating your password.
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-4 pb-6 px-4'>
          {alertState.type && (
            <Alert
              variant={alertState.type}
              className='mb-4 lg:mb-6 border-l-4 bg-opacity-50'
            >
              <AlertTitle
                className={`text-base lg:text-lg font-semibold ${
                  alertState.type === 'default'
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}
              >
                {alertState.type === 'default' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription
                className={
                  alertState.type === 'default'
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {alertState.message}
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 lg:space-y-6'
            >
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...field}
                          className='pl-10 pr-10 py-2 lg:py-3 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                        />
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4 lg:h-5 lg:w-5' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600'
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className='h-4 w-4 lg:h-5 lg:w-5' />
                          ) : (
                            <Eye className='h-4 w-4 lg:h-5 lg:w-5' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          {...field}
                          onInput={() => setIsTyping(true)} // Set typing flag to true
                          className='pl-10 pr-10 py-2 lg:py-3 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                        />
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4 lg:h-5 lg:w-5' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600'
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className='h-4 w-4 lg:h-5 lg:w-5' />
                          ) : (
                            <Eye className='h-4 w-4 lg:h-5 lg:w-5' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {isTyping && ( // Only show the progress bar if user is typing
                      <div className='mt-2'>
                        <Progress
                          value={getPasswordStrength(field.value)}
                          className='h-2'
                        />
                        <p className='text-xs text-blue-600 mt-1'>
                          Password strength:{' '}
                          {getPasswordStrength(field.value) <= 40
                            ? 'Weak'
                            : getPasswordStrength(field.value) <= 70
                              ? 'Moderate'
                              : 'Strong'}
                        </p>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className='pl-10 pr-10 py-2 lg:py-3 bg-white/50 border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                        />
                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4 lg:h-5 lg:w-5' />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-blue-600'
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4 lg:h-5 lg:w-5' />
                          ) : (
                            <Eye className='h-4 w-4 lg:h-5 lg:w-5' />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                disabled={loading}
                className='w-full sm:w-auto bg-gradient-to-r from-primary_main to-purple text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105'
              >
                <Lock className='mr-2 h-4 w-4 lg:h-5 lg:w-5' />
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
