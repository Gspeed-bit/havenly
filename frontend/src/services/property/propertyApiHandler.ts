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

export const createProperty = (
  propertyData: Partial<Property>
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>('/properties', 'POST', propertyData);
};

export const updateProperty = (
  id: string,
  propertyData: Partial<Property>
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'PUT', propertyData);
};

export const deleteProperty = (id: string): Promise<ApiResponse<void>> => {
  return apiHandler<void>(`/properties/${id}`, 'DELETE');
};

export const fetchProperties = (
  filters: Record<string, string>
): Promise<ApiResponse<{ data: Property[]; pagination: { total: number; currentPage: number; totalPages: number } }>> => {
  return apiHandler<{ data: Property[]; pagination: { total: number; currentPage: number; totalPages: number } }>(
    '/properties',
    'GET',
    undefined,
    filters
  );
};
export const fetchPropertiesForUser = (
  filters: Record<string, string>
): Promise<ApiResponse<{ data: Property[]; pagination: { total: number; currentPage: number; totalPages: number } }>> => {
  return apiHandler<{ data: Property[]; pagination: { total: number; currentPage: number; totalPages: number } }>(
    '/property',
    'GET',
    undefined,
    filters
  );
};

export const fetchPropertyById = (
  id: string
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'GET');
};
export const getPropertyByIdForUser = (id: string): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/property/${id}`, 'GET');
};

export const uploadMultipleImages = async (formData: FormData) => {
  return apiHandler<{ secure_url: string; public_id: string }[]>(
    '/image/properties/upload-multiple',
    'POST',
    formData
  );
};

export const deletePropertyImage = async (propertyId: string, publicId: string) => {
  return apiHandler<void>(`image/properties/${propertyId}/images/${publicId}`, 'DELETE');
};