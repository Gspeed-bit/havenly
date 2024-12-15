'use client';

import { uploadMultipleImages } from '@/services/property/propertyApiHandler';
import { useState } from 'react';

const MultipleImageUpload: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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
    </div>
  );
};

export default MultipleImageUpload;
