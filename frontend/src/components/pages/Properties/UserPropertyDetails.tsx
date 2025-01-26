'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getPropertyByIdForUser,
  Property,
} from '@/services/property/propertyApiHandler';
import { startChat } from '@/services/chat/chatServices';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PropertyMap } from '../property-map';

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
  const [alertState, setAlertState] = useState<AlertState>({
    type: null,
    message: '',
  });
  const [chatId, setChatId] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const response = await getPropertyByIdForUser(propertyId);
        if (response.status === 'success') {
          setProperty(response.data);
        } else {
          setAlertState({ type: 'error', message: response.message });
        }
      } catch {
        setAlertState({
          type: 'error',
          message: 'Failed to fetch property details.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

const handleStartChat = async () => {
  if (isChatLoading) return;
  setIsChatLoading(true);
  try {
    const response = await startChat({ propertyId });
    console.log('Start Chat Response:', response); // Log the full response

    if (response.status === 'success') {
      // Access the chatId from the correct nested structure
      const chatId = response.data._id || response.data.data?._id; // Handle both cases
      if (chatId) {
        setChatId(chatId);
        // Redirect to the user dashboard with the chatId in the URL
        router.push(`/user-dashboard?chatId=${chatId}`);
        setAlertState({
          type: 'success',
          message: 'Chat started successfully.',
        });
      } else {
        console.error('Chat ID is missing in the response:', response);
        setAlertState({
          type: 'error',
          message: 'Failed to retrieve chat ID.',
        });
      }
    } else {
      console.error('Failed to start chat:', response.message);
      setAlertState({ type: 'error', message: response.message });
    }
  } catch (error) {
    console.error('Error starting chat:', error);
    setAlertState({ type: 'error', message: 'Failed to start chat.' });
  } finally {
    setIsChatLoading(false);
  }
};

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='container mx-auto px-4 py-8'>
          <Card className='w-full max-w-3xl mx-auto'>
            <CardHeader>
              <Skeleton className='h-8 w-3/4' />
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                {[...Array(6)].map((_, index) => (
                  <div key={index}>
                    <Skeleton className='h-4 w-1/2 mb-2' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                ))}
              </div>
              <div className='mb-4'>
                <Skeleton className='h-4 w-1/4 mb-2' />
                <Skeleton className='h-16 w-full' />
              </div>
              <div className='mb-4'>
                <Skeleton className='h-4 w-1/4 mb-2' />
                <div className='flex flex-wrap gap-2'>
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className='h-6 w-20' />
                  ))}
                </div>
              </div>
              <div className='mb-4'>
                <Skeleton className='h-4 w-1/4 mb-2' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <div className='mb-4'>
                <Skeleton className='h-4 w-1/4 mb-2' />
                <div className='grid grid-cols-3 gap-4'>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className='h-48 w-full' />
                  ))}
                </div>
              </div>
              <div className='mt-4'>
                <Skeleton className='h-10 w-40' />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

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
                <p>
                  {property.price ? property.price.toLocaleString() : 'N/A'}
                </p>
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
                    <Badge
                      key={index}
                      variant='outline'
                      className='text-primary'
                    >
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
            {property.coordinates.lat && property.coordinates.lng && (
              <div className='mb-4'>
                <p className='font-semibold mb-2'>Location:</p>
                <PropertyMap
                  lat={property.coordinates.lat}
                  lng={property.coordinates.lng}
                />
              </div>
            )}
            {alertState.type && (
              <Alert
                variant={
                  alertState.type === 'error' ? 'destructive' : 'default'
                }
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
            <div className='mt-4'>
              {!chatId && (
                <Button
                  className='btn btn-primary_main'
                  onClick={handleStartChat}
                  disabled={isChatLoading}
                >
                  {isChatLoading
                    ? `Starting chat...... ${property.agent.name}`
                    : `Chat with ${property.agent.name} `}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return renderContent();
}
