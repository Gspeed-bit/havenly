'use client';
import { apiHandler } from '@/config/server';
import { useUserStore } from '@/store/users';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const InquiryForm: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [inquiryMessage, setInquiryMessage] = useState('');
  const { user } = useUserStore();

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const response = await apiHandler('/inquiries/send', 'POST', {
      propertyId,
      userId: user._id,
      message: inquiryMessage,
    });

    if (response.status === 'success') {
      setInquiryMessage('');
      alert('Inquiry sent successfully!');
      
    } else {
      alert('Failed to send inquiry. Please try again.');
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
          />
          <Button type='submit'>Send Inquiry</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InquiryForm;
