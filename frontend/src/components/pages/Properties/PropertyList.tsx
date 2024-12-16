'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [itemsPerPage] = useState(10);

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

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        {properties.map((property) => (
          <Link href={`/dashboard/property/${property._id}`} key={property._id}>
            <Card className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{property.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Price: ${property.price}</p>
                <p>Location: {property.location}</p>
                <p>Type: {property.propertyType}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className='flex justify-center items-center space-x-2 mt-4'>
        <Button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
