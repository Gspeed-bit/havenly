'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  fetchProperties,
  Property,
} from '@/services/property/propertyApiHandler';

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    priceRange: '',
    rooms: '',
  });

  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages from the API

  const router = useRouter();

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProperties({
          ...filters,
          page: currentPage.toString(),
        });
        console.log('API Response:', response); // Add this line to debug

        if (response.status === 'success') {
          setProperties(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
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

    // Load properties when filters or current page changes
    loadProperties();
  }, [filters, currentPage]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Property Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Section */}
        <div className='flex space-x-4 mb-4'>
          <Input
            placeholder='City'
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          />
          <Select
            value={filters.propertyType}
            onValueChange={(value) => handleFilterChange('propertyType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Property Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Apartment'>Apartment</SelectItem>
              <SelectItem value='House'>House</SelectItem>
              <SelectItem value='Condo'>Condo</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder='Price Range (e.g., 100000-200000)'
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          />
          <Input
            placeholder='Rooms'
            type='number'
            value={filters.rooms}
            onChange={(e) => handleFilterChange('rooms', e.target.value)}
          />
        </div>

        {/* Property Listings */}
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
                    router.push(`/dashboard/property/${property._id}`)
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

        {/* Pagination Controls */}
        <div className='flex justify-center gap-5 items-center mt-6'>
          <Button
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            variant='outline'
          >
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            variant='outline'
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
