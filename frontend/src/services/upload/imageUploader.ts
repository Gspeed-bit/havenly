import { apiHandler } from '@/config/server';

export interface ImageUploadData {
  type: string;
  entityId: string;
  image: File;
}

interface UploadImageResponse {
  url: string;
  id: string;
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

  const response = await apiHandler<UploadImageResponse>(
    '/image/upload',
    'POST',
    formData
  );

  if (response.status === 'success') {
    return response.data;
  } else {
    throw new Error(response.message || 'Image upload failed');
  }
};
