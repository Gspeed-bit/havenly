import { apiHandler, ApiResponse } from '@/config/server';

const API_BASE = '/chats'; // Adjust as per your API base path

export interface ChatResponse {
  data: {
    _id: string;
  };
  messages: Array<{
    sender: 'user' | 'admin';
    content: string;
    timestamp: string;
  }>;
  isClosed: boolean;
}

export interface MessageResponse {
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
}

export const startChat = async ({
  propertyId,
}: {
  propertyId: string;
}): Promise<ApiResponse<ChatResponse>> => {
  const response = apiHandler<ChatResponse>(`${API_BASE}/start`, 'POST', {
    propertyId,
  });
  return response;
};

export const sendMessage = async ({
  chatId,
  content,
}: {
  chatId: string;
  content: string;
}): Promise<ApiResponse<MessageResponse>> => {
  return apiHandler<MessageResponse>(`${API_BASE}/message`, 'POST', {
    chatId,
    content,
  });
};

export const closeChat = async (chatId: string): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`${API_BASE}/${chatId}/close`, 'PUT');
};

export const getChat = async (
  chatId: string
): Promise<ApiResponse<ChatResponse>> => {
  return apiHandler<ChatResponse>(`${API_BASE}/${chatId}`, 'GET');
};

export const fetchActiveChats = async (
): Promise<ApiResponse<ChatResponse>> => {
  return apiHandler<ChatResponse>(`${API_BASE}/active`, 'GET');
};
