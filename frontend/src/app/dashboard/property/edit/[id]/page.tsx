"use client"
import { EditPropertyForm } from '@/components/pages/Properties/Edit-property';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  return (
    <div>
      <EditPropertyForm id={id} />
    </div>
  );
};

export default Page;
