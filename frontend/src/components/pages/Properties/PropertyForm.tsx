'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  createProperty,
  uploadMultipleImages,
} from '@/services/property/propertyApiHandler';
import { Property } from '@/services/property/propertyApiHandler';
import {
  CompanyData,
  fetchCompanies,
} from '@/services/company/companyApiHandler';

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
}

export function CreatePropertyForm() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    propertyType: '',
    rooms: 0,
    company: '',
    status: 'listed',
    amenities: [],
    coordinates: { lat: 0, lng: 0 },
    isPublished: false,
    agent: { name: '', contact: '' },
    sold: false,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [alertState, setAlertState] = useState<AlertState>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await fetchCompanies();
        if (response.status === 'success') {
          setCompanies(response.data.companies);
        } else {
          setAlertState({ type: 'error', message: 'Failed to load companies' });
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        setAlertState({
          type: 'error',
          message: 'An error occurred while loading companies',
        });
      }
    };
    loadCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlertState({ type: null, message: '' });

    try {
      // Step 1: Create the property
      const propertyResponse = await createProperty(formData as Property);

      if (propertyResponse.status !== 'success' || !propertyResponse.data) {
        throw new Error(
          propertyResponse.message || 'Failed to create property'
        );
      }

      const newProperty = propertyResponse.data;

      // Step 2: Upload images if any are selected
      if (selectedFiles.length > 0) {
        const imageFormData = new FormData();
        if (newProperty._id) {
          imageFormData.append('propertyId', newProperty._id);
        } else {
          throw new Error('Property ID is undefined');
        }
        selectedFiles.forEach((file) => {
          imageFormData.append('images', file);
        });

        const imageUploadResponse = await uploadMultipleImages(imageFormData);

        if (imageUploadResponse.status !== 'success') {
          // If image upload fails, we might want to delete the created property or handle it differently
          console.error(
            'Failed to upload images:',
            imageUploadResponse.message
          );
          setAlertState({
            type: 'error',
            message:
              'Property created, but failed to upload images. Please try uploading images later.',
          });
        } else {
          setAlertState({
            type: 'success',
            message: 'Property created and images uploaded successfully',
          });
        }
      } else {
        setAlertState({
          type: 'success',
          message: 'Property created successfully',
        });
      }
      router.push(`/dashboard/properties/${newProperty._id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      setAlertState({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating the property',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Create New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='price'>Price</Label>
            <Input
              id='price'
              name='price'
              type='number'
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='propertyType'>Property Type</Label>
            <Input
              id='propertyType'
              name='propertyType'
              value={formData.propertyType}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='rooms'>Number of Rooms</Label>
            <Input
              id='rooms'
              name='rooms'
              type='number'
              value={formData.rooms}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='company'>Company</Label>
            <Select
              name='company'
              onValueChange={(value) => handleSelectChange('company', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a company' />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id || ''}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select
              name='status'
              onValueChange={(value) => handleSelectChange('status', value)}
              defaultValue='listed'
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='listed'>Listed</SelectItem>
                <SelectItem value='under review'>Under Review</SelectItem>
                <SelectItem value='sold'>Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='amenities'>Amenities (comma-separated)</Label>
            <Input
              id='amenities'
              name='amenities'
              value={formData.amenities?.join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amenities: e.target.value
                    .split(',')
                    .map((item) => item.trim()),
                }))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='isPublished'>Published</Label>
            <Select
              name='isPublished'
              onValueChange={(value) =>
                handleSelectChange('isPublished', (value === 'true').toString())
              }
              defaultValue='false'
            >
              <SelectTrigger>
                <SelectValue placeholder='Is property published?' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Yes</SelectItem>
                <SelectItem value='false'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='agentName'>Agent Name</Label>
            <Input
              id='agentName'
              name='agentName'
              value={formData.agent?.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  agent: {
                    ...prev.agent,
                    name: e.target.value,
                    contact: prev.agent?.contact || '',
                  },
                }))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='agentContact'>Agent Contact</Label>
            <Input
              id='agentContact'
              name='agentContact'
              value={formData.agent?.contact}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  agent: {
                    ...prev.agent,
                    contact: e.target.value,
                    name: prev.agent?.name || '',
                  },
                }))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='images'>Property Images</Label>
            <Input
              id='images'
              name='images'
              type='file'
              multiple
              onChange={handleFileChange}
              accept='image/*'
            />
          </div>
          {alertState.type && (
            <Alert
              variant={alertState.type === 'error' ? 'destructive' : 'default'}
            >
              {alertState.type === 'error' ? (
                <AlertCircle className='h-4 w-4' />
              ) : (
                <CheckCircle2 className='h-4 w-4' />
              )}
              <AlertTitle>
                {alertState.type === 'error' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription>{alertState.message}</AlertDescription>
            </Alert>
          )}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Creating Property...' : 'Create Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
