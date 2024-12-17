'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  fetchPropertyById,
  deleteProperty,
  Property,
} from '@/services/property/propertyApiHandler';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PropertyDetail } from '@/components/pages/Properties/PropertyDetails';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetchPropertyById(params.id as string);
        if (response.status === 'success' && response.data) {
          setProperty(response.data);
        } else {
          setError('Failed to load property details');
        }
      } catch (err) {
        setError('An error occurred while fetching property details');
      }
    };

    loadProperty();
  }, [params.id]);

  const handleDelete = async () => {
    if (!property) return;

    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await deleteProperty(property._id as string);
        if (response.status === 'success') {
          router.push('/dashboard/properties');
        } else {
          setError('Failed to delete property');
        }
      } catch (err) {
        setError('An error occurred while deleting the property');
      }
    }
  };

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!property) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <PropertyDetail property={property} onDelete={handleDelete} />
    </div>
  );
}
