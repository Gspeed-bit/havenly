'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchInquiriesForUser,
  Inquiry,
} from '@/services/inquiry/inquiryService';
import { useUserStore } from '@/store/users';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';

const UserInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { user } = useUserStore();

  useEffect(() => {
    const getUserInquiries = async () => {
      if (!user || !user._id) return;

      try {
        setIsLoading(true);
        const response = await fetchInquiriesForUser(user._id);
        if (Array.isArray(response)) {
          setInquiries(response);
          setFilteredInquiries(response);
        } else {
          console.error('Error: Invalid response data:', response);
          setInquiries([]);
          setFilteredInquiries([]);
        }
      } catch (error) {
        console.error('Failed to fetch inquiries:', error);
        setInquiries([]);
        setFilteredInquiries([]);
      } finally {
        setIsLoading(false);
      }
    };

    getUserInquiries();
  }, [user]);

  useEffect(() => {
    const filtered = inquiries.filter(
      (inquiry) =>
        inquiry.propertyId.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
    });

    setFilteredInquiries(sorted);
  }, [inquiries, searchTerm, sortBy]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl font-bold'>Your Inquiries</CardTitle>
          <CardDescription>
            View and manage your property inquiries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
            <div className='relative w-full md:w-64'>
              <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <Input
                type='text'
                placeholder='Search inquiries...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-full md:w-40'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Newest First</SelectItem>
                <SelectItem value='oldest'>Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : filteredInquiries.length > 0 ? (
            <div className='space-y-6'>
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry._id} className='overflow-hidden'>
                  <CardHeader className='bg-secondary'>
                    <div className='flex justify-between items-center'>
                      <CardTitle className='text-lg font-semibold'>
                        {inquiry.propertyId.title}
                      </CardTitle>
                      <Badge
                        variant={inquiry.isResponded ? 'default' : 'secondary'}
                      >
                        {inquiry.isResponded ? 'Responded' : 'Pending'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Submitted{' '}
                      {formatRelativeTime(inquiry.createdAt.toString())}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-4'>
                    <p className='text-sm mb-2'>
                      <strong>Your Message:</strong> {inquiry.message}
                    </p>
                    <p className='text-xs text-gray-500 mb-4'>
                      Submitted on: {formatDate(inquiry.createdAt.toString())}
                    </p>
                    {inquiry.isResponded && (
                      <div className='bg-secondary p-3 rounded-md mt-2'>
                        <p className='text-sm'>
                          <strong>Response:</strong> {inquiry.response}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500 py-8'>
              No inquiries found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInquiries;
