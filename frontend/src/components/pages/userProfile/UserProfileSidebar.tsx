import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Settings,
  Lock,
  Bell,
  HelpCircle,
  LogOut,
  Home,
} from 'lucide-react';
import { useUserStore } from '@/store/users';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const links: SidebarLink[] = [
  {
    href: '/',
    label: 'Home',
    icon: <Home className='w-5 h-5' />,
  },
  {
    href: '/user-profile',
    label: 'Profile',
    icon: <User className='w-5 h-5' />,
  },
  {
    href: '/profile/settings',
    label: 'Account Settings',
    icon: <Settings className='w-5 h-5' />,
  },
  {
    href: '/profile/security',
    label: 'Security',
    icon: <Lock className='w-5 h-5' />,
  },
  {
    href: '/profile/notifications',
    label: 'Notifications',
    icon: <Bell className='w-5 h-5' />,
  },
  {
    href: '/profile/help',
    label: 'Help & Support',
    icon: <HelpCircle className='w-5 h-5' />,
  },
];

export function UserProfileSidebar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  return (
    <div className='flex flex-col h-full bg-gradient-to-b from-blue-50 to-indigo-100 text-gray-800 rounded-lg shadow-lg overflow-hidden'>
      <div className='p-6 flex flex-col items-center'>
        <Avatar className='w-24 h-24 mb-4'>
          <AvatarImage src={user?.imgUrl} alt={user?.firstName} />
          <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className='text-xl font-bold mb-1'>{user?.firstName}</h2>
        <p className='text-sm text-gray-600 mb-4'>{user?.email}</p>
      </div>
      <nav className='flex-1 overflow-y-auto'>
        <ul className='space-y-2 p-4'>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} passHref>
                <Button
                  variant='ghost'
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    pathname === link.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-blue-50 hover:text-blue-600'
                  )}
                >
                  {link.icon}
                  <span className='ml-3'>{link.label}</span>
                  {pathname === link.href && (
                    <motion.div
                      className='absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r'
                      layoutId='sidebar-indicator'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='p-4 border-t border-gray-200'>
        <Button
          variant='ghost'
          className='w-full justify-start text-left font-normal text-red-600 hover:bg-red-50 hover:text-red-700'
        >
          <LogOut className='w-5 h-5 mr-3' />
          Logout
        </Button>
      </div>
    </div>
  );
}
