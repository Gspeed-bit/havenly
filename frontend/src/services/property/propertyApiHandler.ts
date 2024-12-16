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

export const createProperty = async (
  data: Property,

): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>('/properties', 'POST', data);
};

export const uploadMultipleImages = async (
  formData: FormData
): Promise<ApiResponse<{ url: string; public_id: string }[]>> => {
  return apiHandler<{ url: string; public_id: string }[]>(
    '/image/properties/upload-multiple',
    'POST',
    formData
  );
};

export const fetchProperties = async (
  filters: Record<string, any> = {},
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Property[]>> => {
  const queryParams = { ...filters, page, limit };
  return apiHandler<Property[]>('/properties', 'GET', undefined, queryParams);
};

export const fetchPropertyById = async (
  id: string
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'GET');
};

export const updateProperty = async (
  id: string,
  data: Partial<Property>
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'PUT', data);
};

export const deleteProperty = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`/properties/${id}`, 'DELETE');
};

export const deletePropertyImage = async (
  id: string,
  publicId: string
): Promise<ApiResponse<null>> => {
  return apiHandler<null>(
    `/image/properties/${id}/images/${publicId}`,
    'DELETE'
  );
};
