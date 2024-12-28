'use client';
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ChatResponse,
  getChat,
  sendMessage,
} from '@/services/chat/chatServices';
import { useUserStore } from '@/store/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, X } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  senderName: string;
}

interface ChatBoxProps {
  initialChatId: string;
  onClose?: (chatId: string) => void;
  onNotify?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  initialChatId,
  onClose,
  onNotify,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  // Store property agent
  const { user } = useUserStore();
  const [propertyData, setPropertyData] = useState<ChatResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const chatId =
    initialChatId ||
    (Array.isArray(params.chatsId) ? params.chatsId[0] : params.chatsId);

  useEffect(() => {
    if (!chatId || !user) return;

    const newSocket = io('http://localhost:5000', {
      query: { userId: user._id, isAdmin: user.isAdmin ? 'true' : 'false' },
    });
    setSocket(newSocket);

    newSocket.emit('joinChat', chatId);

    return () => {
      newSocket.disconnect();
    };
  }, [chatId, user]);

  useEffect(() => {
    if (socket && chatId) {
      const fetchChat = async () => {
        const response = await getChat(chatId);
        console.log(response);
        if (response.status === 'success') {
          setMessages(response.data.messages);
          setPropertyData({
            ...response.data, // This will spread all the data (messages, isClosed, etc.)
          });
        } else {
          console.error(response.message);
        }
      };

      fetchChat();

      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        if (onNotify) {
          onNotify(`New message from ${message.senderName}`);
        }
      });

      socket.on('chatClosed', (data: { message: string }) => {
        alert(data.message);
        if (onNotify) {
          onNotify('Chat has been closed');
        }
        onClose && onClose(chatId);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('chatClosed');
      };
    }
  }, [socket, chatId, onClose, onNotify]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId && user) {
      const messageData = {
        chatId,
        content: newMessage,
        sender: user.isAdmin ? 'Admin' : 'User',
        senderName: user.firstName || 'Unknown',
      };
      try {
        const response = await sendMessage(messageData);
        if (response.status === 'success') {
          setNewMessage('');
        } else {
          console.error('Failed to send message:', response.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const closeChat = () => {
    if (socket && chatId) {
      socket.emit('closeChat', chatId);
    }
  };

  return (
    <div className='flex flex-col h-full w-full max-w-2xl mx-auto'>
      <div className='bg-primary text-primary-foreground p-2 sm:p-4 flex justify-between items-center'>
        <h2 className='text-lg sm:text-xl font-semibold'>
          {/* Display property details inside a div */}
          {propertyData ? (
            <>
              <div>Agent: {propertyData?.data.propertyDetails.agentName}</div>
              <div>
                Company: {propertyData?.data.propertyDetails.companyName}
              </div>
              <div>Title: {propertyData?.data.propertyDetails.title}</div>
            </>
          ) : (
            <div>Loading property details...</div>
          )}
        </h2>
        {user?.isAdmin && (
          <Button
            variant='ghost'
            size='icon'
            onClick={closeChat}
            className='text-primary-foreground hover:bg-primary/90'
          >
            <X className='h-4 w-4 sm:h-5 sm:w-5' />
          </Button>
        )}
      </div>
      <ScrollArea className=' h-[600px] p-2 sm:p-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 sm:mb-4 ${
              message.sender === 'User' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-end space-x-1 sm:space-x-2 ${
                message.sender === 'User'
                  ? 'flex-row-reverse space-x-reverse sm:space-x-reverse'
                  : 'flex-row'
              }`}
            >
              <Avatar className='w-6 h-6 sm:w-8 sm:h-8'>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderName}`}
                />
                <AvatarFallback>
                  {message.senderName
                    ? message.senderName[0].toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[70%] p-2 sm:p-3 rounded-lg text-sm ${
                  message.sender === 'User'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                }`}
              >
                <p className='font-semibold text-xs sm:text-sm'>
                  {message.senderName}
                </p>
                <p className='mt-1'>{message.content}</p>
                <p className='text-xs opacity-70 mt-1 text-right'>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className='p-2 sm:p-4 bg-background'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className='flex space-x-2'
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message'
            className='flex-grow'
          />
          <Button
            type='submit'
            size='icon'
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            <Send className='h-4 w-4' />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
