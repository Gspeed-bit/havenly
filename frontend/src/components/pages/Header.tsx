'use client';
import React from 'react';
import Icon from '../../components/icons/Icon';

const Header = () => {
  return (
    <header className='bg-primary_main text-white w-full'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center py-2'>
          <div className='flex items-center space-x-2'>
            <Icon
              type='MapPin'
              color='#ffffff'
              strokeWidth={1.75}
              className='size-4'
            />
            <span className='text-sm'>Havenly, 18 Grattan St, Brooklyn</span>
          </div>
          <div className='hidden md:flex items-center space-x-6'>
            <span className='text-sm'>+1 206-214-2298</span>
            <span className='text-sm'>support@rezilla.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
