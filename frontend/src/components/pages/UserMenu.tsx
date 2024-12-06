import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@store/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Icon from '@/components/icons/Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserMenu: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin); // Check if the user is an admin

  useEffect(() => {
    setHydrated(true); // Resolve server-side rendering issues
  }, []);

  if (!hydrated) return null;

  return (
    <div className='relative'>
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center space-x-2 cursor-pointer'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src={user?.imgUrl} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className='hidden md:inline-block font-medium'>
                {user?.firstName}
              </span>
              <Icon
                type='ChevronDown'
                color='#000'
                strokeWidth={1.75}
                className='h-4 w-4'
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-52 mt-2 rounded-lg shadow-md border'
          >
            <div className='py-2 px-4'>
              <p className='text-sm font-semibold'>
                {user?.firstName} {user?.lastName}
              </p>
              <p className='text-xs text-gray-500'>{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard'
                  className='flex items-center py-2 px-4 text-sm hover:text-violet'
                >
                  <Icon
                    type='LayoutDashboard'
                    color='#3A0CA3'
                    strokeWidth={1.75}
                    className='mr-2 h-4 w-4'
                  />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link
                href='/profile'
                className='flex items-center py-2 px-4 text-sm hover:text-violet'
              >
                <Icon
                  type='User'
                  color='#3A0CA3'
                  strokeWidth={1.75}
                  className='mr-2 h-4 w-4'
                />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/settings'
                className='flex items-center py-2 px-4 text-sm hover:text-violet'
              >
                <Icon
                  type='Settings'
                  color='#3A0CA3'
                  strokeWidth={1.75}
                  className='mr-2 h-4 w-4'
                />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                onClick={() => useAuthStore.getState().logout()}
                className='w-full py-2 px-4 text-sm text-left bg-red-500 hover:bg-red-200'
              >
                <Icon
                  type='LogOut'
                  color='#ffffff'
                  strokeWidth={1.75}
                  className='mr-2 h-4 w-4'
                />
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
