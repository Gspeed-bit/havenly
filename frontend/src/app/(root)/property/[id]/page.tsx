'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { UserPropertyDetails } from '@/components/pages/Properties/UserPropertyDetails';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  return (
    <div>
      <UserPropertyDetails propertyId={id} />
    </div>
  );
};

export default Page;
