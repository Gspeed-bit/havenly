// src/app/chats/[chatsId]/page.tsx
'use client';


import ChatBox from '@/components/pages/Chat/ChatBox';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatsId;

  if (!chatId) {
    return <p>Chat not found</p>;
  }

  return (
    <div className='container mx-auto p-4'>
      <ChatBox
        initialChatId={Array.isArray(chatId) ? chatId[0] : chatId}
      />
    </div>
  );
}
