'use client';

import useSocket from '@/lib/socket';
import React, { useEffect, useState } from 'react';

const InquirySection = () => {
  const socket = useSocket();
  const [responses, setResponses] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on('inquiryResponse', (data: string) => {
        setResponses((prev) => [...prev, data]);
      });

      return () => {
        socket.off('inquiryResponse');
      };
    }
  }, [socket]);

  return (
    <div className='inquiry-section'>
      <h2>Responses</h2>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>{response}</li>
        ))}
      </ul>
    </div>
  );
};

export default InquirySection;
