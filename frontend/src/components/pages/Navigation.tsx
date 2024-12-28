'use client';

import React, { useEffect, useState } from 'react';
import Icon from '../icons/Icon';
import Link from 'next/link';
import Page from '@components/common/links/page';
import UserMenu from './UserMenu';
import { useUserStore } from '@/store/users';
import { useAuthStore } from '@/store/auth';
import { useNotificationStore } from '@/store/notification';
import { Bell } from 'lucide-react';
import { getChat } from '@/services/chat/chatServices'; // Import getChat service

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [activeNav, setActiveNav] = useState('Home');
  const [hydrated, setHydrated] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null); // State for chatId

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.isAdmin === true;

  // Get notifications from Zustand store
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setHydrated(true);

    // Fetch chatId if authenticated
    if (isAuthenticated && user) {
      const fetchChat = async () => {
        try {
          if (user._id) {
            const response = await getChat(user._id); // Fetch chat ID for the user
            if (response.status === 'success') {
              setChatId(response.data.data._id); // Set chatId from response
            }
          }
        } catch {
          console.error('No existing chat found.');
        }
      };
      fetchChat();
    }
  }, [isAuthenticated, user]);

  if (!hydrated) return null;

  const userNavItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Profile', path: '/user-profile' },
    { label: 'Listings', path: '/listings' },
    { label: 'Services', path: '/services' },
    { label: 'Inquiries', path: '/inquiries' },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard/admins' },
    { label: 'Manage Admins', path: '/dashboard/admins' },
    { label: 'Manage Users', path: '/dashboard/users' },
    { label: 'Profile', path: '/dashboard/update-profile' },
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
            {/* Bell Notification */}
          <Link href={`/user-dashboard?chatId=${chatId}`} className="relative">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

            {/* User Menu */}
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
