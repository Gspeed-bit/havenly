'use client';

import {
  uploadMultipleImages,
  deleteImage,
} from '@/services/property/propertyApiHandler';
import { useState } from 'react';

const MultipleImageUpload: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // Hardcoded entityId for testing
  const entityId = '675f53b145d584c4710f04db'; // Replace with your actual test ID

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviews(files.map((file) => URL.createObjectURL(file)));
    }
  };

const handleUpload = async () => {
  if (images.length === 0) return alert('Please select images first.');

  const formData = new FormData();
  images.forEach((image) => formData.append('images', image));
  formData.append('entityId', entityId);

  setUploading(true);
  try {
    const response = await uploadMultipleImages(formData);
    if (response.status === 'success') {
      // Ensure response.data is wrapped as an array
      setUploadedImages(
        Array.isArray(response.data) ? response.data : [response.data]
      );
      alert('Images uploaded successfully');
      console.log('Uploaded Images:', response.data);
    } else {
      alert('Failed to upload images');
    }
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    setUploading(false);
  }
};




  const handleDeleteImage = async (publicId: string) => {
    try {
      const response = await deleteImage(entityId, publicId);
      if (response.status === 'success') {
        setUploadedImages((prev) =>
          prev.filter((image) => image.public_id !== publicId)
        );
        alert('Image deleted successfully');
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className='multiple-image-upload'>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageChange}
      />
      <div className='previews'>
        {previews.map((src, idx) => (
          <picture key={idx}>
            <img
              src={src}
              alt={`Preview ${idx}`}
              style={{ maxWidth: '100px' }}
            />
          </picture>
        ))}
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Images'}
      </button>

      <div className='uploaded-images'>
        {uploadedImages.map((image, idx) => (
          <div key={image.public_id || idx} className='uploaded-image'>
          
            <picture>
              <img
                src={image.url}
                alt='Uploaded'
                style={{ maxWidth: '100px' }}
              />
            </picture>
            <button onClick={() => handleDeleteImage(image.public_id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleImageUpload;
