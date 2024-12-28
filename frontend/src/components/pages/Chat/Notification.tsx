'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({
  message,
  onClose,
  type = 'info',
}) => {
  const getNotificationClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue text-white';
      default:
        return 'bg-blue text-white';
    }
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${getNotificationClass()}`}
    >
      <p>{message}</p>
      <Button
        variant='ghost'
        onClick={onClose}
        className='text-white hover:bg-opacity-80'
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default Notification;
