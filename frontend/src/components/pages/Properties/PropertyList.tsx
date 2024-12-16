'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchProperties,
  Property,
} from '@/services/property/propertyApiHandler';

interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
}

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const response = await fetchProperties(
          {},
          pagination.currentPage,
          itemsPerPage
        );
        if (response.status === 'success') {
          setProperties(response.data.data);
          setPagination({
            total: response.data.pagination.total,
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
          });
        } else {
          setError('Failed to load properties');
        }
      } catch (err) {
        setError('An error occurred while fetching properties');
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, [pagination.currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(itemsPerPage)].map((_, index) => (
          <Card key={index} className='w-full'>
            <Skeleton className='h-48 w-full rounded-t-lg' />
            <CardContent className='mt-4'>
              <Skeleton className='h-4 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <div className='text-red-500 text-center'>{error}</div>;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {properties.map((property) => (
          <Link href={`/dashboard/property/${property._id}`} key={property._id}>
            <Card className='w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
              <div className='relative h-48'>
                <Image
                  src={property.images?.[0]?.url || '/placeholder-property.jpg'}
                  alt={property.title}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-t-lg'
                />
              </div>
              <CardHeader>
                <CardTitle className='line-clamp-1'>{property.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-2xl font-bold text-primary'>
                  ${property.price.toLocaleString()}
                </p>
                <p className='text-muted-foreground'>{property.location}</p>
                <p className='text-sm text-muted-foreground'>
                  {property.propertyType}
                </p>
              </CardContent>
              <CardFooter>
                <p className='text-sm text-muted-foreground'>
                  {property.rooms} {property.rooms === 1 ? 'room' : 'rooms'} •{' '}
                  {property.status}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      <div className='flex justify-center items-center space-x-2 mt-8'>
        <Button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          variant='outline'
        >
          Previous
        </Button>
        <span className='text-muted-foreground'>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          variant='outline'
        >
          Next
        </Button>
      </div>
    </div>
  );
}
