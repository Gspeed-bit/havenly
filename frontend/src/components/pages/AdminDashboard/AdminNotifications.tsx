'use client';

import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import { useUserStore } from '@/store/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatBox from '../Chat/ChatBox';

interface Notification {
  type: 'newChat' | 'newMessage';
  message: string;
  chatId: string;
}

const AdminDashboard: React.FC = () => {
  const [, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.io server');
      newSocket.emit('adminJoin', user._id);
    });

    newSocket.on(
      'newChatNotification',
      (data: { message: string; chatId: string }) => {
        setNotifications((prev) => [...prev, { type: 'newChat', ...data }]);
      }
    );

    newSocket.on(
      'newMessageNotification',
      (data: { message: string; chatId: string }) => {
        setNotifications((prev) => [...prev, { type: 'newMessage', ...data }]);
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleNotificationClick = (chatId: string) => {
    setActiveChatId(chatId);
    setNotifications((prev) => prev.filter((n) => n.chatId !== chatId));
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
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
            <CardTitle>Active Chat</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChatId ? (
              <ChatBox />
            ) : (
              <p>No active chat selected</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
