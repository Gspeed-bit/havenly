'use client';


import { EditProperty } from '@/components/pages/Properties/Edit-property';
import { useParams } from 'next/navigation';

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Edit Property</h1>
      <EditProperty propertyId={propertyId} />
    </div>
  );
}
