import React from 'react';
import AuthForm from '../../../../components/pages/login/AuthForm';
import NotAuthenticated from '@/components/authLayout/NotAuthenticated';

const page = () => {
  return (
    <NotAuthenticated>
      <AuthForm />
    </NotAuthenticated>
  );
};

export default page;
