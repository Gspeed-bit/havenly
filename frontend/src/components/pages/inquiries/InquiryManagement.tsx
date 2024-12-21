'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getInquiries,
  Inquiry,
  updateInquiryStatus,
} from '@/services/inquiry/inquiryService';
import { Pagination } from '@/components/ui/pagination/pagination';

const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [propertyFilter, setPropertyFilter] = useState<string>('');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const response = await getInquiries(
      statusFilter,
      propertyFilter,
      currentPage
    );
    if (response.status === 'success') {
      setInquiries(response.data.inquiries);
      setTotalPages(response.data.pagination.totalPages);
    } else {
      setError(response.message);
    }
    setLoading(false);
  }, [statusFilter, propertyFilter, currentPage]);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, statusFilter, propertyFilter, fetchInquiries]);

  const handleStatusUpdate = async (
    id: string,
    newStatus: 'Submitted' | 'Under Review' | 'Answered'
  ) => {
    const response = await updateInquiryStatus(id, newStatus);
    if (response.status === 'success') {
      fetchInquiries();
    } else {
      setError(response.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Inquiry Management</h1>
      <div className='flex mb-4 space-x-4'>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <option value=''>All Statuses</option>
          <option value='Submitted'>Submitted</option>
          <option value='Under Review'>Under Review</option>
          <option value='Answered'>Answered</option>
        </Select>
        <Input
          type='text'
          placeholder='Filter by Property ID'
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        />
      </div>
      {inquiries.map((inquiry) => (
        <Card key={inquiry._id} className='mb-4'>
          <CardHeader>
            <CardTitle>{inquiry.propertyId?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>From:</strong> {inquiry.userId?.name} (
              {inquiry.userId?.email})
            </p>
            <p>
              <strong>Message:</strong> {inquiry?.message}
            </p>
            <p>
              <strong>Status:</strong> {inquiry?.status}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
            <div className='mt-2'>
              <Button
                onClick={() => handleStatusUpdate(inquiry._id, 'Under Review')}
                disabled={inquiry.status === 'Under Review'}
                className='mr-2'
              >
                Mark Under Review
              </Button>
              <Button
                onClick={() => handleStatusUpdate(inquiry._id, 'Answered')}
                disabled={inquiry.status === 'Answered'}
              >
                Mark Answered
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default InquiryManagement;
