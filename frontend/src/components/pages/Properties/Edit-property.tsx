'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  fetchPropertyById,
  Property,
  updateProperty,
} from '@/services/property/propertyApiHandler';
import {
  CompanyData,
  fetchCompanies,
} from '@/services/company/companyApiHandler';

import { PropertyImageManager } from './PropertyImageManager';
import { AmenitiesInput } from './AmenitiesInputs';

interface EditPropertyFormProps {
  id: string;
}

export function EditPropertyForm({ id }: EditPropertyFormProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [originalImages, setOriginalImages] = useState<
    { url: string; public_id: string }[]
  >([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });
  const router = useRouter();

  useEffect(() => {
    const loadPropertyAndCompanies = async () => {
      setLoading(true);
      try {
        const [propertyResponse, companiesResponse] = await Promise.all([
          fetchPropertyById(id),
          fetchCompanies(),
        ]);
        if (
          propertyResponse.status === 'success' &&
          companiesResponse.status === 'success'
        ) {
          setProperty(propertyResponse.data);
          setOriginalImages(propertyResponse.data.images);
          setCompanies(companiesResponse.data.companies);
        } else {
          setError('Failed to load property or companies');
        }
      } catch {
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    loadPropertyAndCompanies();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!property) return;

    setLoading(true);
    setAlertState({ type: null, message: '' });

    try {
      // Only include images in the update if they've changed
      const updatedProperty: Partial<Property> = { ...property };
      if (
        JSON.stringify(updatedProperty.images) ===
        JSON.stringify(originalImages)
      ) {
        delete updatedProperty.images;
      }

      const updateResponse = await updateProperty(id, updatedProperty);
      if (updateResponse.status === 'success') {
        setAlertState({
          type: 'success',
          message: 'Property updated successfully',
        });
        setTimeout(() => {
          router.push(`/dashboard/property/${id}`);
        }, 2000);
      } else {
        setAlertState({
          type: 'error',
          message: 'Failed to update property',
        });
      }
    } catch {
      setAlertState({
        type: 'error',
        message: 'An error occurred while updating the property',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUpdate = (
    newImages: { url: string; public_id: string }[]
  ) => {
    setProperty((prev) => (prev ? { ...prev, images: newImages } : null));
  };

  if (loading) return <p>Loading property details...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Edit Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              name='title'
              value={property.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              name='description'
              value={property.description}
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
              value={property.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              name='location'
              value={property.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='propertyType'>Property Type</Label>
            <Select
              name='propertyType'
              value={property.propertyType}
              onValueChange={(value) =>
                handleSelectChange('propertyType', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a Property Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Apartment'>Apartment</SelectItem>
                <SelectItem value='House'>House</SelectItem>
                <SelectItem value='Condo'>Condo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='rooms'>Number of Rooms</Label>
            <Input
              id='rooms'
              name='rooms'
              type='number'
              value={property.rooms}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='company'>Company</Label>
            <Select
              name='company'
              value={property.company}
              onValueChange={(value) => handleSelectChange('company', value)}
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
              value={property.status}
              onValueChange={(value) => handleSelectChange('status', value)}
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
            <Label htmlFor='amenities'>Amenities</Label>
            <AmenitiesInput
              value={property.amenities}
              onChange={(amenities) =>
                setProperty((prev) => (prev ? { ...prev, amenities } : null))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='isPublished'>Published</Label>
            <Select
              name='isPublished'
              value={property.isPublished.toString()}
              onValueChange={(value) =>
                handleSelectChange('isPublished', value)
              }
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
              value={property.agent?.name || ''}
              onChange={(e) =>
                setProperty((prev) =>
                  prev
                    ? {
                        ...prev,
                        agent: { ...prev.agent, name: e.target.value },
                      }
                    : null
                )
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='agentContact'>Agent Contact</Label>
            <Input
              id='agentContact'
              name='agentContact'
              value={property.agent?.contact || ''}
              onChange={(e) =>
                setProperty((prev) =>
                  prev
                    ? {
                        ...prev,
                        agent: { ...prev.agent, contact: e.target.value },
                      }
                    : null
                )
              }
            />
          </div>
          <PropertyImageManager
            propertyId={id}
            images={property.images}
            onImagesUpdate={handleImagesUpdate}
          />
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
          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Updating Property...' : 'Update Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
