'use client';

import { EditCompanyForm } from '@/components/pages/Company/EditCompanyForm';
import { useParams } from 'next/navigation';


export default function EditCompanyPage() {
  const { id } = useParams();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Edit Company</h1>
      <EditCompanyForm companyId={id as string} />
    </div>
  );
}
