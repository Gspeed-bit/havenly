import { apiHandler, SuccessResponse } from '@/config/server';

// Define Inquiry Types (You can adjust the types as per your backend response)
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Property {
  _id: string;
  title: string;
}

// Updated Inquiry Interface
export interface Inquiry {
  _id: string;
  propertyId: Property;
  userId: User; // User details are populated
  message: string;
  isResponded: boolean;
  response?: string; // Response is optional
  createdAt: Date;
  updatedAt: Date;
}

// Create a new inquiry
export const createInquiry = async (inquiryData: Inquiry) => {
  const response = await apiHandler<{ inquiry: Inquiry }>(
    '/inquiries/send', // Replace with your actual endpoint
    'POST',
    inquiryData
  );

  if (response.status === 'success') {
    return response.data.inquiry;
  } else {
    console.error('Error creating inquiry:', response.message);
    return null;
  }
};

// Get all admin inquiries
export const fetchInquiriesForAdmin = async () => {
  const response = await apiHandler<SuccessResponse<{ inquiries: Inquiry[] }>>(
    '/inquiry', // Replace with your actual endpoint
    'GET'
  );

  if (response.status === 'success') {
    return response.data.data;
  } else {
    console.error('Error fetching inquiries:', response.message);
    return [];
  }
};

// Get all user inquiries
export const fetchInquiriesForUser = async (_id: string) => {
  const response = await apiHandler<SuccessResponse<{ inquiries: Inquiry[] }>>(
    '/user/inquiries', // Replace with your actual endpoint
    'GET',
    { userId: _id } // Pass userId if needed in request body or URL params
  );

  if (response.status === 'success') {
    return response.data.data;
  } else {
    console.error('Error fetching inquiries:', response.message);
    return [];
  }
};
