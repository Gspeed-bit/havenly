import { CreatePropertyForm } from '@/components/pages/Properties/PropertyForm';
import React from 'react';

const page = () => {
  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Create New Property</h1>
      <CreatePropertyForm />
    </main>
  );
};

export default page;
