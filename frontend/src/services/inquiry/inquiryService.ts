import { apiHandler, ApiResponse } from "@/config/server";

export interface Inquiry {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
  };
  message: string;
  customMessage?: string;
  status: 'Submitted' | 'Under Review' | 'Answered';
  createdAt: string;
  updatedAt: string;
}

export interface InquiryListResponse {
  message: string;
  inquiries: Inquiry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const sendInquiry = async (
  propertyId: string,
  message: string
): Promise<ApiResponse<Inquiry>> => {
  return apiHandler<Inquiry>('/inquiries/send', 'POST', {
    propertyId,
    message,
  });
};

export const getInquiries = async (
  status?: string,
  propertyId?: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<InquiryListResponse>> => {
  const params = { status, propertyId, page, limit };
  return apiHandler<InquiryListResponse>(
    '/inquiries',
    'GET',
    undefined,
    params
  );
};

export const updateInquiryStatus = async (
  id: string,
  status: 'Submitted' | 'Under Review' | 'Answered',
  customMessage?: string
): Promise<ApiResponse<Inquiry>> => {
  return apiHandler<Inquiry>(`/inquiries/${id}`, 'PUT', {
    status,
    customMessage,
  });
};
