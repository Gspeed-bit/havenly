'use client';
import useSocket from '@/lib/socket';
import React, { useEffect, useState } from 'react';

const NotificationSection = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data: string) => {
        setNotifications((prev) => [...prev, data]);
      });

      // Cleanup listener on unmount
      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  return (
    <div className='notification-section'>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationSection;
