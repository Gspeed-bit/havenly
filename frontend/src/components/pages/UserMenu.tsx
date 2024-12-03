'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@store/auth';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import Page from '../common/links/page';
import { Button } from '../ui/button';
import Icon from '../icons/Icon';

const UserMenu: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin); // Check if the user is an admin

  useEffect(() => {
    setHydrated(true); // Resolve server-side rendering issues
  }, []);

  if (!hydrated) return null;

  // Predefined color map for letters A-Z
  const letterColorMap: Record<string, string> = {
    A: '#EF4444',
    B: '#3B82F6',
    C: '#10B981',
    D: '#F59E0B',
    E: '#8B5CF6',
    F: '#EC4899',
    G: '#6366F1',
    H: '#14B8A6',
    I: '#F97316',
    J: '#4B5563',
    K: '#22C55E',
    L: '#A855F7',
    M: '#D946EF',
    N: '#0EA5E9',
    O: '#DB2777',
    P: '#7C3AED',
    Q: '#059669',
    R: '#9CA3AF',
    S: '#1D4ED8',
    T: '#D97706',
    U: '#6D28D9',
    V: '#D1D5DB',
    W: '#4ADE80',
    X: '#FACC15',
    Y: '#EA580C',
    Z: '#9D174D',
  };

  const defaultColor = '#374151'; // Neutral Gray

  const getUserInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getColorForLetter = (letter: string): string => {
    return letterColorMap[letter.toUpperCase()] || defaultColor;
  };

  const userInitials = getUserInitials(
    user?.firstName || '',
    user?.lastName || ''
  );
  const backgroundColor = getColorForLetter(user?.lastName?.charAt(0) || '');

  return (
    <div className='relative'>
      {isAuthenticated && user ? (
        <Popover>
          <PopoverTrigger asChild>
            <div className='w-10 h-10 cursor-pointer flex items-center justify-center'>
              {user.imgUrl ? (
                <picture>
                  <img
                    src={user.imgUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className='object-cover w-full h-full rounded-full'
                  />
                </picture>
              ) : (
                <span
                  className='text-sm w-10 h-10 rounded-full font-medium flex items-center justify-center'
                  style={{ backgroundColor, color: 'white' }}
                >
                  {userInitials}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className='mt-2 w-52 rounded-lg shadow-lg border-none'>
            <div className=' '>
              <div className='py-3'>
                <p className='text-xs font-semibold'>
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div className='border-t border-gray-200'></div>
              <ul className='py-1'>
                {isAdmin && (
                  <li>
                    <Link
                      href='/dashboard'
                      className='flex items-center py-2 text-sm hover:text-violet'
                    >
                      <Icon
                        type='LayoutDashboard'
                        color='#3A0CA3'
                        strokeWidth={1.75}
                        className='mr-2 h-4 w-4'
                      />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href={Page.getProfile()}
                    className='flex items-center py-2 text-sm hover:text-violet'
                  >
                    <Icon
                      type='User'
                      color='#3A0CA3'
                      strokeWidth={1.75}
                      className='mr-2 h-4 w-4'
                    />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href={Page.getAdminLogs()}
                    className='flex items-center py-2 text-sm hover:text-violet'
                  >
                    <Icon
                      type='Inbox'
                      color='#3A0CA3'
                      strokeWidth={1.75}
                      className='mr-2 h-4 w-4'
                    />
                    Inbox
                  </Link>
                </li>
                <li>
                  <Link
                    href={Page.getSettings()}
                    className='flex items-center py-2 text-sm hover:text-violet'
                  >
                    <Icon
                      type='Home'
                      color='#3A0CA3'
                      strokeWidth={1.75}
                      className='mr-2 h-4 w-4'
                    />
                    Properties
                  </Link>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      useAuthStore.getState().logout();
                    }}
                    className='flex items-center justify-start w-full py-2 text-left text-sm bg-primary_main hover:bg-red-600 hover:text-white'
                  >
                    <Icon
                      type='LogOut'
                      color='#ffffff'
                      strokeWidth={1.75}
                      className='mr-2 h-4 w-4'
                    />
                    Sign Out
                  </Button>
                </li>
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Link
          href='/auth/login'
          className='text-sm text-gray-600 hover:text-gray-800'
        >
          Login / Register
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
