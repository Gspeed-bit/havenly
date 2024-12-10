'use client';
import {
  deleteCompany,
  fetchCompanies,
  CompanyData,
} from '@/services/company/companyApiHandler';
import { useEffect, useState } from 'react';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    const response = await fetchCompanies();

    if (response.status === 'success' && response.data) {
      setCompanies(response.data.companies); // Make sure to access companies from response.data
      console.log('Fetched companies:', response.data.companies);
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
        loadCompanies(); // Refresh the list
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
              {company.logo && (
                <picture>
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                </picture>
              )}
              <span className='flex-1'>{company.name}</span>
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
