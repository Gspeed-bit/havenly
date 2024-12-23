'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchPropertiesForUser,
  Property,
} from '@/services/property/propertyApiHandler';

interface PropertyListForUserProps {
  filters: {
    city: string;
    propertyType: string;
    priceRange: string;
    rooms: string;
  };
}

export function PropertyListForUser({ filters }: PropertyListForUserProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPropertiesForUser(filters);

        if (response.status === 'success') {
          setProperties(response.data.data);
        } else {
          setError('Failed to load properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('An error occurred while fetching properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [filters]);
console.log(properties);
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Property Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading properties...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {properties.map((property) => (
              <Card
                key={property._id}
                className='cursor-pointer hover:shadow-lg transition-shadow'
              >
                <CardContent
                  className='p-4'
                  onClick={() =>
                    router.push(`/property/${property._id}`)
                  }
                >
                  {property.images && property.images.length > 0 && (
                    <picture>
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className='w-full rounded-lg h-[7rem] object-cover mb-4'
                      />
                    </picture>
                  )}

                  <h3 className='text-lg font-semibold mb-2'>
                    {property.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    {property.location}
                  </p>
                  <p className='text-sm font-medium mb-2'>
                    ${property.price.toLocaleString()}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {property.rooms} rooms • {property.propertyType}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
