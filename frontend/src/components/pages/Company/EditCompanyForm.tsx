'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  fetchCompanyById,
  updateCompany,
  uploadCompanyLogo,
} from '@/services/company/companyApiHandler';
import { X } from 'lucide-react'; // Assuming you are using lucide-react for the icon

interface EditCompanyFormProps {
  companyId: string;
}

export function EditCompanyForm({ companyId }: EditCompanyFormProps) {
  const router = useRouter();
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    logo: null as File | null,
    logoUrl: '',
    website: '',
    description: '',
  });

  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const response = await fetchCompanyById(companyId);
        if (response.status === 'success' && response.data) {
          const {
            name,
            email,
            phoneNumber,
            address,
            website = '',
            description = '',
            logo,
          } = response.data.company;
          setCompanyData({
            name,
            email,
            phoneNumber,
            address,
            website,
            description,
            logo: null,
            logoUrl: logo || '',
          });
        } else {
          setAlertState({
            type: 'error',
            message: 'Failed to load company data',
          });
        }
      } catch (error) {
        setAlertState({
          type: 'error',
          message: 'An error occurred while loading company data',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [companyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(newFiles);
      setCompanyData((prev) => ({ ...prev, logo: newFiles[0], logoUrl: '' }));
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validatePhoneNumber(companyData.phoneNumber)) {
      setAlertState({
        type: 'error',
        message:
          'Invalid phone number format. It should be 10 digits or start with a + followed by 10 digits.',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await updateCompany(companyId, {
        name: companyData.name,
        email: companyData.email,
        phoneNumber: companyData.phoneNumber,
        address: companyData.address,
        website: companyData.website,
        description: companyData.description,
      });

      if (response.status === 'success') {
        if (companyData.logo) {
          const uploadResponse = await uploadCompanyLogo(
            companyData.logo,
            companyId
          );

          if (uploadResponse.status === 'success') {
            setAlertState({
              type: 'success',
              message: 'Company updated and logo uploaded successfully.',
            });
          } else {
            throw new Error(uploadResponse.message);
          }
        } else {
          setAlertState({
            type: 'success',
            message: 'Company updated successfully.',
          });
        }

        // Redirect to the company list page after successful update
        setTimeout(() => {
          router.push('/dashboard/companies');
        }, 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      setAlertState({
        type: 'error',
        message:
          error.message || 'An error occurred while updating the company.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (index === 0) {
      setCompanyData((prev) => ({ ...prev, logo: null }));
    }
  };

  const removeLogo = () => {
    setCompanyData((prev) => ({ ...prev, logo: null, logoUrl: '' }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
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
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type}
            name={field.name}
            value={(companyData as any)[field.name]}
            onChange={handleChange}
            required={field.required}
          />
        </div>
      ))}
      <div>
        <Label htmlFor='description'>Description (optional)</Label>
        <Textarea
          id='description'
          name='description'
          value={companyData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor='logo'>Upload New Company Logo (optional)</Label>
        <Input
          id='logo'
          type='file'
          onChange={handleImageChange}
          accept='image/*'
        />
      </div>
      {companyData.logoUrl && (
        <div className='relative inline-block mt-4'>
          <picture>
            <img
              src={companyData.logoUrl}
              alt='Current logo'
              className='w-32 h-32 object-cover rounded'
            />
          </picture>
          <Button
            variant='destructive'
            size='icon'
            className='absolute top-1 right-1'
            onClick={removeLogo}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {selectedFiles.map((file, index) => (
          <div key={index} className='relative'>
            <picture>
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected ${index + 1}`}
                className='w-full h-32 object-cover rounded'
              />
            </picture>
            <Button
              variant='destructive'
              size='icon'
              className='absolute top-1 right-1'
              onClick={() => removeFile(index)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
      <Button type='submit' disabled={isSubmitting} className='w-full'>
        {isSubmitting ? 'Updating...' : 'Update Company'}
      </Button>
    </form>
  );
}
