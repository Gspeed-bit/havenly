'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getChat } from '@/services/chat/chatServices';
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
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
}

const ChatBox: React.FC = () => {
  const { chatsId: chatIdFromUrl } = useParams(); // Get the chatId from the URL params

  // Handle cases where chatIdFromUrl is an array
  const chatId = Array.isArray(chatIdFromUrl)
    ? chatIdFromUrl[0]
    : chatIdFromUrl;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) {
      console.error('Chat ID is undefined.');
      return;
    }

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinChat', chatId); // Use chatId here

    return () => {
      newSocket.disconnect();
    };
  }, [chatId]);

  useEffect(() => {
    if (socket && chatId) {
      const fetchChat = async () => {
        const response = await getChat(chatId); // Use chatId here
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

  const sendMessage = () => {
    if (newMessage.trim() && socket && user) {
      const message: Message = {
        sender: user.isAdmin ? 'admin' : 'user',
        content: newMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);

      socket.emit('sendMessage', {
        chatId, // Use chatId here
        content: newMessage,
        sender: message.sender,
      });

      setNewMessage('');
    }
  };

  const closeChat = () => {
    if (socket && chatId) {
      socket.emit('closeChat', chatId); // Use chatId here
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
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className='w-8 h-8'>
                  <AvatarFallback>
                    {message.sender === 'user' ? 'U' : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-violet text-white'
                      : 'bg-gray-200'
                  }`}
                >
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
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
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
