'use client';
import Alert from '@/components/ui/alerts/Alert';
import {
  createCompany,
  uploadCompanyLogo,
} from '@/services/company/companyApiHandler';
import { useState } from 'react';

const CreateCompanyForm = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    logo: null as File | null,
    website: '',
    description: '',
  });

  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyData((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createCompany({
        name: companyData.name,
        email: companyData.email,
        phoneNumber: companyData.phoneNumber,
        address: companyData.address,
        website: companyData.website,
        description: companyData.description,
      });

      if (response.status === 'success') {
        const companyId = response.data.company._id as string;

        if (companyData.logo) {
          const uploadResponse = await uploadCompanyLogo(
            companyData.logo,
            companyId
          );

          if (uploadResponse.status === 'success') {
            setAlertState({
              type: 'success',
              message: 'Company created and logo uploaded successfully.',
            });
          } else {
            throw new Error(uploadResponse.message);
          }
        } else {
          setAlertState({
            type: 'success',
            message: 'Company created successfully.',
          });
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error(error);
      setAlertState({
        type: 'error',
        message:
          error.message || 'An error occurred while creating the company.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <Alert type={alertState.type} message={alertState.message} />
      <form onSubmit={handleSubmit} className='space-y-4'>
        {[
          { label: 'Company Name', name: 'name', type: 'text', required: true },
          { label: 'Email', name: 'email', type: 'email', required: true },
          {
            label: 'Phone Number',
            name: 'phoneNumber',
            type: 'text',
            required: true,
          },
          { label: 'Address', name: 'address', type: 'text', required: true },
          { label: 'Website (optional)', name: 'website', type: 'text' },
        ].map((field) => (
          <div key={field.name}>
            <label className='block'>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={(companyData as any)[field.name]}
              onChange={handleChange}
              required={field.required}
              className='w-full p-2 border border-gray-300 rounded'
            />
          </div>
        ))}
        <div>
          <label className='block'>Description (optional)</label>
          <textarea
            name='description'
            value={companyData.description}
            onChange={handleChange}
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <label className='block'>Upload Company Logo</label>
          <input
            type='file'
            onChange={handleImageChange}
            accept='image/*'
            className='w-full p-2 border border-gray-300 rounded'
          />
        </div>
        <div>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary_main text-white'
            } p-2 rounded`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Company'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
