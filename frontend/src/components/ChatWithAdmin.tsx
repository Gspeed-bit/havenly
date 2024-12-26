'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { apiHandler } from '@/config/server';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  propertyId: string;
  users: string[];
  messages: Message[];
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatData {
  message: string;
  chat?: Chat;
  _id?: string;
}

interface ChatWithAdminProps {
  propertyId: string;
  userId: string;
}

export function ChatWithAdmin({ propertyId, userId }: ChatWithAdminProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadChatHistory = useCallback(async () => {
    if (!chatId) return;
    try {
      const response = await apiHandler<ChatData>(`/chats/${chatId}/messages`, 'GET');
      if (response.status === 'success' && response.data && response.data.chat) {
        setMessages(response.data.chat.messages);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  }, [chatId]);

  useEffect(() => {
    if (propertyId && userId) {
      initializeChat();
    }
  }, [propertyId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      const intervalId = setInterval(loadChatHistory, 3000); // Poll every 3 seconds
      return () => clearInterval(intervalId);
    }
  }, [chatId, loadChatHistory]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler<ChatData>(`/chats`, 'POST', {
        propertyId,
        userId,
      });

      if (response.status === 'success' && response.data) {
        setMessages(response.data.chat?.messages || []);
        setChatId(response.data.chat?._id || response.data._id || null);
      } else {
        setError('Failed to initialize chat. Please try again.');
      }
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError('Failed to initialize chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    setIsLoading(true);
    try {
      const response = await apiHandler<ChatData>('/chats/message', 'POST', {
        chatId,
        senderId: userId,
        message: newMessage,
      });

      if (response.status === 'success') {
        // Optimistically update the UI
        const optimisticMessage: Message = {
          _id: Date.now().toString(), // Temporary ID
          sender: userId,
          content: newMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, optimisticMessage]);
        setNewMessage('');
        
        // Reload messages to ensure consistency with server
        await loadChatHistory();
      } else {
        console.error('Failed to send message:', response);
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Chat with Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 p-2 border rounded">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`mb-2 p-2 rounded ${
                message.sender === userId ? 'bg-blue-100 text-right' : 'bg-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

