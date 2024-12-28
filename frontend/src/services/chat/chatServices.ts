import { apiHandler, ApiResponse } from '@/config/server';

const API_BASE = '/chats';

export interface ChatResponse {
  data: {
    _id: string;
    propertyDetails: {
      agentName: string;
      companyName: string;
      title: string;
    };
  };
  messages: Array<{
    sender: 'user' | 'admin';
    content: string;
    timestamp: string;
    senderName: string;
  }>;

  isClosed: boolean;
}

export interface MessageResponse {
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
  senderName: string;
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
  sender,
  senderName,
}: {
  chatId: string;
  content: string;
  sender: string;
  senderName: string;
}): Promise<ApiResponse<MessageResponse>> => {
  return apiHandler<MessageResponse>(`${API_BASE}/message`, 'POST', {
    chatId,
    content,
    sender,
    senderName,
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

export const getChatByUserAndProperty = async (
  propertyId: string
): Promise<ApiResponse<ChatResponse>> => {
  return apiHandler<ChatResponse>(`chat/${propertyId}`, 'GET');
};
