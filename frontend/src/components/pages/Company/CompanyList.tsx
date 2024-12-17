'use client';

import Link from 'next/link';
import {
  CompanyData,
  deleteCompany,
} from '@/services/company/companyApiHandler';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface CompanyListProps {
  companies: CompanyData[];
  onCompanyDeleted: () => void;
}

export function CompanyList({ companies, onCompanyDeleted }: CompanyListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      const response = await deleteCompany(id);
      if (response.status === 'success') {
        alert('Company deleted successfully');
        onCompanyDeleted();
      } else {
        alert(response.message);
      }
    }
  };

  return (
    <ul className='space-y-4'>
      {companies.length === 0 ? (
        <li>No companies found.</li>
      ) : (
        companies.map((company) => (
          <li
            key={company._id}
            className='flex items-center space-x-4 bg-white p-4 rounded-lg shadow'
          >
            <Avatar className='h-10 w-10 border-2 border-primary'>
              <AvatarImage src={company.logo} />
              <AvatarFallback className='bg-primary text-primary-foreground'>
                {company.name?.[0]?.toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            <span className='flex-1'>
              <Link href={`/dashboard/companies/${company._id}`}>
                <p className='text-primary font-semibold'>{company.name}</p>
              </Link>
            </span>
            <Link href={`/dashboard/companies/edit/${company._id}`}>
              <Button variant='outline' size='sm' className='mr-2'>
                Edit
              </Button>
            </Link>
            <Button
              onClick={() => company._id && handleDelete(company._id)}
              variant='destructive'
              size='sm'
            >
              Delete
            </Button>
          </li>
        ))
      )}
    </ul>
  );
}
