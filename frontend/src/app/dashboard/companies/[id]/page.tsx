'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  fetchCompanyById,
  CompanyData,
} from '@/services/company/companyApiHandler';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchCompanyById(id as string);
        if (response.status === 'success' && response.data) {
          setCompany(response.data.company);
        } else {
          setError(response.message || 'Failed to load company details');
        }
      } catch (err) {
        setError('An error occurred while fetching company details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCompany();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-4'>
            <Avatar className='h-16 w-16 border-2 border-primary'>
              <AvatarImage src={company.logo} />
              <AvatarFallback className='bg-primary text-primary-foreground text-2xl'>
                {company.name?.[0]?.toUpperCase() || 'C'}
              </AvatarFallback>
            </Avatar>
            <span>{company.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {[
              { label: 'Email', value: company.email },
              { label: 'Phone', value: company.phoneNumber },
              { label: 'Address', value: company.address },
              { label: 'Website', value: company.website || 'N/A' },
            ].map((item) => (
              <div key={item.label} className='border-t border-gray-200 pt-4'>
                <dt className='font-medium text-gray-500'>{item.label}</dt>
                <dd className='mt-1 text-sm text-gray-900'>{item.value}</dd>
              </div>
            ))}
          </dl>
          {company.description && (
            <div className='border-t border-gray-200 pt-4 mt-4'>
              <dt className='font-medium text-gray-500'>Description</dt>
              <dd className='mt-1 text-sm text-gray-900'>
                {company.description}
              </dd>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
