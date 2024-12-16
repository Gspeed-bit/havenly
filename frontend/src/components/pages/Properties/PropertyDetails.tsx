'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchPropertyById,
  deleteProperty,
  Property,
} from '@/services/property/propertyApiHandler';

const PropertyPage = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams(); // Assume the property ID is passed via the URL

  useEffect(() => {
    const fetchSingleProperty = async () => {
      if (!id) return; // Ensure ID is present
      try {
        const response = await fetchPropertyById(id as string); // Fetch property by ID

        if (response.status === 'success' && response.data) {
          setProperty(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.log(err)
        setError('Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchSingleProperty();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this property?')) {
      const deleteResponse = await deleteProperty(id as string);
      if (deleteResponse.status === 'success') {
        router.push('/properties'); // Redirect back to properties list
      } else {
        setError(deleteResponse.message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!property) {
    return <p>Property not found</p>;
  }

  return (
    <div className='property-detail'>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Price: ${property.price}</p>
      <p>Location: {property.location}</p>
      <p>Type: {property.propertyType}</p>
      <p>Rooms: {property.rooms}</p>
      <p>Amenities: {property.amenities.join(', ')}</p>
      <p>Status: {property.status}</p>
      <p>
        Agent: {property.agent.name} ({property.agent.contact})
      </p>
      <p>Sold: {property.sold ? 'Yes' : 'No'}</p>
      <p>Published: {property.isPublished ? 'Yes' : 'No'}</p>

      {/* <div className='image-gallery'>
        {property.images?.map((image) => (
          <img key={image.public_id} src={image.url} alt={property.title} />
        ))}
      </div> */}

      <button
        onClick={() => router.push(`/dashboard/property/${property._id}`)}
        className='bg-primary_main text-white py-1 px-2 rounded'
      >
        Edit Property
      </button>

      <button
        onClick={handleDelete}
        className='bg-red-500 text-white py-1 px-2 rounded ml-2'
      >
        Delete Property
      </button>
    </div>
  );
};

export default PropertyPage;
