'use client';

import { useEffect, useState } from 'react';
import {
  fetchProperties,
  deleteProperty,
  Property,
} from '@/services/property/propertyApiHandler';
import { useRouter } from 'next/navigation';

// Define a type for the pagination data
interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const router = useRouter();

  const loadProperties = async (page: number) => {
    try {
      setLoading(true); // Show loading when fetching data
      const response = await fetchProperties({ page });

      if (response.status === 'error') {
        setError(response.message);
      } else if ('data' in response) {
        setProperties(response.data.data); // Set properties
        setPagination(response.data.pagination); // Set pagination data
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('Failed to fetch properties. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false once fetching is done
    }
  };

  // Fetch properties when the component mounts or page changes
  useEffect(() => {
    loadProperties(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = confirm(
      'Are you sure you want to delete this property?'
    );
    if (isConfirmed) {
      try {
        const deleteResponse = await deleteProperty(id);
        if (deleteResponse.status === 'success') {
          setProperties((prevProperties) =>
            prevProperties.filter((property) => property._id !== id)
          );
          router.refresh(); // Reload the list
        } else {
          alert(deleteResponse.message);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert(
          'An error occurred while deleting the property. Please try again.'
        );
      }
    }
  };

  if (loading) {
    return <p>Loading properties...</p>; // Show a loading message while data is being fetched
  }

  if (error) {
    return <p>Error: {error}</p>; // Show an error message if fetching failed
  }

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => (
          <li key={property._id} className='border p-4 rounded mb-4'>
            <a href={`/dashboard/property/${property._id}`}>
              <h2>{property.title}</h2>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
              <p>Status: {property.status}</p>
              <p>Location: {property.location}</p>
              <p>Amenities: {property.amenities.join(', ')}</p>
              <p>Sold: {property.sold ? 'Yes' : 'No'}</p>
              <p>Published: {property.isPublished ? 'Yes' : 'No'}</p>
            </a>
            <button
              onClick={() =>
                router.push(`/dashboard/property/edit/${property._id}`)
              }
              className='bg-primary_main text-white py-1 px-2 rounded'
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(property._id)}
              className='bg-red-500 text-white py-1 px-2 rounded ml-2'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className='flex justify-between mt-4'>
        <button
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className='bg-primary_main text-white py-1 px-2 rounded disabled:opacity-50'
        >
          Previous
        </button>
        <p>
          Page {pagination.currentPage} of {pagination.totalPages}
        </p>
        <button
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className='bg-primary_main text-white py-1 px-2 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertiesPage;
