import CompaniesPage from '@/components/pages/Company/companies';
import CreateCompanyForm from '@/components/pages/Company/CreateCompanyForm';
import React from 'react';

const page = () => {
  return (
    <div>
      <CreateCompanyForm />
      <CompaniesPage />
    </div>
  );
};

export default page;
