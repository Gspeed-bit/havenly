'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchPropertyById,
  Property,
} from '@/services/property/propertyApiHandler';

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
  console.log(property);

  if (loading) return <div>Loading property details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>{property.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-bold mb-4'>Price: ${property.price}</p>
        <p>
          <strong>Location:</strong> {property.location}
        </p>
        <p>
          <strong>Type:</strong> {property.propertyType}
        </p>
        <p>
          <strong>Rooms:</strong> {property.rooms}
        </p>
        <p>
          <strong>Description:</strong> {property.description}
        </p>
        <p>
          <strong>Status:</strong> {property.status}
        </p>
        <p>
          <strong>Amenities:</strong> {property.amenities?.join(', ')}
        </p>
        <p>
          <strong>Agent:</strong> {property.agent?.name} (
          {property.agent?.contact})
        </p>
      </CardContent>
    </Card>
  );
}
