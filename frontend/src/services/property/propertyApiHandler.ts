import { apiHandler, ApiResponse } from "@/config/server";


// Define Property Types
export interface Property {
  _id: string;
  title: string;
  description: string;
  images: { url: string; public_id: string }[];
  price: number;
  location: string;
  propertyType: string;
  rooms: number;
  company: string;
  status: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  isPublished: boolean;
  agent: { name: string; contact: string };
}

// Fetch all properties
export const fetchProperties = async (
  filters = {}
): Promise<ApiResponse<Property[]>> => {
  return apiHandler<Property[]>('/properties', 'GET', undefined, filters);
};

// Fetch a single property by ID
export const fetchPropertyById = async (
  id: string
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'GET');
};

// Create a new property
export const createProperty = async (
  data: Property
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>('/properties', 'POST', data);
};

// Update a property
export const updateProperty = async (
  id: string,
  data: Partial<Property>
): Promise<ApiResponse<Property>> => {
  return apiHandler<Property>(`/properties/${id}`, 'PUT', data);
};

// Delete a property
export const deleteProperty = async (
  id: string
): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`/properties/${id}`, 'DELETE');
};

// Upload multipls property images
export const uploadImage = async (
  formData: FormData
): Promise<ApiResponse<{ url: string; public_id: string }>> => {
  return apiHandler<{ url: string; public_id: string }>(
    'image/properties/upload-multiple',
    'POST',
    formData
  );
};

// Delete property image
export const deleteImage = async (
  id: string,
  publicId: string
): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`/properties/${id}/images/${publicId}`, 'DELETE');
};
