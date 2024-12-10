import { apiHandler, ApiResponse } from '@/config/server';

export interface CompanyData {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  website?: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
}
export interface CompaniesResponse {
  companies: CompanyData[];
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
  formData.append('type', 'company_image');
  formData.append('entityId', companyId);

  return apiHandler('/image/upload', 'POST', formData);
};

export const fetchCompanies = async (): Promise<
  ApiResponse<CompaniesResponse>
> => {
  return await apiHandler<CompaniesResponse>('/companies', 'GET');
};

export const fetchCompanyById = async (
  id: string
): Promise<ApiResponse<CompanyData>> => {
  return apiHandler<CompanyData>(`/companies/${id}`, 'GET');
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
