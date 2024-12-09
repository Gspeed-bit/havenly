'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/components/pages/AuthLayout';
import Login from '@/components/pages/login/Login';
import Signup from '@/components/pages/SignUp/Signup';
import NotAuthenticated from '@/components/authLayout/NotAuthenticated';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/auth/register') {
      setActiveTab('signup');
    } else if (pathname === '/auth/login') {
      setActiveTab('login');
    }
  }, [pathname]);

  return (
   <NotAuthenticated>
      <AuthLayout
        title='Welcome to Havenly'
        description='Enter your email below to create your account or log in'
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'login' | 'signup');
            router.push(value === 'login' ? '/auth/login' : '/auth/register');
          }}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 mb-4'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value='login'>
            <Login />
          </TabsContent>
          <TabsContent value='signup'>
            <Signup />
          </TabsContent>
        </Tabs>
      </AuthLayout>
   </NotAuthenticated>
  );
}
