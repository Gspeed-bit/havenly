import { useAllUsers } from "@/components/hooks/api/useAllUsers";


const AdminUsersList = () => {
  
  const { users, loading } = useAllUsers();

  console.log('Fetched users:', users); 

  if (loading) return <div>Loading users...</div>;

  if (!users || users.length === 0) return <div>No users found</div>;

  return (
    <div>
      <h2>Admin Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.firstName} {user.lastName} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default AdminUsersList;
