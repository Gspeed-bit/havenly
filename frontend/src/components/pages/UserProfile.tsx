import { useAuthStore } from '../../store/auth';

const UserProfile = () => {
  // Accessing the user from the Zustand store
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div>
      {isAuthenticated && user ? (
        <div>
          <h1>
            {user.firstName} {user.lastName}
          </h1>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phoneNumber}</p>
        </div>
      ) : (
        <p>User is not logged in</p>
      )}
    </div>
  );
};

export default UserProfile;
