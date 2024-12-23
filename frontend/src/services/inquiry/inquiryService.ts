import { apiHandler } from '@/config/server';

// In a file like src/types/inquiryTypes.ts
export interface InquiryData {
  propertyId: string;
  userId: string;
  message: string;
  
  // Add other fields as necessary
}

export interface Inquiry {
  id: string;
  data: InquiryData;
  status: string;
  // Add other fields as necessary
}



// Create a new inquiry
export const createInquiry = async (inquiryData: InquiryData) => {
  const response = await apiHandler<{ inquiry: Inquiry }>(
    '/inquiries', // Replace with your actual endpoint
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