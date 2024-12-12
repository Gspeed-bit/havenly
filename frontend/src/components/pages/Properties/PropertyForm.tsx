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

const PropertyForm = ({ initialData, onSuccess }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    location: initialData?.location || '',
    propertyType: initialData?.propertyType || '',
    rooms: initialData?.rooms || '',
    companyId: initialData?.company || '',
    isPublished: initialData?.isPublished || false,
  });

  const [images, setImages] = useState(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      const response = await fetchCompanies();
      console.log('Fetched companies:', response); // Debugging
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
      status: '',
      amenities: [],
      coordinates: {
        lat: 0,
        lng: 0,
      },
      agent: {
        name: '',
        contact: '',
      },
    };

    const response = initialData
      ? await updateProperty(initialData._id, propertyData) // Update
      : await createProperty(propertyData); // Create

    setLoading(false);

    if (response.status === 'success') {
      onSuccess();
    } else {
      setError(response.message);
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
        name='companyId'
        value={formData.companyId}
        onChange={handleInputChange}
        className='w-full border p-2 rounded'
        required
      >
        <option value=''>Select a Company</option>
        {companies.length > 0 ? (
          companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))
        ) : (
          <option disabled>No companies available</option>
        )}
      </select>

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
                type='button'
                onClick={() => handleImageDelete(image.public_id)}
                className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='bg-primary_main text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50'
      >
        {loading
          ? 'Saving...'
          : initialData
            ? 'Update Property'
            : 'Create Property'}
      </button>
      {error && <p className='text-red-500'>{error}</p>}
    </form>
  );
};

export default PropertyForm;
