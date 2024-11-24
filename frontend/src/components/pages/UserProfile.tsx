import { useAuthStore } from '../../store/auth';
import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [hydrated, setHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Ensure hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Avoid rendering on the server

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
