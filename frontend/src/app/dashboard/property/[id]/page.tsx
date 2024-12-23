'use client';
import React from 'react';
import { PropertyDetails } from '@/components/pages/Properties/PropertyDetails';
import { useParams } from 'next/navigation';
const Page = () => {
  const params = useParams();
  const id = params.id as string;
  return (
    <div>
      <PropertyDetails id={id} />
    </div>
  );
};

export default Page;
