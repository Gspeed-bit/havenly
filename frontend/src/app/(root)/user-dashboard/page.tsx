'use client';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ChatBox from '@/components/pages/Chat/ChatBox';
export default function UserDashboard() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get('chatId');
  const { toast } = useToast();

  const handleNotification = (message: string) => {
    toast({
      description: message, 
      type: 'foreground', 
      duration: 5000, 
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
}
