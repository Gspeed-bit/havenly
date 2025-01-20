'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Home,
  User,
  Settings,
  Lock,
  Bell,
  HelpCircle,
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
import { useUserStore } from '@/store/users';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const user = useUserStore((state) => state.user);

  const menuItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/user-profile', icon: User, label: 'Profile' },
    { href: '/profile/settings', icon: Settings, label: 'Account Settings' },
    { href: '/profile/security', icon: Lock, label: 'Security' },
    { href: '/profile/notifications', icon: Bell, label: 'Notifications' },
    { href: '/profile/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  useEffect(() => {
    const title = pathname.split('/').pop();
    if (pathname.includes('/user-profile')) {
      setPageTitle('Profile');
    } else {
      setPageTitle(
        title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Dashboard'
      );
    }
  }, [pathname]);

  // Loading State for User
  if (!user) {
    return <p className='p-6 text-center'>Loading...</p>;
  }

  const sidebarContent = (
    <>
      <SidebarHeader className='p-6'>
        <Sheet>
          <SheetHeader className='flex flex-col items-start space-y-2'>
            <SheetTitle className='text-2xl font-bold text-primary'>
              {`${user.firstName || 'User'}'s Dashboard`}
            </SheetTitle>
            <SheetDescription className='text-sm text-muted-foreground'>
              Navigate through the user dashboard
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
                  className='flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground'
                  onClick={() => setOpen(false)}
                >
                  <item.icon className='mr-3 h-5 w-5' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-6'>
        <div className='flex items-center space-x-4 bg-muted p-4 rounded-lg'>
          <Avatar className='h-10 w-10 border-2 border-primary'>
            <AvatarImage src={user.imgUrl} />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {user.firstName?.[0] || 'U'}
              {user.lastName?.[0] || 'N'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm font-medium'>{user.firstName || 'User'}</p>
            <p className='text-xs text-muted-foreground'>
              {user.email || 'Loading...'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className='flex h-screen overflow-hidden bg-background'>
        <Sidebar className='hidden lg:flex border-r border-border'>
          {sidebarContent}
        </Sidebar>
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Header */}
          <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-6'>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTitle className='hidden'>
                <VisuallyHidden.Root>Menu</VisuallyHidden.Root>
              </SheetTitle>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='lg:hidden'>
                  <Menu className='h-6 w-6' />
                  <span className='sr-only'>Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-[280px] sm:w-[350px] bg-background'
              >
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <SidebarTrigger className='hidden lg:flex' />
            <h1 className='font-semibold text-xl text-foreground'>
              {pageTitle}
            </h1>
            <div className='ml-auto flex items-center space-x-4'>
              <div className='relative hidden md:block'>
                <Input
                  type='search'
                  placeholder='Search...'
                  className='pl-10 w-[200px] lg:w-[300px] bg-muted'
                />
              </div>
              <Button variant='ghost' size='icon'>
                <Bell className='h-5 w-5' />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground'
                  >
                    <Avatar className='h-8 w-8 border border-border'>
                      <AvatarImage src={user.imgUrl} />
                      <AvatarFallback className='bg-primary text-primary-foreground'>
                        {user.firstName?.[0] || 'U'}
                        {user.lastName?.[0] || 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <span className='hidden md:inline-block font-medium'>
                      {user.firstName || 'User'}
                    </span>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href='/' className='flex w-full'>
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                 
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          {/* Main Content */}
          <main className='flex-1 overflow-auto p-6 bg-accent/5'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='max-w-7xl mx-auto'
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
