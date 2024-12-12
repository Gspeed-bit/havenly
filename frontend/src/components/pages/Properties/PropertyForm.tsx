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
  uploadImage,
  deleteImage,
} from '@/services/property/propertyApiHandler';

interface PropertyFormProps {
  initialData?: Property; // Pass for update
  onSuccess: () => void;
}

const PropertyForm = ({ initialData }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    location: initialData?.location || '',
    propertyType: initialData?.propertyType || '',
    rooms: initialData?.rooms || '',
    companyId: initialData?.company|| '', // Update for company reference
    status: initialData?.status || 'listed', // Default to 'listed'
    amenities: initialData?.amenities.join(', ') || '', // Join array as string for easy input
    coordinates: initialData?.coordinates || { lat: 0, lng: 0 },
    isPublished: initialData?.isPublished || false,
    agentName: initialData?.agent?.name || '',
    agentContact: initialData?.agent?.contact || '',
    sold: initialData?.sold || false,
  });

  const [images, setImages] = useState(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      const response = await fetchCompanies();
      if (response.status === 'success') {
        setCompanies(response.data.companies);
      } else {
        setError(response.message);
      }
    };
    loadCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (files: File[]) => {
    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadImage(formData);
      if (response.status === 'success') {
        uploadedImages.push(response.data);
      } else {
        setError(`Failed to upload image: ${response.message}`);
        return; // Exit early if an upload fails
      }
    }
    setImages([...images, ...uploadedImages]);
  };

  const handleImageDelete = async (publicId: string) => {
    const response = await deleteImage(initialData?._id || '', publicId);
    if (response.status === 'success') {
      setImages(images.filter((image) => image.public_id !== publicId));
    } else {
      setError(`Failed to delete image: ${response.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Upload new images
    const uploadedImages = [];
    if (newImages.length > 0) {
      for (const file of newImages) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await uploadImage(formData);
        if (response.status === 'success') {
          uploadedImages.push(response.data);
        } else {
          setError(`Image upload failed: ${response.message}`);
          setLoading(false);
          return;
        }
      }
    }

    const propertyData: Property = {
      ...formData,
      price: parseFloat(formData.price.toString()),
      rooms: parseInt(formData.rooms.toString(), 10),
      images: [...images, ...uploadedImages],
      _id: '',
      company: formData.companyId,
      status: formData.status,
      amenities: formData.amenities.split(',').map((amenity) => amenity.trim()), // Parse amenities back to array
      coordinates: formData.coordinates,
      agent: {
        name: formData.agentName,
        contact: formData.agentContact,
      },
      sold: formData.sold,
    };

    const response = initialData
      ? await updateProperty(initialData._id, propertyData) // Update
      : await createProperty(propertyData); // Create

    setLoading(false);

    if (response.status === 'success') {
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        propertyType: '',
        rooms: '',
        companyId: '',
        status: 'listed',
        amenities: '',
        coordinates: { lat: 0, lng: 0 },
        isPublished: false,
        agentName: '',
        agentContact: '',
        sold: false,
      });
      setImages([]);
      setNewImages([]);
      setError(null);
    } else {
      setError(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Title, Description, Price, and Location fields */}
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

      {/* Property Type */}
      <select
        name='propertyType'
        value={formData.propertyType}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
        required
      >
        <option value=''>Select Property Type</option>
        <option value='house'>House</option>
        <option value='apartment'>Apartment</option>
      </select>

      {/* Rooms */}
      <input
        type='number'
        name='rooms'
        value={formData.rooms}
        onChange={handleInputChange}
        placeholder='Number of Rooms'
        className='w-full border p-2 rounded'
      />

      {/* Status */}
      <select
        name='status'
        value={formData.status}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
        required
      >
        <option value=''>Select Status</option>
        <option value='listed'>Listed</option>
        <option value='sold'>Sold</option>
        <option value='under review'>Under Review</option>
      </select>

      {/* Amenities */}
      <textarea
        name='amenities'
        value={formData.amenities}
        onChange={handleInputChange}
        placeholder='Amenities (comma separated)'
        className='w-full border p-2 rounded'
      />

      {/* Coordinates */}
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
                lat: parseFloat(e.target.value),
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
                lng: parseFloat(e.target.value),
              },
            })
          }
          placeholder='Longitude'
          className='w-full border p-2 rounded'
        />
      </div>

      {/* Agent Information */}
      <input
        type='text'
        name='agentName'
        value={formData.agentName}
        onChange={handleInputChange}
        placeholder='Agent Name'
        className='w-full border p-2 rounded'
      />
      <input
        type='text'
        name='agentContact'
        value={formData.agentContact}
        onChange={handleInputChange}
        placeholder='Agent Contact'
        className='w-full border p-2 rounded'
      />

      {/* Image Upload Section */}
      <div>
        <label>Property Images:</label>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={(e) => handleImageUpload(Array.from(e.target.files || []))}
          className='w-full border p-2 rounded'
        />
        <div className='grid grid-cols-3 gap-4 mt-4'>
          {images.map((image) => (
            <div key={image.public_id} className='relative'>
              <img src={image.url} alt='Property' className='w-full h-auto' />
              <button
                onClick={() => handleImageDelete(image.public_id)}
                className='absolute top-2 right-2 bg-red-500 text-white rounded p-1'
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sold Status */}
      <label>
        <input
          type='checkbox'
          name='sold'
          checked={formData.sold}
          onChange={(e) => setFormData({ ...formData, sold: e.target.checked })}
        />
        Sold
      </label>

      {/* Published Status */}
      <label>
        <input
          type='checkbox'
          name='isPublished'
          checked={formData.isPublished}
          onChange={(e) =>
            setFormData({ ...formData, isPublished: e.target.checked })
          }
        />
        Published
      </label>

      <button
        type='submit'
        className='bg-primary_main  text-white py-2 px-4 rounded'
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Property'}
      </button>

      {error && <p className='text-red-500'>{error}</p>}
    </form>
  );
};

export default PropertyForm;
