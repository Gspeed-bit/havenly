'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, UserCog, Menu, LayoutDashboard } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
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
import { useAuthStore } from '@store/auth'; // Import auth store for user data
import UserMenu from '../UserMenu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user); // Fetch user details from auth store

  const sidebarContent = (
    <>
      <SidebarHeader>
        <h2 className='text-lg font-semibold px-6 py-4'>Admin Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard'}>
              <Link href='/dashboard' className='flex items-center'>
                <LayoutDashboard className='mr-2 h-4 w-4' />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/users'}
            >
              <Link href='/dashboard/users' className='flex items-center'>
                <Users className='mr-2 h-4 w-4' />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/admins'}
            >
              <Link href='/dashboard/admins' className='flex items-center'>
                <UserCog className='mr-2 h-4 w-4' />
                <span>Admins</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );

  return (
    <SidebarProvider>
      <div className='flex h-screen overflow-hidden bg-gray-100'>
        <Sidebar className='hidden lg:flex bg-white border-r'>
          {sidebarContent}
        </Sidebar>

        <div className='flex-1 overflow-auto'>
          <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm'>
            <Sheet open={open} onOpenChange={setOpen}>
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
                <SheetHeader>
                  <SheetTitle>Admin Dashboard</SheetTitle>
                  <SheetDescription>
                    Navigate through the admin dashboard
                  </SheetDescription>
                </SheetHeader>
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <SidebarTrigger className='hidden lg:flex' />
            <h1 className='font-semibold text-lg'>Dashboard</h1>

            {/* Display Admin Name and UserMenu */}
            <div className='ml-auto flex items-center space-x-4'>
              {user && (
                <span className='text-sm font-medium text-gray-700'>
                  {user.firstName} {user.lastName}
                </span>
              )}
              <UserMenu />
            </div>
          </header>
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
