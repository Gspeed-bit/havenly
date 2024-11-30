import React, { useState } from 'react';
import {
  uploadImageToServer,
  ImageUploadData,
} from '@/services/upload/imageUploader';

const ImageUpload: React.FC<{
  type: 'user_image' | 'property_image';
  entityId: string;
}> = ({ type, entityId }) => {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setError(null);
      setIsUploading(true);

      try {
        const uploadData: ImageUploadData = { type, entityId, image: file };
        const response = await uploadImageToServer(uploadData);

        if (response.url) {
          setUploadedUrl(response.url);
        }
      } catch {
        setError('Image upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && !isUploading && (
        <div>
          <p>Image Preview:</p>
          <picture>
            <img
              src={URL.createObjectURL(image)}
              alt='Preview'
              style={{ width: '200px' }}
            />
          </picture>
        </div>
      )}
      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <picture>
            {' '}
            <img src={uploadedUrl} alt='Uploaded' style={{ width: '200px' }} />
          </picture>
        </div>
      )}
      <input
        type='file'
        onChange={handleFileChange}
        accept='image/*'
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default ImageUpload;
