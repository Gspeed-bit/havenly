'use client';
import React, { useEffect, useState } from 'react';
import Icon from '../icons/Icon';
import Link from 'next/link';
import { useAuthStore } from '@store/auth';
import Page from '@components/common/links/page';
import UserMenu from './UserMenu';

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [activeNav, setActiveNav] = useState('Home'); // Active navigation state
  const [hydrated, setHydrated] = useState(false); // Hydration state

  // Get authentication and admin status from store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin); // Assuming `isAdmin` is part of the auth state

  useEffect(() => {
    setHydrated(true); // Set hydration state to true after mounting
  }, []);
  if (!hydrated) return null;
  // Define navigation items for regular users and admins
  const userNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Profile', path: '/user-profile' },
    { label: 'Listings', path: '/listings' },
    { label: 'Services', path: '/services' },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Analytics', path: '/admin/analytics' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className='bg-white'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center py-4 justify-between'>
          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-primary_main rounded-full flex items-center justify-center'>
              <picture>
                <img src='/home.png' alt='Havenly Logo' className='w-5 h-5' />
              </picture>
            </div>
            <span className='text-xl font-semibold'>Havenly</span>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-6'>
            {navItems.map(({ label, path }) => (
              <Link
                key={label}
                href={path}
                className={`px-4 py-2 text-sm font-medium ${
                  activeNav === label
                    ? 'bg-blue text-darkGray rounded-full'
                    : 'text-darkGray hover:text-blue-700'
                }`}
                onClick={() => setActiveNav(label)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className='hidden md:flex items-center space-x-4'>
            {!hydrated ? null : isAuthenticated ? (
              <div className='hidden md:flex items-center space-x-4'>
                <UserMenu />
              </div>
            ) : (
              <button className='text-sm font-medium text-gray-600 flex items-center space-x-2'>
                <Icon
                  type='CircleUserRound'
                  color='#3A0CA3'
                  strokeWidth={1.75}
                  className='size-6'
                />
                <Link href={Page.getLogin()}>Login/Register</Link>
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            className='md:hidden text-gray-700'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Icon
                type='X'
                color='#3A0CA3'
                strokeWidth={1.75}
                className='size-6'
              />
            ) : (
              <Icon
                type='Menu'
                color='#3A0CA3'
                strokeWidth={1.75}
                className='size-6'
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t'>
          <div className='flex flex-col space-y-4 py-4 px-6'>
            {navItems.map(({ label, path }) => (
              <Link
                key={label}
                href={path}
                className={`text-sm font-medium ${
                  activeNav === label
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
                onClick={() => {
                  setActiveNav(label);
                  setIsMobileMenuOpen(false);
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
