'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchPropertiesForUser,
  type Property,
} from '@/services/property/propertyApiHandler';
import { useAuthStore } from '@/store/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Bath, Bed } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState('all');

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

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

  const handlePropertyClick = (propertyId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/property/${propertyId}`);
    } else {
      router.push(`/property/${propertyId}`);
    }
  };

  // Instead of using non-existent properties, we'll determine the badge based on price
  const getStatusBadge = (property: Property) => {
    // If price is above average, show as "Popular"
    if (property.price > 500000) {
      return (
        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-red-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5'>
          <Home className='w-4 h-4' />
          Popular
        </div>
      );
    }
    // If price is below average, show as "New Listing"
    if (property.price < 200000) {
      return (
        <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5'>
          <Home className='w-4 h-4' />
          New Listing
        </div>
      );
    }
    // For other properties, show "Discounted Price"
    return (
      <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5'>
        <span className='text-lg'>$</span>
        Discounted Price
      </div>
    );
  };

  return (
    <div className='w-full border-gray-200 mt-2'>
      <div className=''>
        <h3 className=' font-medium mb-2'>CHECKOUT OUR NEW</h3>
        <h2 className='text-4xl font-bold mb-4'>Latest Listed Properties</h2>
        <p className=' mb-[10px]'>
          Donec porttitor euismod dignissim. Nullam a lacinia ipsum, nec
          dignissim purus.
        </p>
      </div>

      <div className='flex gap-2 mb-8'>
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'all'
              ? ' bg-primary_main  text-white'
              : 'border border-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('sell')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'sell'
              ? ' bg-primary_main  text-white'
              : 'border border-gray-200'
          }`}
        >
          Sell
        </button>
        <button
          onClick={() => setActiveFilter('rent')}
          className={`px-6 py-2 rounded-full ${
            activeFilter === 'rent'
              ? ' bg-primary_main  text-white'
              : 'border border-gray-200'
          }`}
        >
          Rent
        </button>
      </div>

      {loading ? (
        <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[...Array(4)].map((_, index) => (
            <Card key={index} className='w-full'>
              <CardContent className='p-0'>
                <Skeleton className='h-[200px] w-full rounded-t-lg' />
                <div className='p-4'>
                  <Skeleton className='h-6 w-24 mb-2' />
                  <Skeleton className='h-4 w-full mb-2' />
                  <Skeleton className='h-4 w-2/3' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
          {properties.map((property) => (
            <Card
              key={property._id}
              className='cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group'
              onClick={() => property._id && handlePropertyClick(property._id)}
            >
              <CardContent className='p-0'>
                <div className='relative'>
                  {getStatusBadge(property)}
                  <picture>
                    <img
                      src={
                        property.images?.[0]?.url ||
                        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q3cNAxVfWJIDifSOQ3YNYU7IZtYTTe.png'
                      }
                      alt={property.title}
                      className='w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </picture>
                </div>
                <div className='p-4'>
                  <div className='text-2xl font-bold mb-2'>
                    $ {property.price.toLocaleString()}
                  </div>
                  <h3 className='text-lg font-semibold mb-2 line-clamp-1'>
                    {property.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-4 line-clamp-1'>
                    {property.location}
                  </p>
                  <div className='flex items-center gap-4 text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <Bed className='w-4 h-4' />
                      <span className='text-sm'>{property.rooms} Beds</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Bath className='w-4 h-4' />
                      <span className='text-sm'>{property.rooms} Bath</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
