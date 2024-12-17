'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import {
  fetchPropertyById,
  updateProperty,
  deletePropertyImage,
  uploadMultipleImages,
  Property,
} from '@/services/property/propertyApiHandler';
import { AmenitiesInput } from './AmenitiesInputs';

interface EditPropertyProps {
  propertyId: string;
}

export function EditProperty({ propertyId }: EditPropertyProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [newImages, setNewImages] = useState<File[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetchPropertyById(propertyId);
        if (response.status === 'success') {
          setProperty(response.data);
        } else {
          setError('Failed to load property details');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProperty((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setProperty((prev) => (prev ? { ...prev, amenities } : null));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = async (publicId: string) => {
    if (!property?._id) return;
    try {
      await deletePropertyImage(property._id, publicId);
      setProperty((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.filter((img) => img.public_id !== publicId),
            }
          : null
      );
    } catch (err) {
      console.error('Failed to delete image:', err);
      setAlertState({ type: 'error', message: 'Failed to delete image' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!property) return;

    setIsSubmitting(true);
    setAlertState({ type: null, message: '' });

    try {
      // Update property details
      const updateResponse = await updateProperty(propertyId, property);
      if (updateResponse.status !== 'success') {
        throw new Error(updateResponse.message || 'Failed to update property');
      }

      // Upload new images if any
      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('propertyId', propertyId);
        newImages.forEach((file) => formData.append('images', file));

        const uploadResponse = await uploadMultipleImages(formData);
        if (uploadResponse.status !== 'success') {
          throw new Error('Failed to upload new images');
        }

        // Update property with new images
        setProperty((prev) =>
          prev
            ? {
                ...prev,
                images: [...prev.images, ...uploadResponse.data],
              }
            : null
        );
      }

      setAlertState({
        type: 'success',
        message: 'Property updated successfully',
      });
      router.push(`/dashboard/property/${propertyId}`);
    } catch (err) {
      console.error('Error updating property:', err);
      setAlertState({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'An error occurred while updating the property',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <Skeleton className='h-8 w-3/4' />
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-full' />
        </CardContent>
      </Card>
    );
  }

  if (error) return <div className='text-red-500 text-center'>{error}</div>;
  if (!property) return <div className='text-center'>Property not found</div>;

  return (
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold'>
          Edit Property: {property.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
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
            <Label htmlFor='status'>Status</Label>
            <Select
              name='status'
              onValueChange={(value) => handleSelectChange('status', value)}
              defaultValue={property.status}
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
              onChange={handleAmenitiesChange}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='isPublished'>Published</Label>
            <Select
              name='isPublished'
              onValueChange={(value) =>
                handleSelectChange('isPublished', value)
              }
              defaultValue={property.isPublished.toString()}
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
              value={property.agent.name}
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
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='agentContact'>Agent Contact</Label>
            <Input
              id='agentContact'
              name='agentContact'
              value={property.agent.contact}
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
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='images'>Add New Images</Label>
            <Input
              id='images'
              name='images'
              type='file'
              multiple
              onChange={handleImageUpload}
              accept='image/*'
            />
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {property.images.map((image) => (
              <div key={image.public_id} className='relative'>
                <Image
                  src={image.url}
                  alt='Property'
                  width={200}
                  height={200}
                  className='object-cover rounded'
                />
                <Button
                  type='button'
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
