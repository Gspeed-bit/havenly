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
    status: initialData?.status || 'listed',
    amenities: initialData?.amenities.join(', ') || '',
    coordinates: {
      lat: initialData?.coordinates.lat.toString() || '',
      lng: initialData?.coordinates.lng.toString() || '',
    },
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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (files: File[]) => {
    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadMultipleImages(formData);
      if (response.status === 'success') {
        uploadedImages.push(response.data);
      } else {
        setError(`Failed to upload image: ${response.message}`);
        return;
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

        const response = await uploadMultipleImages(formData);
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
      _id: initialData?._id || '',
      company: formData.companyId,
      amenities: formData.amenities.split(',').map((amenity) => amenity.trim()),
      coordinates: {
        lat: parseFloat(formData.coordinates.lat.toString()),
        lng: parseFloat(formData.coordinates.lng.toString()),
      },
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
        coordinates: { lat: '', lng: '' },
        isPublished: false,
        agentName: '',
        agentContact: '',
        sold: false,
      });
      setImages([]);
      setNewImages([]);
      setError(null);
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
        required
      >
        <option value=''>Select Company</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>

      <div className='space-y-2'>
        <label className='block'>Images</label>
        <input
          type='file'
          multiple
          onChange={(e) =>
            handleImageUpload(e.target.files ? Array.from(e.target.files) : [])
          }
          className='w-full border p-2 rounded'
        />
        <div className='flex flex-wrap gap-2'>
          {images.map((image) => (
            <div key={image.public_id} className='relative'>
              <picture>
                {' '}
                <img
                  src={image.url}
                  alt=''
                  className='w-20 h-20 object-cover'
                />
              </picture>
              <button
                type='button'
                onClick={() => handleImageDelete(image.public_id)}
                className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full'
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className='block font-medium'>Sold</label>
        <input
          type='checkbox'
          name='sold'
          checked={formData.sold}
          onChange={handleInputChange}
          className='w-5 h-5'
        />
      </div>

      <div>
        <label className='block font-medium'>Is Published</label>
        <input
          type='checkbox'
          name='isPublished'
          checked={formData.isPublished}
          onChange={handleInputChange}
          className='w-5 h-5'
        />
      </div>

      {error && <p className='text-red-500'>{error}</p>}

      <button
        type='submit'
        className={`w-full p-2 rounded text-white ${loading ? 'bg-primary_main' : 'bg-red-500'}`}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default PropertyForm;
