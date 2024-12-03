'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Icon from '../common/icon/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin } = useAuthStore((state) => state);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
      }
      setChecked(true);
    };

    checkAndRedirect();
  }, [isAuthenticated, isAdmin, router]);

  if (!checked) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Icon
          color={'#3A0CA3'}
          type='Loader2'
          size={48}
          className='animate-spin'
        />
      </div>
    );
  }
  return <>{children}</>;
}
