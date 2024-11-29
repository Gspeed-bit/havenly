import { apiHandler } from "@/config/server";

interface UploadImageResponse {
  url: string;
  id: string;
}

// Interface for the data that will be passed to the image upload API
export interface ImageUploadData {
  type: string; // Type of image, e.g. 'user_profile' or 'property_image'
  entityId: string; // The unique ID for the entity the image belongs to (e.g., user ID or property ID)
  image: File; // The actual image file
}

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
    const response = await apiHandler<UploadImageResponse>(
      '/image/upload',
      'POST',
      formData
    );

    if (response.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || 'Image upload failed.');
  }
};
