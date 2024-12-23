'use client';
import React, { useState, useEffect } from 'react';
import { apiHandler } from '@/config/server';
import { useUserStore } from '@/store/users';
import socket from '@/lib/socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      const response = await apiHandler<{
        status: string;
        data: Notification[];
      }>(`/notifications`, 'GET');

      if (response.status === 'success') {
        setNotifications(response.data.data); // Set only the data array
      }
    };

    fetchNotifications();

    // Listen for new notifications
    socket.on('newNotification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [user]);
  const markAsRead = async (notificationId: string) => {
    const response = await apiHandler(
      `/notifications/${notificationId}/read`,
      'PUT'
    );
    if (response.status === 'success') {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    }
  };
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[300px]'>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id} // Use the correct unique identifier
                className={`p-2 mb-2 rounded ${notification.isRead ? 'bg-gray-100' : 'bg-blue-100'}`}
                onClick={() =>
                  !notification.isRead && markAsRead(notification._id)
                }
              >
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationList;
