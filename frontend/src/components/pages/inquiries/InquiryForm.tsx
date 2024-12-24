'use client';
import React, { useState } from 'react';
import { useUserStore } from '@/store/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSocketStore } from '@/store/socket';
import { apiHandler, ApiResponse } from '@/config/server';

interface InquiryResponse {
  propertyId: string;
  userId: string;
  message: string;
  isResponded: boolean;
}

const InquiryForm: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const { sendInquiry } = useSocketStore();

const handleInquirySubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user || !user._id || !inquiryMessage) {
    alert('Please fill in all required fields.');
    return;
  }

  setIsLoading(true);
  try {
   const payload = {
     propertyId,
     userId: user._id,
     userEmail: user.email, // lowercase userEmail
     userName:
       user.firstName && user.lastName
         ? `${user.firstName} ${user.lastName}`
         : 'Unknown User',

     message: inquiryMessage,
   };
    console.log('Submitting inquiry:', payload); // Debugging

    const response: ApiResponse<InquiryResponse> = await apiHandler(
      '/inquiries/send',
      'POST',
      payload
    );

    if (response.status === 'success') {
      sendInquiry(payload);
      setInquiryMessage('');
      alert('Inquiry sent successfully!');
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('Error sending inquiry:', error);
    alert('Failed to send inquiry. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send an Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInquirySubmit} className='space-y-4'>
          <Textarea
            value={inquiryMessage}
            onChange={(e) => setInquiryMessage(e.target.value)}
            placeholder='Enter your inquiry...'
            required
            disabled={isLoading}
          />
          <Button type='submit' disabled={isLoading || !inquiryMessage.trim()}>
            {isLoading ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InquiryForm;
