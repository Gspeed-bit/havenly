// pages/companies/index.tsx
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
    if (response.status === 'success') {
      setCompanies(response.data);
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
      {!loading && !error && companies.length === 0 && (
        <p>No companies found.</p>
      )}
      <ul>
        {companies.map((company) => (
          <li key={company._id}>
            <span>{company.name}</span>
            <button onClick={() => company._id && handleDelete(company._id)}>
              Delete
            </button>
            <a href={`/companies/${company._id}`}>View</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompaniesPage;
