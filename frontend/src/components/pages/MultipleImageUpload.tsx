'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface PropertyImageUploadProps {
  propertyId: string;
  onUploadComplete: (images: { url: string; public_id: string }[]) => void;
}

export function PropertyImageUpload({
  propertyId,
  onUploadComplete,
}: PropertyImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('propertyId', propertyId);
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/image/properties/upload-multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUploadComplete(result.data);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className='p-4'>
        <Input
          type='file'
          multiple
          onChange={handleFileChange}
          className='mb-4'
          ref={fileInputRef}
          accept='image/*'
        />
        <div className='grid grid-cols-3 gap-4 mb-4'>
          {selectedFiles.map((file, index) => (
            <div key={index} className='relative'>
              <img
                src={URL.createObjectURL(file)}
                alt={`Selected ${index + 1}`}
                className='w-full h-32 object-cover rounded'
              />
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
        <Button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </Button>
      </CardContent>
    </Card>
  );
}
