import {
  ImageUploadData,
  uploadImageToServer,
} from '@/services/upload/imageUploader';
import React, { useState } from 'react';

interface ImageUploadProps {
  entityId: string; // This will be the userId or propertyId
  type: 'user_profile' | 'property_image'; // Type of image (user profile or property)
}

const ImageUpload: React.FC<ImageUploadProps> = ({ entityId, type }) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
    }
  };

  // Upload image to the backend using the separated service
  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    setIsUploading(true);
    setError('');
    try {
      // Create an object that conforms to the ImageUploadData interface
      const uploadData: ImageUploadData = {
        image: image,
        type: type,
        entityId: entityId,
      };

      // Call the service to upload the image
      const result = await uploadImageToServer(uploadData);

      setUploadedUrl(result.url);
      alert('Image uploaded successfully!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {uploadedUrl && (
        <div>
          <p>Uploaded Image:</p>
          <picture>
            {' '}
            <img src={uploadedUrl} alt='Uploaded' style={{ width: '200px' }} />
          </picture>
        </div>
      )}
      <input type='file' onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default ImageUpload;
