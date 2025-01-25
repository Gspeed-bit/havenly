'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCog,
  Activity,
  Building2,
  UserPlus,
  MessageCircle,
  Bell,
  Menu,
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import { useUserStore } from '@/store/users';

interface Notification {
  type:
    | 'newChat'
    | 'newMessage'
    | 'addProperty'
    | 'addCompany'
    | 'updateProfile';
  message: string;
  chatId?: string;
  date: string;
}

const DashboardPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('notifications') || '[]');
    }
    return [];
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const newSocket = io('https://havenly-chdr.onrender.com', {
      query: { userId: user._id, isAdmin: true },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to Socket.io server');
    });

    newSocket.on(
      'newChatNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New chat notification received:', data);
        addNotification('newChat', data.message, data.chatId);
      }
    );

    newSocket.on(
      'newMessageNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New message notification received:', data);
        addNotification('newMessage', data.message, data.chatId);
      }
    );

    // Simulating other types of notifications
    setTimeout(
      () => addNotification('addProperty', 'New property added'),
      1000
    );
    setTimeout(
      () => addNotification('addCompany', 'New company registered'),
      2000
    );
    setTimeout(
      () => addNotification('updateProfile', 'User profile updated'),
      3000
    );

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const addNotification = (
    type: Notification['type'],
    message: string,
    chatId?: string
  ) => {
    const newNotification: Notification = {
      type,
      message,
      chatId,
      date: new Date().toLocaleString(),
    };
    setNotifications((prev) => {
      const updatedNotifications = [newNotification, ...prev].slice(0, 10); // Keep only the latest 10 notifications
      localStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.chatId) {
      router.push(
        `/dashboard/notification?chatId=${notification.chatId}`
      );
    }
    // Handle other notification types if needed
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'newChat':
      case 'newMessage':
        return <MessageCircle className='h-4 w-4 text-blue-500' />;
      case 'addProperty':
        return <Building2 className='h-4 w-4 text-green-500' />;
      case 'addCompany':
        return <UserPlus className='h-4 w-4 text-purple-500' />;
      case 'updateProfile':
        return <UserCog className='h-4 w-4 text-orange-500' />;
      default:
        return <Bell className='h-4 w-4 text-gray-500' />;
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      <div className='flex-1 p-4 overflow-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Welcome to the Admin Dashboard</h1>
          <Button
            onClick={toggleSidebar}
            className='sm:hidden'
            variant='outline'
            size='icon'
          >
            <Menu className='h-4 w-4' />
          </Button>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>1,234</div>
              <p className='text-xs text-muted-foreground'>
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Admins
              </CardTitle>
              <UserCog className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>23</div>
              <p className='text-xs text-muted-foreground'>
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Users
              </CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>573</div>
              <p className='text-xs text-muted-foreground'>
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Bell className='h-5 w-5 mr-2' />
              Notifications
              {notifications.length > 0 && (
                <Badge variant='destructive' className='ml-2'>
                  {notifications.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className='h-[400px]'>
              {notifications.length > 0 ? (
                <div className='space-y-4'>
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className='flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-md cursor-pointer'
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className='text-lg'>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium'>{notification.message}</p>
                        <p className='text-sm text-muted-foreground'>
                          {notification.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground text-center py-4'>
                  No new notifications
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
