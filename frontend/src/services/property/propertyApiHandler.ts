import { apiHandler, ApiResponse } from '@/config/server';

export interface Property {
  _id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: string;
  images: { url: string; public_id: string }[];
  rooms: number;
  company: string;
  status: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  isPublished: boolean;
  agent: {
    name: string;
    contact: string;
  };
  sold: boolean;
}

export interface PropertySingleResponse {
  status: string;
  message: string;
  propertyData: Property; // This is the nested company object
}
export interface PropertyResponse {
  data: Property[]; // Array of properties
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

export const createProperty = async (
  data: Property
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>('/properties', 'POST', data);
};

export const uploadMultipleImages = async (
  formData: FormData
): Promise<ApiResponse<string[]>> => {
  try {
    const response = await apiHandler<string[]>(
      '/image/upload',
      'POST',
      formData,
      {},
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    return response;
  } catch (error) {
    console.error('Error uploading images:', error);
    return { status: 'error', message: 'Failed to upload images' };
  }
};

// Fetch all properties
export const fetchProperties = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: Record<string, any> = {},
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PropertyResponse>> => {
  const queryParams = { ...filters, page, limit }; // Combine filters with pagination params
  return apiHandler<PropertyResponse>(
    '/properties',
    'GET',
    undefined,
    queryParams
  );
};
export const fetchPropertyById = async (
  id: string
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'GET');
};

export const updateProperty = async (
  propertyId: string,
  propertyData: Partial<Property>
): Promise<ApiResponse<Property>> => {
  try {
    const response = await apiHandler<Property>(
      `/properties/${propertyId}`,
      'PUT',
      propertyData
    );
    return response;
  } catch (error) {
    console.error('Error updating property:', error);
    return { status: 'error', message: 'Failed to update property' };
  }
};
export const deleteProperty = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`/properties/${id}`, 'DELETE');
};

export const deletePropertyImage = async (
  propertyId: string,
  publicId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await apiHandler<void>(
      `/image/properties/${propertyId}/images/${publicId}`,
      'DELETE'
    );
    return response;
  } catch (error) {
    console.error('Error deleting property image:', error);
    return { status: 'error', message: 'Failed to delete property image' };
  }
};
