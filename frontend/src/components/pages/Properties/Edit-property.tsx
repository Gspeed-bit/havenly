'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  // updateProperty,
  uploadMultipleImages,
  deletePropertyImage,
  fetchPropertyById,
  Property,
  updateProperty,
} from '@/services/property/propertyApiHandler';
import {
  CompanyData,
  fetchCompanies,
} from '@/services/company/companyApiHandler';
import { AmenitiesInput } from './AmenitiesInputs';

interface AlertState {
  type: 'success' | 'error' | null;
  message: string;
}

interface EditPropertyProps {
  propertyId: string;
}

export function EditProperty({ propertyId }: EditPropertyProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [alertState, setAlertState] = useState<AlertState>({
    type: null,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPropertyAndCompanies = async () => {
      try {
        const [propertyResponse, companiesResponse] = await Promise.all([
          fetchPropertyById(propertyId),
          fetchCompanies(),
        ]);

        if (propertyResponse.status === 'success' && propertyResponse.data) {
          setProperty(propertyResponse.data);
        } else {
          setAlertState({ type: 'error', message: 'Failed to load property' });
        }

        if (companiesResponse.status === 'success') {
          setCompanies(companiesResponse.data.companies);
        } else {
          setAlertState({ type: 'error', message: 'Failed to load companies' });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setAlertState({
          type: 'error',
          message: 'An error occurred while loading data',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPropertyAndCompanies();
  }, [propertyId]);

  const handleSelectChange = (name: string, value: string) => {
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

 const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
   setSelectedFiles(Array.from(e.target.files || []));
 };

 const handleRemoveImage = async (publicId: string) => {
   if (!property?._id) return;

   try {
     const response = await deletePropertyImage(property._id, publicId);
     if (response.status === 'success') {
       setProperty((prev) =>
         prev
           ? {
               ...prev,
              images: prev.images.filter((img: { url: string; public_id: string }) => img.public_id !== publicId),
             }
           : null
       );
       setAlertState({
         type: 'success',
         message: 'Image removed successfully',
       });
     } else {
       throw new Error(response.message || 'Failed to remove image');
     }
   } catch (error) {
     console.error('Error removing image:', error);
     setAlertState({ type: 'error', message: 'Failed to remove image' });
   }
 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   if (!property) return;

   setIsSubmitting(true);
   setAlertState({ type: null, message: '' });

   try {
     // Step 1: Update the property
     const updateResponse = await updateProperty(propertyId, property);

     if (!updateResponse || updateResponse.status !== 'success') {
       throw new Error(updateResponse.message || 'Failed to update property');
     }

     // Step 2: Upload new images if any are selected
     if (selectedFiles.length > 0) {
       const imageFormData = new FormData();
       imageFormData.append('propertyId', propertyId);
       selectedFiles.forEach((file) => {
         imageFormData.append('images', file);
       });

       const imageUploadResponse = await uploadMultipleImages(imageFormData);

       if (imageUploadResponse.status !== 'success') {
         console.error('Failed to upload images:', imageUploadResponse.message);
         setAlertState({
           type: 'error',
           message: 'Property updated, but failed to upload new images.',
         });
       } else {
         setProperty((prev) =>
           prev
             ? {
                 ...prev,
                images: [...prev.images, ...(imageUploadResponse.data || []).map((img: any) => ({ url: img.url, public_id: img.public_id }))],
               }
             : null
         );
       }
     }

     setAlertState({
       type: 'success',
       message: 'Property updated successfully',
     });
     router.push(`/dashboard/property/${propertyId}`);
   } catch (error) {
     setAlertState({
       type: 'error',
       message:
         error instanceof Error
           ? error.message
           : 'An error occurred while updating the property',
     });
   } finally {
     setIsSubmitting(false);
   }
 };


  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Property not found
      </div>
    );
  }

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
            <Input
              id='propertyType'
              name='propertyType'
              value={property.propertyType}
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
              value={property.agent?.name}
              onChange={(e) =>
                setProperty((prev) =>
                  prev
                    ? {
                        ...prev,
                        agent: {
                          ...prev.agent,
                          name: e.target.value,
                        },
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
              value={property.agent?.contact}
              onChange={(e) =>
                setProperty((prev) =>
                  prev
                    ? {
                        ...prev,
                        agent: {
                          ...prev.agent,
                          contact: e.target.value,
                        },
                      }
                    : null
                )
              }
            />
          </div>
          <div className='space-y-2'>
            <Label>Current Images</Label>
            {property.images && property.images.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {property.images.map((image, index) => (
                  <div key={index} className='relative'>
                    <Image
                      src={image.url}
                      alt={`Property image ${index + 1}`}
                      width={200}
                      height={200}
                      className='object-cover rounded-md'
                    />
                    <Button
                      variant='destructive'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() => handleRemoveImage(image.public_id)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='newImages'>Add New Images</Label>
            <Input
              id='newImages'
              name='newImages'
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
            {isSubmitting ? 'Updating Property...' : 'Update Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
