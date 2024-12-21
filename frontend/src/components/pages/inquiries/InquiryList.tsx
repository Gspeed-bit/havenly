'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getInquiries, Inquiry } from '@/services/inquiry/inquiryService';
import { Pagination } from '@/components/ui/pagination/pagination';
import UpdateInquiryStatus from './UpdateInquiryStatus';

const InquiryList: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [propertyFilter, setPropertyFilter] = useState<string>('');

  const fetchInquiries = React.useCallback(async () => {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='space-y-4'>
      <div className='flex space-x-4'>
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
        <Card key={inquiry._id}>
          <CardHeader>
            <CardTitle>{inquiry.propertyId.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>From:</strong> {inquiry.userId.name} (
              {inquiry.userId.email})
            </p>
            <p>
              <strong>Message:</strong> {inquiry.message}
            </p>
            <p>
              <strong>Status:</strong> {inquiry.status}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
            <UpdateInquiryStatus
              inquiry={inquiry}
              onStatusUpdated={fetchInquiries}
            />
          </CardContent>
        </Card>
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default InquiryList;
