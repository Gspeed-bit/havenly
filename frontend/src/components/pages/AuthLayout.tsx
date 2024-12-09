import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Page from '@/components/common/links/page';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
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
          <CardHeader className='flex justify-center items-center'>
            <div className='w-10 h-10 bg-primary_main rounded-full flex items-center justify-center'>
              <Link href={Page.getHome()}>
                <picture>
                  <img src='/home.png' alt='Rezilla Logo' className='w-5 h-5' />
                </picture>
              </Link>
            </div>

            <CardTitle className='text-2xl font-bold text-center'>
              {title}
            </CardTitle>
            <CardDescription className='text-center'>
              {description}
            </CardDescription>
          </CardHeader>
          {children}
        </Card>
      </div>
    </div>
  );
}
