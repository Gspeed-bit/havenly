import { apiHandler, SuccessResponse } from '@/config/server';
import React, { useState } from 'react';



const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle the image upload
  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'user_image'); // Type to define user image
    formData.append('entityId', 'default-entity-id'); // Replace with actual user ID

    try {
      setIsLoading(true);
      const response = await apiHandler<SuccessResponse<{ url: string }>>(
        '/image/upload',
        'POST',
        formData
      );

      if (response.status === 'error') {
        setError(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('No image selected');
      return;
    }

    try {
      const result = await uploadImage(image);
      console.log('Uploaded image URL:', result?.data.url); // Handle the image URL from response
      // You can do something with the result, like updating the user's profile image URL
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleImageChange} />
        {previewImgUrl && (
          <picture>
            <img
              src={previewImgUrl}
              alt='Image Preview'
              width='100'
              height='100'
            />
          </picture>
        )}
        <button type='submit' disabled={isLoading}>
          Upload Image
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
