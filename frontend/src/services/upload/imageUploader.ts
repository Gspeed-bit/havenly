import { apiHandler } from '@/config/server';

// Interface for the data that will be passed to the image upload API
export interface ImageUploadData {
  type: string; // Type of image, e.g. 'user_image' or 'property_image'
  entityId: string; // The unique ID for the entity the image belongs to (e.g., user ID or property ID)
  image: File; // The actual image file
}

interface UploadImageResponse {
  url: string;
  id: string;
}

// Function to upload image to the server
export const uploadImageToServer = async ({
  image,
  type,
  entityId,
}: ImageUploadData): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('type', type);
  formData.append('entityId', entityId);

  try {
    // Send the image data to the backend using the apiHandler function
    const response = await apiHandler<UploadImageResponse>(
      '/image/upload',
      'POST',
      formData
    );

    // Check if the response is successful
    if (response.status === 'success') {
      return response.data; // Return the data if the response was successful
    } else {
      // Handle the error response
      throw new Error(response.message || 'Image upload failed');
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle other errors
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
