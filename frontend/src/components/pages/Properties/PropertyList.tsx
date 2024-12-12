'use client';

import {
  fetchProperties,
  deleteProperty,
} from '@/services/property/properties';
import { useRouter } from 'next/navigation';

const PropertiesPage = async () => {
  const response = await fetchProperties();

  if (response.status === 'error') {
    return <p>Error: {response.message}</p>;
  }

  const properties = response.data;
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      const deleteResponse = await deleteProperty(id);
      if (deleteResponse.status === 'success') {
        router.refresh(); // Reload the list
      } else {
        alert(deleteResponse.message);
      }
    }
  };

  return (
    <div>
      <h1>Properties</h1>
      <ul>
        {properties.map((property) => (
          <li key={property._id} className='border p-4 rounded mb-4'>
            <a href={`/property/${property._id}`}>
              <h2>{property.title}</h2>
              <p>{property.description}</p>
              <p>Price: ${property.price}</p>
            </a>
            <button
              onClick={() => router.push(`/property/edit/${property._id}`)}
              className='bg-blue-500 text-white py-1 px-2 rounded'
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
    </div>
  );
};

export default PropertiesPage;
