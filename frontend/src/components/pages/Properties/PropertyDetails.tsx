'use client';

import {
  fetchPropertyById,
  deleteProperty,
  Property,
} from '@/services/property/propertyApiHandler';
import { useRouter } from 'next/navigation';

interface PropertyDetailsProps {
  params: { id: string };
}

const PropertyDetails = async ({ params }: PropertyDetailsProps) => {
  const { id } = params;
  const response = await fetchPropertyById(id);

  if (response.status === 'error') {
    return <p>Error: {response.message}</p>;
  }

  const property = response.data;

  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this property?')) {
      const deleteResponse = await deleteProperty(property._id);
      if (deleteResponse.status === 'success') {
        router.push('/properties');
      } else {
        alert(deleteResponse.message);
      }
    }
  };

  return (
    <div>
      <h1>{property.title}</h1>
      <p>{property.description}</p>
      <p>Price: ${property.price}</p>
      <p>Location: {property.location}</p>
      <p>Type: {property.propertyType}</p>
      <p>Rooms: {property.rooms}</p>
      <p>Company ID: {property.company}</p>
      <h3>Images:</h3>
      <ul>
        {property.images.map((image) => (
          <li key={image.public_id}>
            <img
              src={image.url}
              alt={property.title}
              className='w-full h-auto'
            />
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push(`/property/edit/${property._id}`)}
        className='bg-blue-500 text-white py-2 px-4 rounded'
      >
        Edit Property
      </button>
      <button
        onClick={handleDelete}
        className='bg-red-500 text-white py-2 px-4 rounded ml-2'
      >
        Delete Property
      </button>
    </div>
  );
};

export default PropertyDetails;
