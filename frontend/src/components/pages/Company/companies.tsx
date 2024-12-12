'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  deleteCompany,
  fetchCompanies,
  CompanyData,
} from '@/services/company/companyApiHandler';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Adjust the import path as needed

const CompaniesPage = () => {
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      const response = await deleteCompany(id);
      if (response.status === 'success') {
        alert('Company deleted successfully');
        loadCompanies();
      } else {
        alert(response.message);
      }
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return (
    <div>
      <h1>Companies</h1>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      <ul>
        {companies.length === 0 ? (
          <li>No companies found.</li>
        ) : (
          companies.map((company) => (
            <li key={company._id} className='flex items-center space-x-4'>
              <Avatar className='h-10 w-10 border-2 border-primary'>
                <AvatarImage src={company.logo} />
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  {company.name?.[0]?.toUpperCase() || 'C'}
                </AvatarFallback>
              </Avatar>
              <span className='flex-1'>
                <Link href={`/dashboard/companies/${company._id}`}>
                  <p className='text-primary_main'>{company.name}</p>
                </Link>
              </span>
              <button
                onClick={() => company._id && handleDelete(company._id)}
                className='text-red-500'
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CompaniesPage;
