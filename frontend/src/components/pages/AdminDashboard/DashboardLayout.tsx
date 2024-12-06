'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  UserCog,
  Menu,
  LayoutDashboard,
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@store/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { logOutUser } from '@/services/auth/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    // Update page title based on current path
    const title = pathname.split('/').pop();
    if (pathname.includes('/update-profile')) {
      setPageTitle('Profile');
    } else {
      setPageTitle(
        title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Dashboard'
      );
    }
  }, [pathname]);

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
      href: '/dashboard/update-profile',
      icon: UserCog,
      label: 'Profile',
    },
    { href: '/dashboard/users', icon: Users, label: 'Users' },
    { href: '/dashboard/admins', icon: UserCog, label: 'Admins' },
  ];

  const sidebarContent = (
    <>
      <SidebarHeader className='p-4'>
        <Sheet>
          <SheetHeader className='flex items-center space-x-2'>
            <SheetTitle className='text-sm md:text-lg font-bold'>{`${user?.lastName}'s Dashboard`}</SheetTitle>
            <SheetDescription className='text-center'>
              Navigate through the admin dashboard
            </SheetDescription>
          </SheetHeader>
        </Sheet>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className='flex items-center p-2 rounded-lg transition-colors hover:bg-gray-100'
                  onClick={() => setOpen(false)}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='pt-10 px-1'>
        <div className='flex items-center space-x-3'>
          <Avatar>
            <AvatarImage src={user?.imgUrl} />
            <AvatarFallback>
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium'>{user?.firstName}</p>
            <p className='text-xs text-gray-500'>{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className='container mx-auto flex h-screen overflow-hidden bg-gray-50'>
        <Sidebar className='hidden lg:flex bg-white border-r'>
          {sidebarContent}
        </Sidebar>

        <div className='flex-1 flex flex-col overflow-hidden'>
          <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTitle className='hidden'>
                <VisuallyHidden.Root>x</VisuallyHidden.Root>
              </SheetTitle>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='lg:hidden'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-[250px] sm:w-[300px] bg-white'
              >
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <SidebarTrigger className='hidden lg:flex' />
            <h1 className='font-semibold text-xl'>{pageTitle}</h1>

            <div className='ml-auto flex items-center space-x-4'>
              <div className='relative hidden md:block'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
                <Input
                  type='search'
                  placeholder='Search...'
                  className='pl-8 w-[200px] lg:w-[300px]'
                />
              </div>
              <Button variant='ghost' size='icon'>
                <Bell className='h-5 w-5' />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex items-center space-x-2'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={user?.imgUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className='hidden md:inline-block'>
                      {user?.firstName}
                    </span>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href='/'>Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOutUser}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className='flex-1 overflow-auto p-6'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
