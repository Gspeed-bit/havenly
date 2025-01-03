'use client';

import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUserStore } from '@/store/users';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ChatBox from '../Chat/ChatBox';
import { apiHandler } from '@/config/server';

interface Notification {
  type: 'newChat' | 'newMessage';
  message: string;
  chatId: string;
}

const AdminDashboard: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  });
  const [activeChats, setActiveChats] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('activeChats') || '[]')
  );
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const newSocket = io('http://localhost:5000', {
      query: { userId: user._id, isAdmin: true },
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Admin connected to Socket.io server');
    });

    newSocket.on('chatClosed', (data: { chatId: string }) => {
      console.log(
        `Chat closed notification received for chatId: ${data.chatId}`
      );
      handleCloseChat(data.chatId);
    });

    newSocket.on(
      'newChatNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New chat notification received:', data);
        setNotifications((prev) => {
          const updatedNotifications: Notification[] = [
            ...prev,
            { type: 'newChat', ...data },
          ];
          localStorage.setItem(
            'notifications',
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });
      }
    );

    newSocket.on(
      'newMessageNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New message notification received:', data);
        setNotifications((prev) => {
          const updatedNotifications: Notification[] = [
            ...prev,
            { type: 'newMessage', ...data },
          ];
          localStorage.setItem(
            'notifications',
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    localStorage.setItem('activeChats', JSON.stringify(activeChats));
  }, [activeChats]);

  const handleNotificationClick = (chatId: string) => {
    setActiveChats((prev) => {
      if (!prev.includes(chatId)) {
        return [...prev, chatId];
      }
      return prev;
    });
    setNotifications((prev) => {
      const updatedNotifications = prev.filter((n) => n.chatId !== chatId);
      localStorage.setItem(
        'notifications',
        JSON.stringify(updatedNotifications)
      );
      return updatedNotifications;
    });
    setSelectedChat(chatId);
  };

  const handleCloseChat = async (chatId: string) => {
    try {
      // Make the API call to close the chat using the apiHandler
      const response = await apiHandler<{
        agentName: string;
        agentContact: string;
      }>(`/chats/${chatId}/close`, 'PUT');

      if (response.status === 'success') {
        setActiveChats((prev) => {
          const updatedChats = prev.filter((id) => id !== chatId);
          localStorage.setItem('activeChats', JSON.stringify(updatedChats));
          return updatedChats;
        });

        if (selectedChat === chatId) {
          setSelectedChat(null);
        }

        toast.message('Chat Closed', {
          description: `Chat ${chatId} has been closed successfully.`,
          duration: 1000,
        });

        console.log(`Chat ${chatId} has been closed and cleanup is done.`);
      }
    } catch (error) {
      toast.error('An error occurred while closing the chat.');
      console.error('Error closing chat:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className='flex flex-col sm:flex-row h-screen bg-gray-100'>
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-full sm:w-80' : 'w-0'
        } ${isSidebarOpen ? 'block' : 'hidden sm:block'}`}
      >
        {isSidebarOpen && (
          <div className='h-full flex flex-col'>
            <div className='p-4 bg-primary text-primary-foreground'>
              <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
            </div>
            <div className='flex-1 overflow-hidden'>
              <div className='p-4'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Bell className='h-5 w-5 mr-2' />
                  Notifications
                  {notifications.length > 0 && (
                    <Badge variant='destructive' className='ml-2'>
                      {notifications.length}
                    </Badge>
                  )}
                </h2>
                <ScrollArea className='h-40 rounded-md border'>
                  {notifications.map((notification, index) => (
                    <Button
                      key={index}
                      onClick={() =>
                        handleNotificationClick(notification.chatId)
                      }
                      className='w-full justify-start text-left p-2 hover:bg-gray-100'
                      variant='ghost'
                    >
                      <MessageSquare className='h-4 w-4 mr-2 flex-shrink-0' />
                      <span className='truncate text-sm'>
                        {notification.message}
                      </span>
                    </Button>
                  ))}
                  {notifications.length === 0 && (
                    <p className='text-muted-foreground text-center py-4'>
                      No new notifications
                    </p>
                  )}
                </ScrollArea>
              </div>
              <Separator />
              <div className='p-4'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <MessageSquare className='h-5 w-5 mr-2' />
                  Active Chats
                  {activeChats.length > 0 && (
                    <Badge variant='secondary' className='ml-2'>
                      {activeChats.length}
                    </Badge>
                  )}
                </h2>
                <ScrollArea className='h-[calc(100vh-280px)] sm:h-[calc(100vh-320px)]'>
                  {activeChats.map((chatId) => (
                    <Button
                      key={chatId}
                      onClick={() => setSelectedChat(chatId)}
                      className={`w-full justify-start text-left p-2 mb-2 ${
                        selectedChat === chatId
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      }`}
                      variant='ghost'
                    >
                      <Avatar className='h-10 w-10 mr-3'>
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${chatId}`}
                        />
                        <AvatarFallback>
                          {chatId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className='flex flex-col items-start'>
                        <span className='font-medium'>
                          {user?.firstName || 'User'}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          Last message...
                        </span>
                      </div>
                    </Button>
                  ))}
                  {activeChats.length === 0 && (
                    <p className='text-muted-foreground text-center py-4'>
                      No active chats
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='flex-1 flex flex-col'>
        <Button
          onClick={toggleSidebar}
          className='absolute top-4 left-4 z-10 sm:hidden'
          variant='outline'
          size='icon'
        >
          <Menu className='h-4 w-4' />
        </Button>
        <div className='flex-1 p-4 overflow-auto'>
          {selectedChat ? (
            <ChatBox initialChatId={selectedChat} onClose={handleCloseChat} />
          ) : (
            <div className='h-full flex items-center justify-center text-muted-foreground'>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
