'use client';
import React, { useState } from 'react';

import { Button } from '../ui/button';
import Icon from '../icons/Icon';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [activeNav, setActiveNav] = useState('Home'); // Active navigation state

  const navItems = ['Home', 'About', 'Listings', 'Services', 'Blogs'];

  return (
    <nav className='bg-white'>
      <div className='container mx-auto flex justify-between items-center py-4 px-4 md:justify-center'>
        {/* Desktop Menu */}
        <div className='hidden lg:flex items-center space-x-6 absolute left-4'>
          {navItems.slice(0, 4).map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`px-4 py-2 text-sm font-medium ${
                activeNav === item
                  ? 'bg-blue text-darkGray rounded-full'
                  : 'text-darkGray hover:text-blue-700'
              }`}
              onClick={() => setActiveNav(item)} // Set active navigation
            >
              {item}
            </a>
          ))}
        </div>

        {/* Logo */}
        <div className='flex items-center space-x-2'>
          <div className='w-10 h-10 bg-primary_main rounded-full flex items-center justify-center'>
            <picture>
              <img
                src='/home.png'
                alt='Rezilla Logo'
                className='text-white  w-5 h-5'
              />
            </picture>
          </div>
          <span className='text-xl font-semibold'>Havenly</span>
        </div>

        {/* Mobile Menu Toggle */}
        <div className='absolute right-4'>
          <button
            className='md:hidden text-gray-700'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Icon
                type={'X'}
                color={'#3A0CA3'}
                strokeWidth={1.75}
                className='size-6'
              />
            ) : (
              <Icon
                type={'Menu'}
                color={'#3A0CA3'}
                strokeWidth={1.75}
                className='size-6'
              />
            )}
          </button>
        </div>

        {/* Actions */}
        <div className='hidden md:flex items-center space-x-4 absolute right-4'>
          <button className='text-sm font-medium text-gray-600 flex items-center space-x-2'>
            <Icon
              type={'CircleUserRound'}
              color={'#3A0CA3'}
              strokeWidth={1.75}
              className='size-6'
            />
            <span>Login/Register</span>
          </button>
          <Button className='bg-primary_main hover:bg-[#231640] text-white'>
            <picture>
              <img
                src='/home.png'
                alt='Rezilla Logo'
                className='text-white w-4 h-4'
              />
            </picture>
            <span> Add Listing</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t'>
          <div className='flex flex-col space-y-4 py-4 px-6'>
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium ${
                  activeNav === item
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
                onClick={() => {
                  setActiveNav(item);
                  setIsMobileMenuOpen(false); // Close menu after selection
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
