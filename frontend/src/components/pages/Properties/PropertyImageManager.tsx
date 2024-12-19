'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, X, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  uploadMultipleImages,
  deletePropertyImage,
} from '@/services/property/propertyApiHandler';

interface PropertyImage {
  url: string;
  public_id: string;
}

interface PropertyImageManagerProps {
  propertyId: string;
  images: PropertyImage[];
  onImagesUpdate: (newImages: PropertyImage[]) => void;
}

export function PropertyImageManager({
  propertyId,
  images,
  onImagesUpdate,
}: PropertyImageManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('propertyId', propertyId);
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await uploadMultipleImages(formData);

      // Log the full response to understand its structure
      console.log('Response from server:', response);

      // Check if the response has the expected format
      if (
        response &&
        response.status === 'success' &&
        Array.isArray(response.data) &&
        response.data.every(
          (image: { secure_url: string; public_id: string }) =>
            image.secure_url && image.public_id
        )
      ) {
        const newImages = response.data.map(
          (image: { secure_url: string; public_id: string }) => ({
            url: image.secure_url,
            public_id: image.public_id,
          })
        );
        // Update the state with the new images, keeping the existing ones
        onImagesUpdate([...images, ...newImages]);
        setSelectedFiles([]);
        setSuccessMessage('Images uploaded successfully!');
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      if (err instanceof Error) {
        setError(`An error occurred while uploading images: ${err.message}`);
      } else {
        setError('An unknown error occurred while uploading images.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      const response = await deletePropertyImage(propertyId, publicId);
      if (response.status === 'success') {
        const updatedImages = images.filter(
          (img) => img.public_id !== publicId
        );
        onImagesUpdate(updatedImages);
        setSuccessMessage('Image deleted successfully');
      } else {
        setError('Failed to delete image');
      }
    } catch {
      setError('An error occurred while deleting the image');
    }
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert variant='default' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-4'>
          {/* Existing images */}
          {images.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {images.map((image, idx) => (
                <div key={idx} className='relative group'>
                  <picture>
                    {' '}
                    <img
                      src={image.url}
                      alt={`uploaded-image-${idx}`}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </picture>
                  <button
                    className='absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full group-hover:opacity-100 transition-opacity duration-200'
                    onClick={() => handleDelete(image.public_id)}
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500'>No images uploaded yet.</p>
          )}

          {/* Newly selected files for upload */}
          {selectedFiles.length > 0 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className='relative group'>
                  <picture>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </picture>
                  <button
                    className='absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                    onClick={() => {
                      setSelectedFiles((prevFiles) =>
                        prevFiles.filter((_, i) => i !== idx)
                      );
                    }}
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2'>
          <Input
            type='file'
            multiple
            onChange={handleFileChange}
            accept='image/*'
            disabled={uploading}
            className='flex-grow'
          />
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className='w-full sm:w-auto'
          >
            {uploading ? (
              'Uploading...'
            ) : (
              <>
                <Upload className='mr-2 h-4 w-4' /> Upload
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
