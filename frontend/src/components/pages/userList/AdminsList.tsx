// AdminsList.tsx

import { useAdmins } from '@/components/hooks/api/useAdmins';
import React from 'react';

const AdminsList = () => {
  const { admins, loading } = useAdmins();

  if (loading) return <div>Loading admins...</div>;

  if (!admins || admins.length === 0) return <div>No admins found</div>;

  return (
    <div>
      <h2>Admins List</h2>
      <ul>
        {admins.map((admin) => (
          <>
            <li key={admin._id}>
              {admin.firstName} {admin.lastName}
            </li>
            <li key={admin._id}>{admin.email}</li>
            <li key={admin._id}>{admin.phoneNumber}</li>
            <li key={admin._id}>{admin.isAdmin}</li>
          </>
        ))}
      </ul>
    </div>
  );
};

export default AdminsList;
