import { apiHandler } from '@/config/server';

export interface Chat {
  _id: string;
  propertyId: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface ChatResponse {
  status: 'success' | 'error';
  chat: Chat;
}

export interface MessagesResponse {
  status: 'success' | 'error';
  messages: Message[];
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Create a chat
export const createChat = async (
  propertyId: string,
  userId: string,
  message: string
): Promise<ChatResponse> => {
  const response = await apiHandler<ChatResponse>('/chats', 'POST', {
    propertyId,
    userId,
    message,
  });
  if (response.status === 'error') {
    throw new Error('Failed to create chat');
  }
  return response.data;
};

// Send a message in a chat
export const sendMessage = async (
  chatId: string,
  senderId: string,
  message: string
): Promise<{ status: 'success' | 'error'; message: string }> => {
  return await apiHandler<{ status: 'success' | 'error'; message: string }>(
    '/chats/message',
    'POST',
    { chatId, senderId, message }
  );
};

// Get all messages in a chat
export const getMessages = async (
  chatId: string
): Promise<MessagesResponse> => {
  const response = await apiHandler<MessagesResponse>(`/chats/${chatId}/messages`, 'GET');
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  return response.data;
};

