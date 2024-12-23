'use client';

import { ReactNode, useEffect } from 'react';
import useSocket from '@/lib/socket';

interface AppWrapperProps {
  children: ReactNode;
  isAdmin?: boolean;
}

function AppWrapper({ children, isAdmin }: AppWrapperProps) {
  const socket = useSocket(); // Initialize socket

  useEffect(() => {
    if (socket) {
      console.log(`Socket initialized for ${isAdmin ? 'Admin' : 'User'}.`);

      socket.on('notification', (data) => {
        console.log('Notification received:', data);
      });

      if (isAdmin) {
        socket.on('adminAlert', (data) => {
          console.log('Admin alert received:', data);
        });
      }

      return () => {
        socket.off('notification');
        if (isAdmin) {
          socket.off('adminAlert');
        }
      };
    }
  }, [socket, isAdmin]);

  return <>{children}</>;
}

export default AppWrapper;
