'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  fetchCompanies,
  CompanyData,
} from '@/services/company/companyApiHandler';

import { Button } from '@/components/ui/button';
import { CompanyList } from '@/components/pages/Company/CompanyList';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchCompanies();

    if (response.status === 'success' && response.data) {
      setCompanies(response.data.companies);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Companies</h1>
        <Link href='/dashboard/companies/create'>
          <Button>Create New Company</Button>
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <CompanyList companies={companies} onCompanyDeleted={loadCompanies} />
    </div>
  );
}
