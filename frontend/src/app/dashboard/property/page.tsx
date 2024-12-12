'use client';
import PropertyForm from '@/components/pages/Properties/PropertyForm';
import PropertiesPage from '@/components/pages/Properties/PropertyList';
import React from 'react';

const page = () => {
  return (
    <div>
      <PropertyForm
        onSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <PropertiesPage />
    </div>
  );
};

export default page;
