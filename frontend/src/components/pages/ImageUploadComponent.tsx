import React, { useState } from 'react';
import {
  uploadImageToServer,
  ImageUploadData,
} from '@/services/upload/imageUploader'; // Ensure you import the correct function

const ImageUpload: React.FC<{
  type: 'user_image' | 'property_image';
  entityId: string;
}> = ({ type, entityId }) => {
  const [image, setImage] = useState<File | null>(null); // Image file state
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // URL of uploaded image

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Store the selected image
      setError(null); // Clear previous error
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError(null); // Clear previous error

    try {
      const uploadData: ImageUploadData = {
        type,
        entityId,
        image, // The selected image file
      };

      const response = await uploadImageToServer(uploadData);

      if (response.url) {
        setUploadedUrl(response.url); // Store the uploaded image URL
      } else {
        setError('Image upload failed. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
      {/* Display error messages */}
      {/* Show uploaded image preview */}
      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <picture>
            <img src={uploadedUrl} alt='Uploaded' style={{ width: '200px' }} />
          </picture>
        </div>
      )}
      {/* File input for selecting an image */}
      <input type='file' onChange={handleFileChange} />
      {/* Upload button */}
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUpload;
