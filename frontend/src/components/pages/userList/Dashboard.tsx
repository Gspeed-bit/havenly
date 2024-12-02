import React, { useEffect, useState } from 'react';

interface AdminData {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

const Dashboard = () => {
  const [adminData, setAdminData] = useState<AdminData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://havenly-chdr.onrender.com/user/admin'
        );
        const data = await response.json();
        if (data.status === 'success') {
          setAdminData(data.data);
        } else {
          setError('Unexpected response format');
        }
      } catch {
        setError('Failed to fetch admin data');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className='error-message'>{error}</div>;
  }

  return (
    <div className='admin-dashboard'>
      <h1>Admin Dashboard</h1>
      <ul>
        {adminData.map((admin) => (
          <li key={admin._id}>
            <p>
              Name: {admin.firstName} {admin.lastName}
            </p>
            <p>Email: {admin.email}</p>
            <p>Phone: {admin.phoneNumber}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
