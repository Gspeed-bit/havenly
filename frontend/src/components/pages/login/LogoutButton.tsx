import React from 'react';
import {logOutUser} from '../../../services/auth';
import { Button } from '../../ui/button';

const LogoutButton = () => {

  const handleLogout = () => {
    logOutUser();
  };

  return <Button onClick={handleLogout}>Log Out</Button>;
};

export default LogoutButton;
