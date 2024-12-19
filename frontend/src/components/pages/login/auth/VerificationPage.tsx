'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Remove useSearchParams
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
import {
  verifyAccount,
  requestNewVerificationCode,
} from '@/services/auth/auth';

import Image from 'next/image';
import { useUserStore } from '@/store/users';

export default function VerificationPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [from, setFrom] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Use URLSearchParams to extract query parameters directly from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const fromParam = searchParams.get('from');
    setFrom(fromParam);

    // 2. If user is logged in but not verified
    if (user && !user.isVerified) {
      // Redirect to /auth/verification-code unless already there
      if (!pathname.includes('/auth/verification-code')) {
        router.replace(`/auth/verification-code?from=${pathname}`);
      }
      return;
    }

    // 3. If user is verified
    if (user?.isVerified) {
      // Prevent access to verification-related pages
      if (
        pathname.includes('/auth/verify') ||
        pathname.includes('/verification-code')
      ) {
        router.replace(fromParam || '/'); // Redirect to "from" URL or homepage if none
      }
    }
  }, [pathname, router, user]);

  // Determine active tab based on pathname
  const getTabValueFromPathname = () => {
    if (pathname.includes('verification-code')) {
      return 'request';
    }
    return 'verify'; // Default to verify tab
  };

  // Tab change handler to update route
  const handleTabChange = (value: string) => {
    if (value === 'verify') {
      router.push('/auth/verify');
    } else if (value === 'request') {
      router.push('/auth/verification-code');
    }
  };

  // Handle account verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await verifyAccount({ email, verificationCode });
      if (response.status === 'success') {
        setSuccess(response.data.message);
        setTimeout(() => {
          router.push('/auth/login'); // Redirect after success
        }, 2000);
      } else {
        // Check if the error is related to an invalid/expired code
        if (
          response.message.includes('Invalid verification code') ||
          response.message.includes('expired')
        ) {
          setError(response.message);
        } else {
          setError(response.message);
        }
      }
    } catch (err) {
      console.log(err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request new verification code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await requestNewVerificationCode(email);
      if (response.status === 'success') {
        setSuccess(response.data.message);
        setTimeout(() => {
          router.push('/auth/verify'); // Redirect after success
        }, 2000); // Redirect to verify page
      } else {
        setError(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      // If the error is related to too many requests
      if (err.message === 'Too many requests, please try again later.') {
        setError('Too many requests, please try again later.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen'>
      {/* Left side image (hidden on small screens) */}
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src='/authImage/verify_image.jpg'
          alt='Real Estate'
          layout='fill'
          objectFit='cover'
        />
      </div>
      {/* Right side content: Form */}
      <div className='container min-h-screen py-10 w-full mx-auto lg:w-1/2 flex items-center justify-center p-8'>
        <Card className='w-full border-none max-w-md'>
          <CardHeader>
            <CardTitle>Account Verification</CardTitle>
            <CardDescription>
              Verify your account or request a new code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={getTabValueFromPathname()} // Active tab based on route
              onValueChange={handleTabChange} // Update route on tab change
            >
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='verify'>Verify Account</TabsTrigger>
                <TabsTrigger value='request'>Request New Code</TabsTrigger>
              </TabsList>
              {/* Verify Account Tab */}
              <TabsContent value='verify'>
                <form onSubmit={handleVerify} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='verify-email'>Email</Label>
                    <Input
                      id='verify-email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='code'>Verification Code</Label>
                    <Input
                      id='code'
                      type='text'
                      placeholder='Enter verification code'
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setError(''); // Clear error as user types
                      }}
                      required
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full bg-primary_main hover:bg-purple'
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Account'}
                  </Button>
                </form>
              </TabsContent>
              {/* Request New Code Tab */}
              <TabsContent value='request'>
                <form onSubmit={handleRequestCode} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='request-email'>Email</Label>
                    <Input
                      id='request-email'
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
                    disabled={isLoading}
                  >
                    {isLoading ? 'Requesting...' : 'Request New Code'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {error && (
              <Alert variant='destructive' className='mt-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  {/* Show button for invalid/expired code */}
                  {(error.includes('Invalid verification code') ||
                    error.includes('expired') ||
                    error.includes(
                      'No verification code found for this user'
                    )) && (
                    <Button
                      variant='link'
                      className='ml-2 text-blue-500'
                      onClick={() => router.push('/auth/verification-code')}
                    >
                      Request New Code
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className='mt-4'>
                <CheckCircle2 className='h-4 w-4' />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
