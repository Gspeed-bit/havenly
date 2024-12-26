'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import {
  getPropertyByIdForUser,
  Property,
} from '@/services/property/propertyApiHandler';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { useUserStore } from '@/store/users';
import { ChatWithAdmin } from '@/components/ChatWithAdmin';

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
}

interface PropertyDetailsProps {
  propertyId: string;
}

export function UserPropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<AlertState>({
    type: null,
    message: '',
  });

  const user = useUserStore();
  const userId = user.user?._id;

  useEffect(() => {
    if (!propertyId) {
      setError('Property ID is missing');
      setIsLoading(false);
      return;
    }

    const loadProperty = async () => {
      setIsLoading(true);
      try {
        const response = await getPropertyByIdForUser(propertyId);
        if (response.status === 'success') {
          if (response.data) {
            setProperty(response.data);
            console.log(response.data);
          } else {
            setAlertState({
              type: 'error',
              message: 'Failed to load property details',
            });
          }
        } else {
          setAlertState({
            type: 'error',
            message: 'Failed to load property details',
          });
        }
      } catch {
        setError('An error occurred while fetching property details');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [propertyId, userId]);

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div className='container mx-auto px-4 py-8'>
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>{property.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='font-semibold'>Price:</p>
              <p>{property.price ? property.price.toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <p className='font-semibold'>Location:</p>
              <p>{property.location}</p>
            </div>
            <div>
              <p className='font-semibold'>Property Type:</p>
              <p>{property.propertyType}</p>
            </div>
            <div>
              <p className='font-semibold'>Rooms:</p>
              <p>{property.rooms}</p>
            </div>
            <div>
              <p className='font-semibold'>Status:</p>
              <p>{property.status}</p>
            </div>
            <div>
              <p className='font-semibold'>Published:</p>
              <p>{property.isPublished ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className='mb-4'>
            <p className='font-semibold'>Description:</p>
            <p>{property.description}</p>
          </div>
          <div className='mb-4'>
            <p className='font-semibold text-primary_main'>Amenities:</p>
            {property.amenities && property.amenities.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant='outline' className='text-primary'>
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-sm'>No amenities available</p>
            )}
          </div>
          {property.agent && (
            <div className='mb-4'>
              <p className='font-semibold'>Agent:</p>
              <p>
                {property.agent.name} - {property.agent.contact}
              </p>
            </div>
          )}
          {property.images && (
            <div className='mb-4'>
              <p className='font-semibold'>Images:</p>
              <div className='grid grid-cols-3 gap-4'>
                {property.images.map((image, index) => (
                  <picture key={index}>
                    <img
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </picture>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        {alertState.type && (
          <Alert
            variant={alertState.type === 'error' ? 'destructive' : 'default'}
          >
            {alertState.type === 'error' ? (
              <AlertCircle className='h-4 w-4' />
            ) : (
              <CheckCircle2 className='h-4 w-4' />
            )}
            <AlertTitle>
              {alertState.type === 'error' ? 'Error' : 'Success'}
            </AlertTitle>
            <AlertDescription>{alertState.message}</AlertDescription>
          </Alert>
        )}
      </Card>
      {userId && <ChatWithAdmin propertyId={propertyId} userId={userId} />}
    </div>
  );
}
