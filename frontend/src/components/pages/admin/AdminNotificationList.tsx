'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiHandler, SuccessResponse } from '@/config/server';
import socket from '@/lib/socket';

interface Inquiry {
  _id: string;
  propertyId: string;
  userId: string;
  message: string;
  isResponded: boolean;
  response: string;
}

const AdminDashboard: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Using useEffect to ensure we fetch inquiries once on mount
  useEffect(() => {
    const fetchInquiries = async () => {
      const response = await apiHandler<SuccessResponse<Inquiry[]>>(
        '/inquiry',
        'GET'
      );
      if (response.status === 'success' && Array.isArray(response.data.data)) {
        setInquiries(response.data.data);
      } else {
        console.error('Inquiries response is not an array');
      }
    };

    fetchInquiries();

    // Setup socket listener for new inquiries
    const handleNewInquiry = (inquiry: Inquiry) => {
      setInquiries((prev) => [inquiry, ...prev]);
    };

    socket.on('newInquiry', handleNewInquiry);

    // Cleanup on component unmount
    return () => {
      socket.off('newInquiry', handleNewInquiry);
    };
  }, []); // Empty dependency array to run only once on mount

  const handleResponse = async (inquiryId: string, response: string) => {
    const res = await apiHandler(`/inquiries/${inquiryId}/respond`, 'POST', {
      response,
    });
    if (res.status === 'success') {
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === inquiryId ? { ...inq, isResponded: true, response } : inq
        )
      );
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Admin Dashboard - Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[500px]'>
          {Array.isArray(inquiries) && inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <Card key={inquiry._id} className='mb-4 p-4'>
                <p>
                  <strong>Property:</strong> {inquiry.propertyId}
                </p>
                <p>
                  <strong>User:</strong> {inquiry.userId}
                </p>
                <p>
                  <strong>Message:</strong> {inquiry.message}
                </p>
                {inquiry.isResponded ? (
                  <p>
                    <strong>Response:</strong> {inquiry.response}
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const response = (e.target as HTMLFormElement).response
                        .value;
                      handleResponse(inquiry._id, response);
                    }}
                    className='mt-2'
                  >
                    <Textarea
                      name='response'
                      placeholder='Enter your response...'
                      required
                    />
                    <Button type='submit' className='mt-2'>
                      Send Response
                    </Button>
                  </form>
                )}
              </Card>
            ))
          ) : (
            <p>No inquiries available.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
