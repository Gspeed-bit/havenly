'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  CompaniesSingleResponse,
  CompanyData,
  fetchCompanyById,
  updateCompany,
} from '@/services/company/companyApiHandler';
import Alert from '@/components/ui/alerts/Alert';

const CompanyDetailsPage = () => {
  const { id } = useParams();

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyData>>({});
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const loadCompany = async () => {
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
  };

  // Define the handleSave function
  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const response = await updateCompany(id as string, formData);
    setLoading(false);

    if (response.status === 'success') {
      setAlertState({
        type: 'success',
        message: 'Company updated successfully',
      });
      setCompany(response.data);
      setEditMode(false);

      // Reload the page after a successful update
      window.location.reload();
    } else {
      setAlertState({
        type: 'error',
        message: response.message,
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadCompany();
    }
  }, [id]);

  // Handle loading state for company data and form data
  if (loading) return <p>Loading company details...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!company) return <p>Company not found.</p>;

  return (
    <div>
      <Alert type={alertState.type} message={alertState.message} />

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
            <input
              type='textarea'
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder='Description'
            />
          </div>

          <div>
            <button type='submit'>Save</button>
          </div>
        </form>
      ) : (
        <div>
          <picture>
            <img
              src={formData.logo}
              alt='Company Logo'
              className='rounded-full w-10 h-10'
            />
          </picture>

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
