import { ApiResponse } from '@/config/server';
import { User } from '@/services/types/user.types';
import { fetchAllAdminsApi, fetchAllUsersApi } from '@/services/user/userApi';
import { useEffect, useState } from 'react';


const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userResponse: ApiResponse<{ data: User[] }> = await fetchAllUsersApi();
        if (userResponse.status === 'success') {
          setUsers(userResponse.data.data);
        } else {
          setError(userResponse.message);
        }

        const adminResponse: ApiResponse<{ data: User[] }> = await fetchAllAdminsApi();
        if (adminResponse.status === 'success') {
          setAdmins(adminResponse.data.data);
        } else {
          setError(adminResponse.message);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.firstName} {user.lastName} - {user.email}
          </li>
        ))}
      </ul>

      <h1>Admins</h1>
      <ul>
        {admins.map((admin) => (
          <li key={admin._id}>
            {admin.firstName} {admin.lastName} - {admin.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
