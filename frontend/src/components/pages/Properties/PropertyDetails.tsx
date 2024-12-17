'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { Property } from '@/services/property/propertyApiHandler';
import { Pencil, Trash2 } from 'lucide-react';
import { PropertyMap } from '../property-map';
import { ImageCarousel } from '../image-carousel';

interface PropertyDetailProps {
  property: Property;
  onDelete: () => void;
}

export function PropertyDetail({ property, onDelete }: PropertyDetailProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/property/${property._id}/edit`);
  };

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>{property.title}</CardTitle>
        <div className='flex justify-between items-center mt-2'>
          <Badge
            variant={property.status === 'listed' ? 'default' : 'secondary'}
          >
            {property.status}
          </Badge>
          <div className='space-x-2'>
            <Button onClick={handleEdit} variant='outline' size='sm'>
              <Pencil className='mr-2 h-4 w-4' /> Edit
            </Button>
            <Button onClick={onDelete} variant='destructive' size='sm'>
              <Trash2 className='mr-2 h-4 w-4' /> Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {property.images && property.images.length > 0 ? (
          <ImageCarousel images={property.images} alt={''} />
        ) : (
          <div className='bg-gray-200 h-64 flex items-center justify-center'>
            <p>No images available</p>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h3 className='font-semibold'>Price</h3>
            <p>${property.price.toLocaleString()}</p>
          </div>
          <div>
            <h3 className='font-semibold'>Location</h3>
            <p>{property.location}</p>
          </div>
          <div>
            <h3 className='font-semibold'>Property Type</h3>
            <p>{property.propertyType}</p>
          </div>
          <div>
            <h3 className='font-semibold'>Number of Rooms</h3>
            <p>{property.rooms}</p>
          </div>
        </div>

        <div>
          <h3 className='font-semibold'>Description</h3>
          <p>{property.description}</p>
        </div>

        <div>
          <h3 className='font-semibold'>Amenities</h3>
          <ul className='list-disc list-inside'>
            {property.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className='font-semibold'>Agent Information</h3>
          <p>Name: {property.agent?.name}</p>
          <p>Contact: {property.agent?.contact}</p>
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
