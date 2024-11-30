// services/upload/imageUploader.ts

import { apiHandler } from '@/config/server';
import { AxiosError } from 'axios';

export type ImageUploadData = {
  type: 'user_image' | 'property_image';
  entityId: string;
  image: File;
};

export const uploadImageToServer = async ({
  type,
  entityId,
  image,
}: ImageUploadData) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('type', type);
  formData.append('entityId', entityId);

  try {
    // Call apiHandler to send the image data
    const response = await apiHandler<{ url: string }>(
      '/api/upload/image', // Adjust the endpoint URL based on your server route
      'POST',
      formData
    );

    if (response.status === 'success') {
      return response.data; // Return the uploaded image URL
    } else {
      throw new Error(response.message || 'Image upload failed');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Upload failed:', error.response?.data);
    }
    throw new Error('Image upload failed. Please try again later.');
  }
};
