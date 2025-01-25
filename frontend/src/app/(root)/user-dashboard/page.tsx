'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import ChatBox from '@/components/pages/Chat/ChatBox';

const UserDashboardContent = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');

  const handleNotification = (message: string) => {
    toast(message, {
      position: 'top-right',
      duration: 3000,
    });
  };

  return (
    <div className='container mx-auto p-4'>
      {chatId ? (
        <ChatBox initialChatId={chatId} onNotify={handleNotification} />
      ) : (
        <p>Select a chat to start messaging.</p>
      )}
    </div>
  );
};

export default function UserDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserDashboardContent />
    </Suspense>
  );
}
