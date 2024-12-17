'use client';

import { CreateCompanyForm } from "@/components/pages/Company/CreateCompanyForm";



export default function CreateCompanyPage() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Create New Company</h1>
      <CreateCompanyForm />
    </div>
  );
}
