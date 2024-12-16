import { PropertyList } from '@/components/pages/Properties/PropertyList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import React from 'react';

const page = () => {
  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Available Properties</h1>
        <Link href='/dashboard/property/create'>
          <Button>Create Property</Button>
        </Link>
      </div>
      <PropertyList />
    </main>
  );
};

export default page;
