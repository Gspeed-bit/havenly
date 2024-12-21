'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendInquiry } from '@/services/inquiry/inquiryService';


interface CreateInquiryProps {
  propertyId: string;
  onInquirySent: () => void;
}

const CreateInquiry: React.FC<CreateInquiryProps> = ({
  propertyId,
  onInquirySent,
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await sendInquiry(propertyId, message);
    setIsLoading(false);

    if (response.status === 'success') {
      toast({
        title: 'Inquiry Sent',
        description: 'Your inquiry has been successfully sent.',
      });
      setMessage('');
      onInquirySent();
    } else {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Enter your inquiry message...'
        required
      />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Inquiry'}
      </Button>
    </form>
  );
};

export default CreateInquiry;
