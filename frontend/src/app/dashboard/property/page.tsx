'use client';
import PropertyForm from '@/components/pages/Properties/PropertyForm';
import React from 'react';

const page = () => {
  return (
    <div>
      <PropertyForm
        onSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
};

export default page;
