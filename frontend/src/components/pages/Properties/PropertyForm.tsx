
'use client';

import { useState, useEffect } from 'react';
import {
  fetchCompanies,
  CompanyData,
} from '@/services/company/companyApiHandler';
import {
  createProperty,
  updateProperty,
  Property,
  uploadMultipleImages,
} from '@/services/property/propertyApiHandler';

interface PropertyFormProps {
  initialData?: {
    _id?: string;
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    propertyType?: string;
    rooms?: number;
    company?: string;
    status?: string;
    amenities?: string[];
    coordinates: {
      lat: number;
      lng: number;
    };
    isPublished?: boolean;
    agent?: {
      name?: string;
      contact?: string;
    };
    sold?: boolean;
  };
  onSuccess: () => void;
}

const PropertyForm = ({ initialData, onSuccess }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    location: initialData?.location || '',
    propertyType: initialData?.propertyType || '',
    rooms: initialData?.rooms || '',
    companyId: initialData?.company || '',
    status: initialData?.status || 'listed',
    amenities: initialData?.amenities?.join(', ') || '',
    coordinates: {
      lat: initialData?.coordinates.lat.toString() || '',
      lng: initialData?.coordinates.lng.toString() || '',
    },
    isPublished: initialData?.isPublished || false,
    agentName: initialData?.agent?.name || '',
    agentContact: initialData?.agent?.contact || '',
    sold: initialData?.sold || false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      const response = await fetchCompanies();
      if (response.status === 'success') {
        setCompanies(response.data.companies);
      } else {
        setAlertState({ type: 'error', message: response.message });
      }
    };
    loadCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   setAlertState({ type: null, message: '' });

   try {
     // Create or Update Property
     const propertyData: Property = {
       ...formData,
       price: parseFloat(formData.price.toString()),
       rooms: parseInt(formData.rooms.toString(), 10),
       company: formData.companyId,
       amenities: formData.amenities.split(',').map((a: string) => a.trim()),
       coordinates: {
         lat: parseFloat(formData.coordinates.lat) || 0,
         lng: parseFloat(formData.coordinates.lng) || 0,
       },
       agent: {
         name: formData.agentName,
         contact: formData.agentContact,
       },
       images: [], // Initialize with empty array
       sold: formData.sold,
       _id: initialData?._id || '',
     };

     const response = initialData
       ? await updateProperty(initialData._id!, propertyData)
       : await createProperty(propertyData);

     if (response.status !== 'success') {
       throw new Error(response.message);
     }

     const propertyId = response.data._id;

     // Handle Image Upload
  if (images.length > 0) {
  const formData = new FormData();
  images.forEach((img) => formData.append('images', img));
  formData.append('propertyId', propertyId); // Ensure this is correct

  // Debugging
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  const uploadResponse = await uploadMultipleImages(formData);
       if (uploadResponse.status !== 'success') {
         throw new Error(uploadResponse.message);
       }
     }

     setAlertState({
       type: 'success',
       message: 'Property saved and images uploaded successfully.',
     });
     onSuccess();
   } catch (error: any) {
     setAlertState({ type: 'error', message: error.message });
   } finally {
     setLoading(false);
   }
 };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <input
        type='text'
        name='title'
        value={formData.title}
        onChange={handleInputChange}
        placeholder='Property Title'
        className='w-full border p-2 rounded'
      />
      <textarea
        name='description'
        value={formData.description}
        onChange={handleInputChange}
        placeholder='Property Description'
        className='w-full border p-2 rounded'
      />
      <input
        type='number'
        name='price'
        value={formData.price}
        onChange={handleInputChange}
        placeholder='Price'
        className='w-full border p-2 rounded'
      />
      <input
        type='text'
        name='location'
        value={formData.location}
        onChange={handleInputChange}
        placeholder='Location'
        className='w-full border p-2 rounded'
      />
      <select
        name='propertyType'
        value={formData.propertyType}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
        required
      >
        <option value=''>Select Property Type</option>
        <option value='Villa'>Villa</option>
        <option value='Apartment'>Apartment</option>
        <option value='House'>House</option>
      </select>
      <input
        type='number'
        name='rooms'
        value={formData.rooms}
        onChange={handleInputChange}
        placeholder='Number of Rooms'
        className='w-full border p-2 rounded'
      />
      <select
        name='status'
        value={formData.status}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
      >
        <option value='listed'>Listed</option>
        <option value='sold'>Sold</option>
        <option value='under contract'>Under Contract</option>
      </select>
      <textarea
        name='amenities'
        value={formData.amenities}
        onChange={handleInputChange}
        placeholder='Amenities (comma separated)'
        className='w-full border p-2 rounded'
      />
      <div className='flex space-x-2'>
        <input
          type='number'
          name='lat'
          value={formData.coordinates.lat}
          onChange={(e) =>
            setFormData({
              ...formData,
              coordinates: {
                ...formData.coordinates,
                lat: e.target.value,
              },
            })
          }
          placeholder='Latitude'
          className='w-full border p-2 rounded'
        />
        <input
          type='number'
          name='lng'
          value={formData.coordinates.lng}
          onChange={(e) =>
            setFormData({
              ...formData,
              coordinates: {
                ...formData.coordinates,
                lng: e.target.value,
              },
            })
          }
          placeholder='Longitude'
          className='w-full border p-2 rounded'
        />
      </div>
      <select
        name='companyId'
        value={formData.companyId}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
      >
        <option value=''>Select Company</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>{' '}
      <div>
        <label>Upload Images</label>
        <input
          type='file'
          multiple
          accept='image/*'
          onChange={handleImageChange}
          className='w-full p-2 border rounded'
        />
      </div>
      <button
        type='submit'
        disabled={loading}
        className={`w-full p-2 ${
          loading ? 'bg-gray-400' : 'bg-primary_main text-white'
        } rounded`}
      >
        {loading ? 'Saving...' : 'Save Property'}
      </button>
      {alertState.type && (
        <div
          className={`p-4 mt-4 ${
            alertState.type === 'success'
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          } rounded`}
        >
          {alertState.message}
        </div>
      )}
    </form>
  );
};

export default PropertyForm;
