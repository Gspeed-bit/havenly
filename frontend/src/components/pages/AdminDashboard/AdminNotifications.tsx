'use client';

import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useUserStore } from '@/store/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatBox from '@/components/pages/Chat/ChatBox';

interface Notification {
  type: 'newChat' | 'newMessage';
  message: string;
  chatId: string;
}

const AdminDashboard: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeChats, setActiveChats] = useState<string[]>(
    () => JSON.parse(localStorage.getItem('activeChats') || '[]') // Load from local storage
  );
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

    newSocket.on(
      'newChatNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New chat notification received:', data);
        setNotifications((prev) => [...prev, { type: 'newChat', ...data }]);
      }
    );

    newSocket.on(
      'newMessageNotification',
      (data: { message: string; chatId: string }) => {
        console.log('New message notification received:', data);
        setNotifications((prev) => [...prev, { type: 'newMessage', ...data }]);
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    localStorage.setItem('activeChats', JSON.stringify(activeChats)); // Save active chats to local storage
  }, [activeChats]);

  const handleNotificationClick = (chatId: string) => {
    setActiveChats((prev) => {
      if (!prev.includes(chatId)) {
        return [...prev, chatId];
      }
      return prev;
    });
    setNotifications((prev) => prev.filter((n) => n.chatId !== chatId));
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 gap-4'>
        <Card className='h-50'>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.map((notification, index) => (
              <Button
                key={index}
                onClick={() => handleNotificationClick(notification.chatId)}
                className='w-full mb-2'
                variant={
                  notification.type === 'newChat' ? 'default' : 'outline'
                }
              >
                {notification.message}
              </Button>
            ))}
            {notifications.length === 0 && <p>No new notifications</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Chats</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChats.map((chatId) => (
              <ChatBox key={chatId} initialChatId={chatId} />
            ))}
            {activeChats.length === 0 && <p>No active chats</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
