import React, { useState } from 'react';
import {
  uploadImageToServer,
  ImageUploadData,
} from '@/services/upload/imageUploader';
import useStore from '@/store/imageStore';


const ImageUpload: React.FC<{
  type: 'user_image' | 'property_image';
  entityId: string;
}> = ({ type, entityId }) => {
  const [image, setImage] = useState<File | null>(null); // Image file state
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // URL of uploaded image

  const { setUserImage } = useStore();  // Access zustand store to set the user image URL

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Set the selected image to preview
      setError(null); // Clear any previous errors
      setIsUploading(true); // Start uploading

      try {
        const uploadData: ImageUploadData = {
          type,
          entityId,
          image: file, // The selected image file
        };

        // Trigger the upload when an image is selected
        const response = await uploadImageToServer(uploadData);

        if (response.url) {
          setUploadedUrl(response.url); // Store the uploaded image URL
          setUserImage(response.url); // Update the zustand store with the new user image URL
        }
      } catch {
        setError('Image upload failed. Please try again.');
      } finally {
        setIsUploading(false); // Stop uploading when done
      }
    }
  };

  return (
    <div>
      <h3>Upload Image</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
      {/* Display error messages */}
      {/* Show image preview before uploading */}
      {image && !isUploading && (
        <div>
          <p>Image Preview:</p>
          <picture>
            <img
              src={URL.createObjectURL(image)}
              alt='Image Preview'
              style={{ width: '200px' }}
            />
          </picture>
        </div>
      )}
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
      <input
        type='file'
        onChange={handleFileChange}
        accept='image/*'
        disabled={isUploading} // Disable input while uploading
      />
      {/* Displaying loading text during upload */}
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default ImageUpload;
