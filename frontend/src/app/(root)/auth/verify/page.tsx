import NotAuthenticated from '@/components/authLayout/NotAuthenticated';
import VerificationPage from '@/components/pages/login/auth/VerificationPage';
import React from 'react';

const page = () => {
  return (
    <NotAuthenticated>
      <VerificationPage />
    </NotAuthenticated>
  );
};

export default page;
