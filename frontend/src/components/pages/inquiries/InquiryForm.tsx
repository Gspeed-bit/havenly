'use client'; 
import React, { useState } from 'react';
import { useUserStore } from '@/store/users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSocketStore } from '@/store/socket';

const InquiryForm: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [inquiryMessage, setInquiryMessage] = useState('');
  const { user } = useUserStore();
  const { sendInquiry } = useSocketStore();

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user._id) return;

    sendInquiry({
      propertyId,
      userId: user._id,
      message: inquiryMessage,
    });

    setInquiryMessage('');
    alert('Inquiry sent successfully!');
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
