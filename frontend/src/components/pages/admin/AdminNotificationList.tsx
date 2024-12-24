'use client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiHandler } from '@/config/server';

import React, { useState } from 'react';

const RespondToInquiry: React.FC<{
  inquiryId: string;
  userId: string;
}> = ({ inquiryId }) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiHandler(`/inquiries/${inquiryId}/respond`, 'POST', {
        response,
      });
      if (res.status === 'success') {
        alert('Response sent successfully');
        setResponse('');
      } else {
        alert('Error sending response');
      }
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      alert('Error responding to inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder='Enter your response...'
        required
        disabled={isSubmitting}
      />
      <Button type='submit' disabled={isSubmitting || !response.trim()}>
        {isSubmitting ? 'Sending...' : 'Send Response'}
      </Button>
    </form>
  );
};

export default RespondToInquiry;
