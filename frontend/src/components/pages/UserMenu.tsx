'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@store/auth';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const UserMenu: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setHydrated(true); // Resolve server-side rendering issues
  }, []);

  if (!hydrated) return null;

  // Predefined color map for letters A-Z
  const letterColorMap: Record<string, string> = {
    A: '#EF4444', // Red
    B: '#3B82F6', // Blue
    C: '#10B981', // Green
    D: '#F59E0B', // Yellow
    E: '#8B5CF6', // Purple
    F: '#EC4899', // Pink
    G: '#6366F1', // Indigo
    H: '#14B8A6', // Teal
    I: '#F97316', // Orange
    J: '#4B5563', // Gray
    K: '#22C55E', // Emerald
    L: '#A855F7', // Violet
    M: '#D946EF', // Fuchsia
    N: '#0EA5E9', // Sky
    O: '#DB2777', // Rose
    P: '#7C3AED', // Purple Deep
    Q: '#059669', // Green Dark
    R: '#9CA3AF', // Cool Gray
    S: '#1D4ED8', // Blue Dark
    T: '#D97706', // Amber
    U: '#6D28D9', // Indigo Deep
    V: '#D1D5DB', // Light Gray
    W: '#4ADE80', // Lime
    X: '#FACC15', // Yellow Lime
    Y: '#EA580C', // Orange Deep
    Z: '#9D174D', // Burgundy
  };

  // Default color if letter is invalid
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
          <PopoverContent className='w-48 bg-white shadow-lg rounded-md'>
            <div className='py-2'>
              <p className='px-4 py-2 text-sm text-gray-700'>
                {user.firstName} {user.lastName}
              </p>
              <hr className='my-1 border-gray-200' />
              <Link
                href='/profile'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Profile
              </Link>
              <Link
                href='/settings'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                }}
                className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
              >
                Logout
              </button>
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
