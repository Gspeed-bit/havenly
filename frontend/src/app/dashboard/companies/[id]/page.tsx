'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  CompanyData,
  fetchCompanyById,
  updateCompany,
  uploadCompanyLogo,
} from '@/services/company/companyApiHandler';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CompanyDetailsPage = () => {
  const { id } = useParams();

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyData>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null); // Track logo file input
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Memoize loadCompany with useCallback
  const loadCompany = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const response = await fetchCompanyById(id as string);

    if (response.status === 'success') {
      setCompany(response.data.company);
      setFormData(response.data?.company);
    } else {
      setError(response.message);
    }
    setLoading(false);
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const updatedData = { ...formData };

    // If there's a new logo, upload it
    if (logoFile) {
      const uploadResponse = await uploadCompanyLogo(logoFile, id as string);
      if (uploadResponse.status === 'success') {
        updatedData.logo = uploadResponse.data.url; // Update logo URL after upload
      } else {
        setAlertState({ type: 'error', message: uploadResponse.message });
        setLoading(false);
        return;
      }
    }

    const response = await updateCompany(id as string, updatedData);
    setLoading(false);

    if (response.status === 'success') {
      setAlertState({
        type: 'success',
        message: 'Company updated successfully',
      });
      setCompany(response.data);
      setEditMode(false);
      // Reset the alert after 5 seconds
      setTimeout(() => setAlertState({ type: null, message: '' }), 5000);
    } else {
      setAlertState({
        type: 'error',
        message: response.message,
      });
    }
  };

  // useEffect with loadCompany as a dependency
  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  if (loading) return <p>Loading company details...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!company) return <p>Company not found.</p>;

  return (
    <div>
      {alertState.type && (
        <Alert
          variant={alertState.type === 'success' ? 'default' : 'destructive'}
          className='mb-4 transition-opacity duration-500 ease-in-out'
        >
          <AlertTitle>
            {alertState.type === 'success' ? 'Success' : 'Error'}
          </AlertTitle>
          <AlertDescription>{alertState.message}</AlertDescription>
        </Alert>
      )}

      {editMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label>Name</label>
            <input
              type='text'
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder='Name'
            />
          </div>

          <div>
            <label>Address</label>
            <input
              type='text'
              value={formData.address || ''}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder='Address'
            />
          </div>

          <div>
            <label>Phone Number</label>
            <input
              type='text'
              value={formData.phoneNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder='Phone Number'
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type='email'
              value={formData.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder='Email'
            />
          </div>

          <div>
            <label>Website</label>
            <input
              type='text'
              value={formData.website || ''}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder='Website'
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Description'
            />
          </div>

          <div>
            <label>Logo</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt='Current Logo'
                className='rounded-full w-10 h-10 mt-2'
              />
            )}
          </div>

          <div>
            <button type='submit'>Save</button>
          </div>
        </form>
      ) : (
        <div>
          <Avatar className='h-10 w-10 border-2 border-primary'>
            <AvatarImage src={formData.logo || company.logo} />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {company.name?.[0]?.toUpperCase() || 'H'}
            </AvatarFallback>
          </Avatar>

          <h1>Name: {company.name}</h1>
          <p>Address: {company.address}</p>
          <p>Phone Number: {company.phoneNumber}</p>
          <p>Email: {company.email}</p>
          <p>Website: {company.website}</p>
          <p>Description: {company.description}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default CompanyDetailsPage;
