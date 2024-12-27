'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  getPropertyByIdForUser,
  Property,
} from '@/services/property/propertyApiHandler';
import { startChat, getChat } from '@/services/chat/chatServices';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '@/store/users';
import { useRouter } from 'next/navigation';
import ImprovedChatBox from '@/app/(root)/chats/[chatsId]/page';


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
  const [isChatLoading, setIsChatLoading] = useState(false); // Track chat loading state

  const user = useUserStore();
  const userId = user.user?._id;
  const router = useRouter();

  // Fetch property details on component mount
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

  // Fetch chat details if chat exists
  useEffect(() => {
    const fetchChat = async () => {
      if (!userId || !propertyId) return;
      setIsChatLoading(true); // Start loading chat
      try {
        const response = await getChat(propertyId);
        if (response.status === 'success') {
          setChatId(response.data.data._id);
        }
      } catch {
        console.error('No existing chat found.');
      } finally {
        setIsChatLoading(false); // Stop loading chat
      }
    };

    fetchChat();
  }, [userId, propertyId]);

  // Start a new chat
  const handleStartChat = async () => {
    if (isChatLoading) return; // Prevent multiple requests while loading
    setIsChatLoading(true);
    try {
      const response = await startChat({ propertyId });
      console.log('Start Chat Response:', response); // Log the full response

      if (response.status === 'success') {
        const chatId = response.data.data._id; // Ensure this is not undefined
        console.log(chatId); // Log the chat ID
        if (chatId) {
          setChatId(chatId); // Update state with the chat ID
          router.push(`/chats/${chatId}`); // Navigate to the chat page
          setAlertState({
            type: 'success',
            message: 'Chat started successfully.',
          });
        } else {
          setAlertState({
            type: 'error',
            message: 'Failed to retrieve chat ID.',
          });
        }
      } else {
        setAlertState({ type: 'error', message: response.message });
      }
    } catch (error) {
      setAlertState({ type: 'error', message: 'Failed to start chat.' });
      console.error('Error starting chat:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (isLoading) return <p>Loading property details...</p>;
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
          <div className='mt-4'>
            {chatId ? (
              <ImprovedChatBox />
            ) : (
              <button
                className='btn btn-primary'
                onClick={handleStartChat}
                disabled={isChatLoading} // Disable button while loading
              >
                {isChatLoading ? 'Starting chat...' : 'Start a Chat'}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
