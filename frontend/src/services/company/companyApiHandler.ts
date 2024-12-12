import { apiHandler, ApiResponse } from '@/config/server';

// Assuming this is your current CompanyData type

export interface CompanyData {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  properties?: string[];
  website?: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
}
export interface CompaniesResponse {
  companies: CompanyData[];
}

export interface CompaniesSingleResponse {
  status: string;
  message: string;
  company: CompanyData; // This is the nested company object
}

export const createCompany = async (
  companyData: CompanyData
): Promise<ApiResponse<{ company: CompanyData }>> => {
  return apiHandler('/companies', 'POST', companyData);
};

export const uploadCompanyLogo = async (
  logo: File,
  companyId: string
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append('image', logo);
  formData.append('type', 'company_image'); // This type ensures the correct logic is triggered
  formData.append('entityId', companyId);

  return apiHandler('/image/upload', 'POST', formData); // This should point to the backend route handling image uploads
};

export const fetchCompanies = async (): Promise<
  ApiResponse<CompaniesResponse>
> => {
  return await apiHandler<CompaniesResponse>('/companies', 'GET', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Pass the token
  });
};

export const fetchCompanyById = async (
  id: string
): Promise<ApiResponse<CompaniesSingleResponse>> => {
  return await apiHandler<CompaniesSingleResponse>(`/companies/${id}`, 'GET', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Pass the token
  });
};

export const updateCompany = async (
  id: string,
  data: Partial<CompanyData>
): Promise<ApiResponse<CompanyData>> => {
  return apiHandler<CompanyData>(`/companies/${id}`, 'PUT', data);
};

export const deleteCompany = async (id: string): Promise<ApiResponse<null>> => {
  return apiHandler<null>(`/companies/${id}`, 'DELETE');
};
