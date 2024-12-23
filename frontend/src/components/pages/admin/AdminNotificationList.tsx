'use client';
import { useSocketStore } from '@/store/socket';
import React, { useState } from 'react';

const RespondToInquiry: React.FC<{ inquiryId: string; userId: string }> = ({
  inquiryId: _inquiryId,
  userId,
}) => {
  const [responseMessage, setResponseMessage] = useState('');
  const { respondToInquiry } = useSocketStore();

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    respondToInquiry({
      userId,
      message: responseMessage,
    });

    setResponseMessage('');
    alert('Response sent successfully!');
  };

  return (
    <form onSubmit={handleResponseSubmit}>
      <textarea
        value={responseMessage}
        onChange={(e) => setResponseMessage(e.target.value)}
        placeholder='Enter your response...'
        required
      />
      <button type='submit'>Send Response</button>
    </form>
  );
};

export default RespondToInquiry;
