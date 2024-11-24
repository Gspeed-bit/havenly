'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '../components/pages/Header';
import Navigation from '../components/pages/Navigation';
import MainContent from '../components/pages/MainContent';
import LoginForm from '../components/pages/login/LoginForm';
import UserProfile from '../components/pages/UserProfile';

export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='min-h-screen'>
      {/* Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <Image
          src='/parabola-bg.png'
          alt=''
          fill
          priority
          className='object-cover'
        />
      </div>

      <Header />
      <Navigation
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <MainContent />
      <div className='flex flex-col justify-center items-center '>
        <LoginForm />
        <UserProfile />
      </div>
    </div>
  );
}
