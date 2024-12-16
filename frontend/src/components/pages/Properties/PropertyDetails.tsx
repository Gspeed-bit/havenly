'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  fetchPropertyById,
  Property,
} from '@/services/property/propertyApiHandler';
import { PropertyMap } from '../property-map';
import { ImageCarousel } from '../image-carousel';

export function PropertyDetail() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const propertyId = params.id as string;

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetchPropertyById(propertyId);
        if (response.status === 'success') {
          setProperty(response.data);
        } else {
          setError('Failed to load property details');
        }
      } catch (err) {
        setError('An error occurred while fetching property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <Skeleton className='h-8 w-3/4' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-full' />
        </CardContent>
      </Card>
    );
  }

  if (error) return <div className='text-red-500 text-center'>{error}</div>;
  if (!property) return <div className='text-center'>Property not found</div>;

  return (
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>{property.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {property.images && property.images.length > 0 ? (
          <ImageCarousel images={property.images.map(image => image.url)} alt={property.title} />
        ) : (
          <div className='relative h-96 w-full bg-gray-200 flex items-center justify-center rounded-lg'>
            <p className='text-gray-500'>No images available</p>
          </div>
        )}
        <div className='flex justify-between items-center'>
          <p className='text-3xl font-bold text-primary'>
            ${property.price.toLocaleString()}
          </p>
          <Badge
            variant={property.status === 'sold' ? 'destructive' : 'default'}
          >
            {property.status}
          </Badge>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='font-semibold'>Location</p>
            <p>{property.location}</p>
          </div>
          <div>
            <p className='font-semibold'>Property Type</p>
            <p>{property.propertyType}</p>
          </div>
          <div>
            <p className='font-semibold'>Rooms</p>
            <p>{property.rooms}</p>
          </div>
          <div>
            <p className='font-semibold'>Amenities</p>
            <p>{property.amenities?.join(', ') || 'None listed'}</p>
          </div>
        </div>
        <div>
          <p className='font-semibold'>Description</p>
          <p className='mt-2'>{property.description}</p>
        </div>
        <div>
          <p className='font-semibold'>Agent</p>
          <p>
            {property.agent?.name} ({property.agent?.contact})
          </p>
        </div>
        {property.coordinates && (
          <div>
            <p className='font-semibold mb-2'>Location</p>
            <PropertyMap
              lat={property.coordinates.lat}
              lng={property.coordinates.lng}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
