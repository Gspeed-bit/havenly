'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getChat, sendMessage } from '@/services/chat/chatServices';
import { useUserStore } from '@/store/users';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
  senderName: string;
}

interface ChatBoxProps {
  initialChatId?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ initialChatId }) => {
  const params = useParams();
  const chatId =
    initialChatId ||
    (Array.isArray(params.chatsId) ? params.chatsId[0] : params.chatsId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (response.status === 'success') {
          setMessages(response.data.messages);
        } else {
          console.error(response.message);
        }
      };

      fetchChat();

      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('chatClosed', (data: { message: string }) => {
        alert(data.message);
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('chatClosed');
      };
    }
  }, [socket, chatId]);

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
          // The message will be added to the state via the socket event
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
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Chat {chatId}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.sender === 'User' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start ${
                  message.sender === 'User' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className='w-8 h-8'>
                  <AvatarFallback>
                    {message.senderName
                      ? message.senderName[0].toUpperCase()
                      : message.sender === 'User'
                        ? 'U'
                        : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'User'
                      ? 'bg-violet text-white'
                      : 'bg-gray'
                  }`}
                >
                  <p className='font-semibold'>{message.senderName}</p>
                  <p>{message.content}</p>
                  <small className='text-xs opacity-50'>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className='flex w-full space-x-2'>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message'
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
        {user?.isAdmin && (
          <Button variant='destructive' onClick={closeChat}>
            Close Chat
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChatBox;
