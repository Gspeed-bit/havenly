import NotAuthenticated from '@/components/authLayout/NotAuthenticated';
import ResetPasswordPage from '@/components/pages/login/auth/ResetPasswordPage';
import React from 'react';

const page = () => {
  return (
    <NotAuthenticated>
      <ResetPasswordPage />
    </NotAuthenticated>
  );
};

export default page;
